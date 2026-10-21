<?php
// Copy to the Hostinger home directory as  ~/paradise-config.php  (one level ABOVE public_html — never inside it).
// Read by public/api/_lead.php. Leave a value empty to use the default / skip that feature.
return [
    'mail_to' => 'hello@paradisetravels.lk',       // where enquiries arrive
    'mail_from' => 'hello@paradisetravels.lk',     // must be a mailbox on this domain (Hostinger email)
    'mail_from_name' => 'Paradise Travels',
    'turnstile_secret' => '',                       // Cloudflare Turnstile secret key (site key goes in the build env)
    'lead_webhook_url' => '',                       // optional: Google Apps Script / Make / Zapier URL that stores leads
];
