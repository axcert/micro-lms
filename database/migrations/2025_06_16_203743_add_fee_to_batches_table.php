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
        Schema::table('batches', function (Blueprint $table) {
            // Add fee column after max_students
            $table->decimal('fee', 10, 2)->nullable()->after('max_students')->comment('Batch fee in local currency');
            
            // Add index for better performance
            $table->index('fee', 'batches_fee_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('batches', function (Blueprint $table) {
            $table->dropIndex('batches_fee_index');
            $table->dropColumn('fee');
        });
    }
};