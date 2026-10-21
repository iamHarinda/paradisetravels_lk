<?php
// POST /api/trip-builder.php — "Plan your trip" form (TripBuilder.astro).
declare(strict_types=1);
require __DIR__ . '/_lead.php';

pt_handle('trip-builder', 'Trip plan request', [
    'startDate' => 20, 'month' => 20, 'flexible' => 10, 'days' => 3, 'adults' => 3, 'children' => 2,
    'childAges' => 100, 'occasion' => 40, 'interests' => -1, 'style' => 40, 'hotelClass' => 40,
    'transport' => 40, 'needFlights' => 10, 'needVisa' => 10, 'where' => 200, 'tour' => 200, 'notes' => 3000,
]);
