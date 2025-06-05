<?php
return [
    'api_url' => env('WHATSAPP_API_URL'),
    'api_token' => env('WHATSAPP_API_TOKEN'),
    'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
    'verify_token' => env('WHATSAPP_VERIFY_TOKEN'),
    
    'default_settings' => [
        'send_class_reminders' => true,
        'send_quiz_notifications' => true,
        'reminder_time_minutes' => 30,
    ],
];