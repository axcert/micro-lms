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
        Schema::create('batches', function (Blueprint $table) {
            $table->id();
            
            // Basic batch information
            $table->string('name', 255);
            $table->text('description')->nullable();
            
            // Teacher relationship
            $table->foreignId('teacher_id')->constrained('users')->cascadeOnDelete();
            
            // Date fields
            $table->date('start_date');
            $table->date('end_date')->nullable();
            
            // Status and capacity
            $table->boolean('is_active')->default(true);
            $table->integer('max_students')->nullable()->unsigned();
            
            // Timestamps and soft deletes
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes for performance
            $table->index(['teacher_id', 'is_active'], 'batches_teacher_active_index');
            $table->index(['start_date', 'end_date'], 'batches_date_range_index');
            $table->index(['is_active', 'start_date'], 'batches_active_start_index');
            $table->index('created_at', 'batches_created_at_index');
            
            // Unique constraint to prevent duplicate batch names per teacher
            $table->unique(['teacher_id', 'name'], 'batches_teacher_name_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batches');
    }
};