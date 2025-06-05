namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    protected $apiUrl;
    protected $apiToken;
    protected $phoneNumberId;

    public function __construct()
    {
        $this->apiUrl = config('whatsapp.api_url');
        $this->apiToken = config('whatsapp.api_token');
        $this->phoneNumberId = config('whatsapp.phone_number_id');
    }

    /**
     * Send a WhatsApp message
     */
    public function sendMessage($to, $message, $type = 'text')
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiToken,
                'Content-Type' => 'application/json',
            ])->post($this->apiUrl . '/' . $this->phoneNumberId . '/messages', [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => $type,
                'text' => ['body' => $message],
            ]);

            if ($response->successful()) {
                Log::info('WhatsApp message sent successfully', ['to' => $to]);
                return $response->json();
            }

            Log::error('WhatsApp message failed', ['response' => $response->json()]);
            return null;
        } catch (\Exception $e) {
            Log::error('WhatsApp service error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Send class reminder
     */
    public function sendClassReminder($phoneNumber, $className, $dateTime, $zoomLink)
    {
        $message = "🎓 Class Reminder\n\n";
        $message .= "Class: {$className}\n";
        $message .= "Date & Time: {$dateTime}\n";
        $message .= "Join Link: {$zoomLink}\n\n";
        $message .= "Don't miss your class! 📚";

        return $this->sendMessage($phoneNumber, $message);
    }

    /**
     * Send quiz notification
     */
    public function sendQuizNotification($phoneNumber, $quizTitle, $dueDate)
    {
        $message = "📝 Quiz Available\n\n";
        $message .= "Quiz: {$quizTitle}\n";
        $message .= "Due Date: {$dueDate}\n\n";
        $message .= "Complete your quiz before the deadline! ⏰";

        return $this->sendMessage($phoneNumber, $message);
    }
}
