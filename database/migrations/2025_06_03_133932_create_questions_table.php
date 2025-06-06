<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quiz_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['mcq', 'short_answer']);
            $table->text('question_text');
            $table->json('options')->nullable(); // For MCQ options
            $table->text('correct_answer');
            $table->integer('marks')->default(1);
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->index('quiz_id');
            $table->index('type');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
