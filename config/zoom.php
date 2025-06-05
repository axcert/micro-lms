<?php
return [
    'api_key' => env('ZOOM_API_KEY'),
    'api_secret' => env('ZOOM_API_SECRET'),
    'base_url' => env('ZOOM_BASE_URL', 'https://api.zoom.us/v2'),
    'jwt_token' => env('ZOOM_JWT_TOKEN'),
    
    'default_settings' => [
        'duration' => 60,
        'timezone' => 'Asia/Colombo',
        'waiting_room' => true,
        'auto_recording' => 'cloud',
        'mute_participants' => true,
    ],
];