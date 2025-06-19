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
        Schema::table('users', function (Blueprint $table) {
            // Student-specific fields
            $table->unsignedBigInteger('batch_id')->nullable()->after('is_active');
            $table->string('class_id')->nullable()->after('batch_id');
            $table->string('bank_slip_path')->nullable()->after('class_id');
            $table->boolean('is_approved')->default(false)->after('bank_slip_path');
            

            
            // Add foreign key constraint for batch_id
            $table->foreign('batch_id')->references('id')->on('batches')->onDelete('set null');
            
            // Add indexes for performance
            $table->index(['role', 'is_approved'], 'users_role_approved_index');
            $table->index(['batch_id'], 'users_batch_id_index');
            $table->index(['is_active', 'is_approved'], 'users_active_approved_index');
            $table->index(['is_approved', 'created_at'], 'users_approved_created_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['batch_id']);
            
            // Drop indexes
            $table->dropIndex('users_role_approved_index');
            $table->dropIndex('users_batch_id_index');
            $table->dropIndex('users_active_approved_index');
            $table->dropIndex('users_approved_created_index');
            
            // Drop columns
            $table->dropColumn([
                'batch_id',
                'class_id',
                'bank_slip_path',
                'is_approved',
                'specialization',
                'department'
            ]);
        });
    }
};