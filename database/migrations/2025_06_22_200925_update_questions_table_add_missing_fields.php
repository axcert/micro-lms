<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add missing fields that your model expects
            $table->text('explanation')->nullable()->after('correct_answer');
            $table->boolean('is_required')->default(true)->after('explanation');
            $table->boolean('case_sensitive')->default(false)->after('is_required');
            $table->boolean('partial_credit')->default(false)->after('case_sensitive');
            
            // Modify correct_answer to be nullable since short answer questions might not have it
            $table->text('correct_answer')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['explanation', 'is_required', 'case_sensitive', 'partial_credit']);
            // Note: Laravel doesn't support making columns required again easily,
            // so we'll leave correct_answer as nullable in rollback
        });
    }
};