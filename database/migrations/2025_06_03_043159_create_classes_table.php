<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClassesTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if table already exists before creating
        if (!Schema::hasTable('classes')) {
            Schema::create('classes', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->text('description')->nullable();
                $table->foreignId('batch_id')->constrained()->onDelete('cascade');
                $table->string('zoom_link')->nullable();
                $table->timestamp('scheduled_at')->nullable();
                $table->integer('duration_minutes')->default(60);
                $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
                $table->timestamps();

                $table->index('batch_id');
                $table->index('scheduled_at');
                $table->index('status');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
}