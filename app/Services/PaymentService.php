namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaymentService
{
    /**
     * Process OnePay payment
     */
    public function processOnePayPayment($amount, $orderId, $customerData)
    {
        try {
            $config = config('payment.onepay');
            
            $paymentData = [
                'merchant_id' => $config['merchant_id'],
                'amount' => $amount,
                'currency' => config('payment.default_currency'),
                'order_id' => $orderId,
                'return_url' => $config['return_url'],
                'cancel_url' => $config['cancel_url'],
                'customer_name' => $customerData['name'],
                'customer_email' => $customerData['email'],
                'customer_phone' => $customerData['phone'],
            ];

            // Generate hash
            $paymentData['hash'] = $this->generateOnePayHash($paymentData);

            $response = Http::post($config['base_url'] . '/pay', $paymentData);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('OnePay payment error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Process PayHere payment
     */
    public function processPayHerePayment($amount, $orderId, $customerData)
    {
        try {
            $config = config('payment.payhere');
            
            $paymentData = [
                'merchant_id' => $config['merchant_id'],
                'amount' => $amount,
                'currency' => config('payment.default_currency'),
                'order_id' => $orderId,
                'return_url' => $config['return_url'],
                'cancel_url' => $config['cancel_url'],
                'notify_url' => $config['notify_url'],
                'first_name' => $customerData['first_name'],
                'last_name' => $customerData['last_name'],
                'email' => $customerData['email'],
                'phone' => $customerData['phone'],
                'address' => $customerData['address'] ?? '',
                'city' => $customerData['city'] ?? '',
                'country' => $customerData['country'] ?? 'LK',
            ];

            // Generate hash
            $paymentData['hash'] = $this->generatePayHereHash($paymentData);

            $response = Http::post($config['base_url'] . '/pay', $paymentData);

            return $response->successful() ? $response->json() : null;
        } catch (\Exception $e) {
            Log::error('PayHere payment error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Generate OnePay hash
     */
    private function generateOnePayHash($data)
    {
        $hashString = $data['merchant_id'] . $data['order_id'] . $data['amount'] . config('payment.onepay.api_secret');
        return strtoupper(md5($hashString));
    }

    /**
     * Generate PayHere hash
     */
    private function generatePayHereHash($data)
    {
        $hashString = $data['merchant_id'] . $data['order_id'] . $data['amount'] . config('payment.payhere.merchant_secret');
        return strtoupper(md5($hashString));
    }

    /**
     * Verify payment callback
     */
    public function verifyPayment($paymentData, $provider = 'payhere')
    {
        try {
            if ($provider === 'payhere') {
                return $this->verifyPayHerePayment($paymentData);
            } elseif ($provider === 'onepay') {
                return $this->verifyOnePayPayment($paymentData);
            }

            return false;
        } catch (\Exception $e) {
            Log::error('Payment verification error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Verify PayHere payment
     */
    private function verifyPayHerePayment($data)
    {
        $localHash = strtoupper(md5($data['order_id'] . $data['payment_id'] . $data['amount'] . config('payment.payhere.merchant_secret')));
        return $localHash === $data['md5sig'];
    }

    /**
     * Verify OnePay payment
     */
    private function verifyOnePayPayment($data)
    {
        $localHash = strtoupper(md5($data['order_id'] . $data['payment_id'] . $data['amount'] . config('payment.onepay.api_secret')));
        return $localHash === $data['hash'];
    }
}