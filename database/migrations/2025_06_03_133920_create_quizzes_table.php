<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->text('instructions')->nullable();
            $table->foreignId('batch_id')->constrained()->onDelete('cascade');
            $table->integer('total_marks')->default(0);
            $table->integer('pass_marks');
            $table->integer('duration_minutes')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('max_attempts')->nullable();
            $table->boolean('shuffle_questions')->default(false);
            $table->boolean('shuffle_options')->default(false);
            $table->boolean('show_results_immediately')->default(true);
            $table->boolean('allow_review')->default(true);
            $table->boolean('auto_submit')->default(true);
            $table->boolean('require_webcam')->default(false);
            $table->boolean('prevent_copy_paste')->default(true);
            $table->enum('status', ['draft', 'active', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['batch_id', 'status']);
            $table->index(['start_time', 'end_time']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('quizzes');
    }
};