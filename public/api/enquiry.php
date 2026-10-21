<?php
// POST /api/enquiry.php — contact / enquiry forms (EnquiryForm.astro).
declare(strict_types=1);
require __DIR__ . '/_lead.php';

pt_handle('enquiry', 'Enquiry', ['subject' => 150, 'message' => 5000], function (array $d, bool $ko): array {
    return mb_strlen($d['message']) < 5 ? ['message' => $ko ? '문의 내용을 간단히 적어 주세요.' : 'Please add a short message.'] : [];
});
