<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;

class AdminSettingsController extends Controller
{
    /**
     * Display the settings page
     */
    public function index()
    {
        $settings = $this->getSettings();
        
        return Inertia::render('Admin/Settings', [
            'settings' => $settings,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Update the settings
     */
    public function update(Request $request)
    {
        $request->validate([
            'system_name' => 'required|string|max:255',
            'system_email' => 'required|email|max:255',
            'timezone' => 'required|string|max:50',
            'max_students_per_batch' => 'required|integer|min:1|max:500',
            'maintenance_mode' => 'boolean',
            'notifications_enabled' => 'boolean',
            'backup_enabled' => 'boolean',
        ]);

        try {
            // Store settings in cache (you can also use a database table for persistence)
            Cache::put('app_settings', $request->all(), now()->addYears(1));
            
            // Update specific configurations if needed
            if ($request->boolean('maintenance_mode')) {
                Artisan::call('down', ['--refresh' => 15]);
            } else {
                Artisan::call('up');
            }

            return redirect()->route('admin.settings')
                ->with('success', 'Settings updated successfully!');
                
        } catch (\Exception $e) {
            return redirect()->route('admin.settings')
                ->with('error', 'Failed to update settings: ' . $e->getMessage());
        }
    }

    /**
     * Reset settings to defaults
     */
    public function reset()
    {
        try {
            // Reset to default settings
            Cache::forget('app_settings');
            
            // Make sure maintenance mode is off
            Artisan::call('up');
            
            return redirect()->route('admin.settings')
                ->with('success', 'Settings reset to default values!');
                
        } catch (\Exception $e) {
            return redirect()->route('admin.settings')
                ->with('error', 'Failed to reset settings: ' . $e->getMessage());
        }
    }

    /**
     * Get current settings from cache or return defaults
     */
    private function getSettings()
    {
        return Cache::get('app_settings', [
            'system_name' => config('app.name', 'Micro LMS'),
            'system_email' => config('mail.from.address', 'admin@microlms.com'),
            'timezone' => config('app.timezone', 'UTC'),
            'max_students_per_batch' => 50,
            'maintenance_mode' => false,
            'notifications_enabled' => true,
            'backup_enabled' => true,
        ]);
    }
}