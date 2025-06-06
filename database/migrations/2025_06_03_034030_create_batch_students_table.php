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
        Schema::create('batch_students', function (Blueprint $table) {
            $table->id();
            
            // Foreign key relationships
            $table->foreignId('batch_id')->constrained('batches')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            
            // Enrollment tracking
            $table->timestamp('enrolled_at')->nullable();
            
            // Standard timestamps
            $table->timestamps();
            
            // Unique constraint - student can only be enrolled once per batch
            $table->unique(['batch_id', 'student_id']);
            
            // Indexes for performance
            $table->index('batch_id');
            $table->index('student_id');
            $table->index('enrolled_at');
            $table->index(['batch_id', 'enrolled_at']);
            $table->index(['student_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_students');
    }
};DB::select('SHOW TABLES');