<?php

namespace App\Services;

use Exception;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class ZoomService
{
    private $client;
    private $apiKey;
    private $apiSecret;
    private $baseUrl = 'https://api.zoom.us/v2/';
    private $jwtToken;

    public function __construct()
    {
        $this->apiKey = config('zoom.api_key');
        $this->apiSecret = config('zoom.api_secret');
        
        $this->client = new Client([
            'base_uri' => $this->baseUrl,
            'timeout' => 30,
        ]);

        // Generate JWT token for API authentication
        $this->jwtToken = $this->generateJwtToken();
    }

    /**
     * Generate JWT token for Zoom API authentication
     */
    private function generateJwtToken()
    {
        if (!$this->apiKey || !$this->apiSecret) {
            throw new Exception('Zoom API credentials not configured');
        }

        $header = [
            'typ' => 'JWT',
            'alg' => 'HS256'
        ];

        $payload = [
            'iss' => $this->apiKey,
            'exp' => time() + 3600, // Token expires in 1 hour
            'iat' => time(),
            'aud' => 'zoom'
        ];

        $headerEncoded = base64url_encode(json_encode($header));
        $payloadEncoded = base64url_encode(json_encode($payload));

        $signature = hash_hmac('sha256', $headerEncoded . '.' . $payloadEncoded, $this->apiSecret, true);
        $signatureEncoded = base64url_encode($signature);

        return $headerEncoded . '.' . $payloadEncoded . '.' . $signatureEncoded;
    }

    /**
     * Create a new Zoom meeting
     */
    public function createMeeting(array $meetingData)
    {
        try {
            $userId = config('zoom.user_id', 'me'); // Use configured user ID or 'me' for API key owner
            
            $defaultSettings = [
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
            ];

            $requestData = [
                'topic' => $meetingData['topic'] ?? 'Class Session',
                'type' => 2, // Scheduled meeting
                'start_time' => $meetingData['start_time'] ?? Carbon::now()->addHour()->toISOString(),
                'duration' => $meetingData['duration'] ?? 60,
                'timezone' => config('app.timezone', 'UTC'),
                'password' => $meetingData['password'] ?? null,
                'agenda' => $meetingData['agenda'] ?? '',
                'settings' => array_merge($defaultSettings, $meetingData['settings'] ?? [])
            ];

            // Remove null password if not provided
            if (empty($requestData['password'])) {
                unset($requestData['password']);
            }

            $response = $this->client->post("users/{$userId}/meetings", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->jwtToken,
                    'Content-Type' => 'application/json',
                ],
                'json' => $requestData
            ]);

            $meeting = json_decode($response->getBody()->getContents(), true);

            Log::info('Zoom meeting created successfully', [
                'meeting_id' => $meeting['id'],
                'topic' => $meeting['topic']
            ]);

            return $meeting;

        } catch (GuzzleException $e) {
            Log::error('Failed to create Zoom meeting', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('Failed to create Zoom meeting: ' . $e->getMessage());
        }
    }

    /**
     * Update an existing Zoom meeting
     */
    public function updateMeeting($meetingId, array $meetingData)
    {
        try {
            $requestData = [
                'topic' => $meetingData['topic'] ?? null,
                'start_time' => $meetingData['start_time'] ?? null,
                'duration' => $meetingData['duration'] ?? null,
                'password' => $meetingData['password'] ?? null,
                'agenda' => $meetingData['agenda'] ?? null,
            ];

            // Remove null values
            $requestData = array_filter($requestData, function($value) {
                return $value !== null;
            });

            $response = $this->client->patch("meetings/{$meetingId}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->jwtToken,
                    'Content-Type' => 'application/json',
                ],
                'json' => $requestData
            ]);

            Log::info('Zoom meeting updated successfully', [
                'meeting_id' => $meetingId
            ]);

            return json_decode($response->getBody()->getContents(), true);

        } catch (GuzzleException $e) {
            Log::error('Failed to update Zoom meeting', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('Failed to update Zoom meeting: ' . $e->getMessage());
        }
    }

    /**
     * Delete a Zoom meeting
     */
    public function deleteMeeting($meetingId)
    {
        try {
            $this->client->delete("meetings/{$meetingId}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->jwtToken,
                ],
            ]);

            Log::info('Zoom meeting deleted successfully', [
                'meeting_id' => $meetingId
            ]);

            return true;

        } catch (GuzzleException $e) {
            Log::error('Failed to delete Zoom meeting', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('Failed to delete Zoom meeting: ' . $e->getMessage());
        }
    }

    /**
     * Get meeting details
     */
    public function getMeeting($meetingId)
    {
        try {
            $response = $this->client->get("meetings/{$meetingId}", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->jwtToken,
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);

        } catch (GuzzleException $e) {
            Log::error('Failed to get Zoom meeting', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('Failed to get Zoom meeting: ' . $e->getMessage());
        }
    }

    /**
     * Get meeting participants
     */
    public function getMeetingParticipants($meetingId)
    {
        try {
            $response = $this->client->get("metrics/meetings/{$meetingId}/participants", [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->jwtToken,
                ],
            ]);

            return json_decode($response->getBody()->getContents(), true);

        } catch (GuzzleException $e) {
            Log::error('Failed to get Zoom meeting participants', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('Failed to get meeting participants: ' . $e->getMessage());
        }
    }

    /**
     * Start a meeting (for hosts)
     */
    public function startMeeting($meetingId)
    {
        try {
            $meeting = $this->getMeeting($meetingId);
            return $meeting['start_url'] ?? null;

        } catch (Exception $e) {
            Log::error('Failed to get meeting start URL', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get join URL for a meeting
     */
    public function getJoinUrl($meetingId)
    {
        try {
            $meeting = $this->getMeeting($meetingId);
            return $meeting['join_url'] ?? null;

        } catch (Exception $e) {
            Log::error('Failed to get meeting join URL', [
                'meeting_id' => $meetingId,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}

/**
 * Helper function for base64url encoding
 */
function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}