<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            // Add teacher_id for direct relationship (optional - can get through batch)
            $table->foreignId('teacher_id')->nullable()->after('batch_id')->constrained('users')->onDelete('cascade');
            
            // Additional Zoom fields
            $table->text('zoom_start_url')->nullable()->after('zoom_meeting_id');
            $table->string('zoom_password')->nullable()->after('zoom_start_url');
            
            // Class settings
            $table->integer('max_attendees')->nullable()->after('duration_minutes');
            $table->text('notes')->nullable()->after('max_attendees');
            $table->text('recording_url')->nullable()->after('notes');
            
            // Update status enum to include 'live' and 'rescheduled'
            $table->dropColumn('status');
        });
        
        // Re-add status column with updated enum values
        Schema::table('classes', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'live', 'ongoing', 'completed', 'cancelled', 'rescheduled'])
                  ->default('scheduled')
                  ->after('recording_url');
        });
        
        // Add indexes for better performance
        Schema::table('classes', function (Blueprint $table) {
            $table->index(['teacher_id', 'scheduled_at']);
            $table->index(['status', 'scheduled_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('classes', function (Blueprint $table) {
            // Drop indexes
            $table->dropIndex(['teacher_id', 'scheduled_at']);
            $table->dropIndex(['status', 'scheduled_at']);
            
            // Drop added columns
            $table->dropForeign(['teacher_id']);
            $table->dropColumn([
                'teacher_id',
                'zoom_start_url', 
                'zoom_password',
                'max_attendees',
                'notes',
                'recording_url'
            ]);
            
            // Restore original status enum
            $table->dropColumn('status');
        });
        
        Schema::table('classes', function (Blueprint $table) {
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])
                  ->default('scheduled');
        });
    }
};