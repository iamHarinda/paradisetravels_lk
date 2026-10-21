<?php
// Lead pipeline for the static site on Hostinger shared hosting (no Node): replaces the old Astro API routes.
// validate → spam checks (honeypot, rate limit, Turnstile) → staff email → traveller confirmation → optional webhook.
// Secrets live OUTSIDE the web root in paradise-config.php (copy of paradise-config.sample.php), next to public_html.
// Responses mirror what src/scripts/forms.ts expects: JSON {ok, redirect} / {ok:false, message, fieldErrors}.

declare(strict_types=1);

const SITE_NAME = 'Paradise Travels';
const LEGAL_NAME = 'Paradise Travels (Pvt) Ltd';
const SITE_PHONE = '+94 77 393 9989';
const SITE_EMAIL = 'hello@paradisetravels.lk';
const SITE_ADDRESS = 'No. 08, Old Kottawa Road, Mirihana, Nugegoda 10250, Sri Lanka';
const WHATSAPP = 'https://wa.me/94773939989';

function pt_config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $defaults = [
        'mail_to' => SITE_EMAIL,
        'mail_from' => SITE_EMAIL,
        'mail_from_name' => SITE_NAME,
        'turnstile_secret' => '',
        'lead_webhook_url' => '',
    ];
    // Preferred: one level above public_html. Fallback for hosts whose open_basedir stops PHP reading there:
    // public_html/api/paradise-config.php (blocked from the web by .htaccess, and it prints nothing if run).
    $cfg = $defaults;
    foreach ([dirname(__DIR__, 2) . '/paradise-config.php', __DIR__ . '/paradise-config.php'] as $file) {
        if (@is_file($file)) {
            $cfg = array_merge($defaults, (array) require $file);
            break;
        }
    }
    return $cfg;
}

function pt_wants_json(): bool
{
    return str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
}

function pt_esc($s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function pt_layout(string $title, string $body): string
{
    return '<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0;background:#F6F8FC;padding:24px;font:15px/1.6 Arial,sans-serif;color:#0b1730">'
        . '<div style="max-width:600px;margin:auto;background:#fff;border-radius:12px;overflow:hidden">'
        . '<div style="background:#0a1f44;color:#fff;padding:20px 24px;font:700 20px Georgia,serif;border-bottom:3px solid #d9a94a">' . pt_esc(SITE_NAME) . '</div>'
        . '<div style="padding:24px"><h1 style="font:600 22px Georgia,serif;margin:0 0 16px">' . pt_esc($title) . '</h1>' . $body . '</div>'
        . '<div style="padding:16px 24px;background:#EAF0F9;font-size:12px;color:#4d5b75">' . pt_esc(LEGAL_NAME . ' · ' . SITE_ADDRESS . ' · ' . SITE_PHONE) . '</div>'
        . '</div></body></html>';
}

function pt_respond(int $status, array $json, ?string $redirect = null, string $html = ''): never
{
    http_response_code($status);
    header('Cache-Control: no-store');
    if (pt_wants_json()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } elseif ($redirect) {
        http_response_code(303);
        header('Location: ' . $redirect);
    } else {
        header('Content-Type: text/html; charset=utf-8');
        echo $html;
    }
    exit;
}

function pt_error(int $status, string $message, array $fieldErrors = []): never
{
    $list = '';
    foreach ($fieldErrors as $e) $list .= '<li>' . pt_esc($e) . '</li>';
    $html = pt_layout(
        'We could not send your request',
        '<p>' . pt_esc($message) . '</p>' . ($list ? "<ul>$list</ul>" : '')
            . '<p><a href="javascript:history.back()">Go back and try again</a> or WhatsApp us on ' . pt_esc(SITE_PHONE) . '.</p>'
    );
    pt_respond($status, ['ok' => false, 'message' => $message, 'fieldErrors' => (object) $fieldErrors], null, $html);
}

function pt_success(string $kind, string $lang): never
{
    $location = ($lang === 'ko' ? '/ko' : '') . '/thank-you?type=' . rawurlencode($kind);
    pt_respond(200, ['ok' => true, 'redirect' => $location], $location);
}

/** 5 submissions / 10 minutes / IP, stored in the temp dir (shared hosting has no shared memory). */
function pt_rate_limited(string $ip, int $limit = 5, int $window = 600): bool
{
    $file = sys_get_temp_dir() . '/pt-rate-' . hash('sha256', $ip);
    $now = time();
    $hits = is_file($file) ? array_filter(array_map('intval', explode(',', (string) file_get_contents($file))), fn ($t) => $now - $t < $window) : [];
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits), LOCK_EX);
    return count($hits) > $limit;
}

function pt_post(string $url, array|string $body, array $headers = []): ?string
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => is_array($body) ? http_build_query($body) : $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
        CURLOPT_HTTPHEADER => $headers,
    ]);
    $res = curl_exec($ch);
    curl_close($ch);
    return is_string($res) ? $res : null;
}

function pt_turnstile_ok(?string $token, string $ip): bool
{
    $secret = pt_config()['turnstile_secret'];
    if ($secret === '') return true; // not configured yet (docs/CONTENT-TODO.md §9)
    if (!$token) return false;
    $res = pt_post('https://challenges.cloudflare.com/turnstile/v0/siteverify', ['secret' => $secret, 'response' => $token, 'remoteip' => $ip]);
    $data = $res ? json_decode($res, true) : null;
    return is_array($data) && !empty($data['success']);
}

function pt_mail(string $to, string $subject, string $html, string $text, ?string $replyTo = null): bool
{
    $cfg = pt_config();
    $boundary = 'pt-' . bin2hex(random_bytes(8));
    $from = mb_encode_mimeheader($cfg['mail_from_name'], 'UTF-8') . ' <' . $cfg['mail_from'] . '>';
    $headers = [
        'MIME-Version: 1.0',
        'From: ' . $from,
        'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    ];
    if ($replyTo && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) $headers[] = 'Reply-To: ' . $replyTo;
    $body = "--$boundary\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($text))
        . "--$boundary\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html))
        . "--$boundary--";
    return mail($to, mb_encode_mimeheader($subject, 'UTF-8'), $body, implode("\r\n", $headers), '-f' . $cfg['mail_from']);
}

/** Field reader: trims, caps length, returns '' when missing. Arrays come from `name[]` inputs. */
function pt_field(string $name, int $max = 200): string
{
    $v = $_POST[$name] ?? '';
    if (is_array($v)) return '';
    return mb_substr(trim((string) $v), 0, $max);
}

function pt_list(string $name, int $maxItems = 20): array
{
    $v = $_POST[$name] ?? [];
    $v = is_array($v) ? $v : [$v];
    return array_slice(array_values(array_filter(array_map(fn ($s) => mb_substr(trim((string) $s), 0, 60), $v), 'strlen')), 0, $maxItems);
}

/**
 * @param array<string, int> $extra  extra text fields => max length
 */
function pt_handle(string $kind, string $label, array $extra, ?callable $validate = null): never
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') pt_error(405, 'Please use the form on our website.');

    $ip = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $lang = ($_POST['language'] ?? '') === 'ko' ? 'ko' : 'en';
    $ko = $lang === 'ko';

    if (pt_field('company_website') !== '') pt_success($kind, $lang); // honeypot: pretend success
    if (getenv('PT_NO_RATE_LIMIT') !== '1' && pt_rate_limited($ip)) { // flag is only set by the local test server
        pt_error(429, $ko ? '요청이 너무 많습니다. 잠시 후 다시 시도하시거나 왓츠앱으로 연락해 주세요.' : 'Too many requests — please wait a few minutes, or message us on WhatsApp.');
    }
    if (!pt_turnstile_ok($_POST['cf-turnstile-response'] ?? null, $ip)) {
        pt_error(400, $ko ? '스팸 확인에 실패했습니다. 다시 시도해 주세요.' : 'The spam check failed. Please try again.');
    }

    $data = [
        'name' => pt_field('name', 120),
        'email' => pt_field('email', 200),
        'phoneCode' => pt_field('phoneCode', 8),
        'phone' => pt_field('phone', 30),
        'country' => pt_field('country', 80),
        'preferredContact' => in_array($_POST['preferredContact'] ?? '', ['whatsapp', 'email', 'kakao', 'phone'], true) ? $_POST['preferredContact'] : 'email',
        'page' => pt_field('page', 300),
        'utm_source' => pt_field('utm_source', 100),
        'utm_medium' => pt_field('utm_medium', 100),
        'utm_campaign' => pt_field('utm_campaign', 100),
        'language' => $lang,
    ];
    foreach ($extra as $field => $max) $data[$field] = $max === -1 ? pt_list($field) : pt_field($field, $max);

    $errors = [];
    if (mb_strlen($data['name']) < 2) $errors['name'] = $ko ? '이름을 입력해 주세요.' : 'Please tell us your name.';
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = $ko ? '올바른 이메일 주소를 입력해 주세요.' : 'Please enter a valid email address.';
    if ($validate) $errors += $validate($data, $ko);
    if ($errors) pt_error(422, $ko ? '표시된 항목을 확인해 주세요.' : 'Please check the highlighted fields.', $errors);

    $phone = $data['phone'] !== '' ? trim($data['phoneCode'] . ' ' . $data['phone']) : '';
    $lead = ['kind' => $kind, 'receivedAt' => gmdate('c'), 'ip' => $ip] + $data + ['phone' => $phone];
    unset($lead['phoneCode']);

    // Staff email
    $rows = '';
    foreach ($lead as $k => $v) {
        $v = is_array($v) ? implode(', ', $v) : (string) $v;
        if ($v === '') continue;
        $rows .= '<tr><th style="text-align:left;padding:6px 12px 6px 0;vertical-align:top">' . pt_esc($k) . '</th><td style="padding:6px 0">' . nl2br(pt_esc($v)) . '</td></tr>';
    }
    $wa = preg_replace('/\D/', '', $phone);
    $staffHtml = pt_layout(
        "$label from {$data['name']}",
        ($wa ? '<p><a href="https://wa.me/' . $wa . '" style="color:#123a7a;font-weight:700">Reply on WhatsApp</a></p>' : '') . "<table>$rows</table>"
    );
    $ok = pt_mail(pt_config()['mail_to'], "$label — {$data['name']}", $staffHtml, json_encode($lead, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), $data['email']);
    if (!$ok) {
        pt_error(502, $ko
            ? '전송 중 문제가 발생했습니다. ' . SITE_EMAIL . ' 또는 왓츠앱 ' . SITE_PHONE . '으로 연락해 주세요.'
            : 'Sorry — something went wrong sending your request. Please email ' . SITE_EMAIL . ' or WhatsApp ' . SITE_PHONE . '.');
    }

    // Traveller confirmation (best effort)
    if ($ko) {
        pt_mail(
            $data['email'],
            '문의가 접수되었습니다 — ' . SITE_NAME,
            pt_layout($data['name'] . '님, 감사합니다', '<p>문의가 접수되었습니다. 콜롬보 팀이 확인 후 최대한 빨리 답변 드리겠습니다.</p><p>급한 경우 카카오톡 또는 <a href="' . WHATSAPP . '" style="color:#123a7a;font-weight:700">왓츠앱</a>(' . pt_esc(SITE_PHONE) . ')으로 연락 주세요.</p>'),
            $data['name'] . "님, 안녕하세요.\n\n문의해 주셔서 감사합니다. 콜롬보 팀이 확인 후 최대한 빨리 답변 드리겠습니다.\n\n급한 경우 카카오톡 또는 왓츠앱(" . SITE_PHONE . ")으로 연락 주세요.\n\n" . LEGAL_NAME
        );
    } else {
        $what = strtolower($label);
        pt_mail(
            $data['email'],
            'We’ve received your request — ' . SITE_NAME,
            pt_layout('Thank you, ' . $data['name'], '<p>We have received your ' . pt_esc($what) . ' and a member of our Colombo team will reply as soon as possible.</p><p>If it is urgent, <a href="' . WHATSAPP . '" style="color:#123a7a;font-weight:700">message us on WhatsApp</a> (' . pt_esc(SITE_PHONE) . ').</p>'),
            "Hello {$data['name']},\n\nThank you — we have received your $what and will reply as soon as possible.\n\nIf it is urgent, message us on WhatsApp: " . SITE_PHONE . "\n\n" . LEGAL_NAME
        );
    }

    $hook = pt_config()['lead_webhook_url'];
    if ($hook !== '') pt_post($hook, json_encode($lead, JSON_UNESCAPED_UNICODE), ['Content-Type: application/json']);

    pt_success($kind, $lang);
}
