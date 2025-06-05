<?php
// app/Services/ZoomService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ZoomService
{
    protected $baseUrl;
    protected $apiKey;
    protected $apiSecret;
    protected $jwtToken;

    public function __construct()
    {
        $this->baseUrl = config('zoom.base_url');
        $this->apiKey = config('zoom.api_key');
        $this->apiSecret = config('zoom.api_secret');
        $this->jwtToken = config('zoom.jwt_token');
    }

    /**
     * Create a Zoom meeting
     */
    public function createMeeting(array $meetingData)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->jwtToken,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/users/me/meetings', [
                'topic' => $meetingData['topic'],
                'type' => 2, // Scheduled meeting
                'start_time' => $meetingData['start_time'],
                'duration' => $meetingData['duration'] ?? 60,
                'timezone' => config('zoom.default_settings.timezone'),
                'settings' => array_merge(
                    config('zoom.default_settings'),
                    $meetingData['settings'] ?? []
                ),
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Zoom meeting creation failed', ['response' => $response->json()]);
            return null;
        } catch (\Exception $e) {
            Log::error('Zoom service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Update a Zoom meeting
     */
    public function updateMeeting($meetingId, array $meetingData)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->jwtToken,
                'Content-Type' => 'application/json',
            ])->patch($this->baseUrl . '/meetings/' . $meetingId, $meetingData);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Zoom meeting update error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete a Zoom meeting
     */
    public function deleteMeeting($meetingId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->jwtToken,
            ])->delete($this->baseUrl . '/meetings/' . $meetingId);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Zoom meeting deletion error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get meeting details
     */
    public function getMeeting($meetingId)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->jwtToken,
            ])->get($this->baseUrl . '/meetings/' . $meetingId);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('Zoom get meeting error: ' . $e->getMessage());
            return null;
        }
    }
}