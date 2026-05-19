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
        Schema::create('workflow_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            // type: borrow|repair|purchase|transfer|return
            $table->enum('status', [
                'pending','approved','rejected','completed','cancelled'
            ])->default('pending');
            $table->foreignId('requester_id')->constrained('users');
            $table->foreignUuid('asset_id')
                ->nullable()
                ->constrained('assets')
                ->nullOnDelete();
            $table->foreignId('approver_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('title');
            $table->text('reason');
            $table->text('notes')->nullable();
            $table->integer('priority')->default(2);
            // priority: 1=urgent, 2=normal, 3=low
            $table->date('requested_date')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->index(['status','type']);
            $table->index('requester_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workflow_requests');
    }
};
