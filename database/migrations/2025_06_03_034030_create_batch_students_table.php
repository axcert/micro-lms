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
            
            // Foreign key relationships with modern syntax
            $table->foreignId('batch_id')->constrained('batches')->cascadeOnDelete();
            $table->foreignId('student_id')->constrained('users')->cascadeOnDelete();
            
            // Enrollment tracking
            $table->timestamp('enrolled_at')->nullable();
            
            // Standard timestamps
            $table->timestamps();
            
            // Unique constraint - student can only be enrolled once per batch
            $table->unique(['batch_id', 'student_id'], 'batch_students_unique');
            
            // Indexes for performance
            $table->index('batch_id', 'batch_students_batch_index');
            $table->index('student_id', 'batch_students_student_index');
            $table->index('enrolled_at', 'batch_students_enrolled_at_index');
            $table->index(['batch_id', 'enrolled_at'], 'batch_students_batch_enrolled_index');
            
            // Additional index for teacher queries (finding all students for teacher's batches)
            $table->index(['student_id', 'created_at'], 'batch_students_student_created_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_students');
    }
};