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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedBigInteger('teacher_id'); // Make sure this exists
            $table->unsignedBigInteger('batch_id');   // Make sure this exists
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->integer('duration'); // in minutes
            $table->boolean('randomize_questions')->default(true);
            $table->boolean('show_results_immediately')->default(false);
            $table->boolean('allow_review')->default(true);
            $table->integer('max_attempts')->default(1);
            $table->enum('status', ['active', 'inactive', 'completed'])->default('inactive');
            $table->timestamps();

            // Foreign key constraints (only if the referenced tables exist)
            $table->foreign('teacher_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('cascade');

            // Indexes for better performance
            $table->index(['teacher_id', 'status']);
            $table->index(['batch_id', 'status']);
            $table->index(['start_time', 'end_time']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};