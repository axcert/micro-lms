<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateQuizAnswersTable extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('quiz_answers')) {
            Schema::create('quiz_answers', function (Blueprint $table) {
                $table->id();
                $table->foreignId('quiz_attempt_id')->constrained()->onDelete('cascade');
                $table->foreignId('question_id')->constrained()->onDelete('cascade');
                $table->text('answer');
                $table->boolean('is_correct')->default(false);
                $table->decimal('marks_awarded', 5, 2)->default(0);
                $table->timestamps();

                $table->unique(['quiz_attempt_id', 'question_id']);
                $table->index('quiz_attempt_id');
                $table->index('question_id');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_answers');
    }
}