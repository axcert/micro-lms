<?php
return [
    'onepay' => [
        'merchant_id' => env('ONEPAY_MERCHANT_ID'),
        'api_key' => env('ONEPAY_API_KEY'),
        'api_secret' => env('ONEPAY_API_SECRET'),
        'base_url' => env('ONEPAY_BASE_URL', 'https://payment.onepay.lk'),
        'return_url' => env('APP_URL') . '/payment/onepay/return',
        'cancel_url' => env('APP_URL') . '/payment/onepay/cancel',
    ],
    
    'payhere' => [
        'merchant_id' => env('PAYHERE_MERCHANT_ID'),
        'merchant_secret' => env('PAYHERE_MERCHANT_SECRET'),
        'base_url' => env('PAYHERE_BASE_URL', 'https://sandbox.payhere.lk'),
        'return_url' => env('APP_URL') . '/payment/payhere/return',
        'cancel_url' => env('APP_URL') . '/payment/payhere/cancel',
        'notify_url' => env('APP_URL') . '/payment/payhere/notify',
    ],
    
    'default_currency' => 'LKR',
    'payment_timeout_minutes' => 15,
];