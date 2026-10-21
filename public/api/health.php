<?php
// Uptime monitoring endpoint (docs/08 §10).
header('Content-Type: application/json');
header('Cache-Control: no-store');
echo json_encode(['ok' => true, 'time' => gmdate('c')]);
