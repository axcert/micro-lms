<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Zoom API Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration settings for Zoom API integration
    |
    */

    'api_key' => env('ZOOM_API_KEY'),
    'api_secret' => env('ZOOM_API_SECRET'),
    'user_id' => env('ZOOM_USER_ID', 'me'),

    /*
    |--------------------------------------------------------------------------
    | Default Meeting Settings
    |--------------------------------------------------------------------------
    |
    | Default settings applied to all Zoom meetings created through the app
    |
    */

    'default_settings' => [
        'host_video' => true,
        'participant_video' => true,
        'cn_meeting' => false,
        'in_meeting' => false,
        'join_before_host' => false,
        'mute_upon_entry' => true,
        'watermark' => false,
        'use_pmi' => false,
        'approval_type' => 2, // No registration required
        'audio' => 'both',
        'auto_recording' => 'none',
        'enforce_login' => false,
        'waiting_room' => true,
        'registrants_confirmation_email' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Meeting Types
    |--------------------------------------------------------------------------
    |
    | Available Zoom meeting types
    |
    */

    'meeting_types' => [
        1 => 'Instant Meeting',
        2 => 'Scheduled Meeting',
        3 => 'Recurring Meeting with no fixed time',
        8 => 'Recurring Meeting with fixed time',
    ],

    /*
    |--------------------------------------------------------------------------
    | Recording Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for meeting recordings
    |
    */

    'recording' => [
        'auto_recording' => env('ZOOM_AUTO_RECORDING', 'none'), // none, local, cloud
        'auto_delete_cmr' => env('ZOOM_AUTO_DELETE_CMR', false),
        'auto_delete_cmr_days' => env('ZOOM_AUTO_DELETE_CMR_DAYS', 0),
    ],

    /*
    |--------------------------------------------------------------------------
    | Webhook Configuration
    |--------------------------------------------------------------------------
    |
    | Settings for Zoom webhooks
    |
    */

    'webhook' => [
        'verification_token' => env('ZOOM_WEBHOOK_VERIFICATION_TOKEN'),
        'secret_token' => env('ZOOM_WEBHOOK_SECRET_TOKEN'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | API rate limiting settings
    |
    */

    'rate_limit' => [
        'requests_per_second' => 10,
        'daily_limit' => 100000,
    ],

];