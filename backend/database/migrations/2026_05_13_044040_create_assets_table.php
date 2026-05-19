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
       Schema::create('assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('serial_number')->unique();
            $table->string('category');
            // category: computer|monitor|server|printer|equipment|other
            $table->enum('status', [
                'available','in_use','maintenance','retired'
            ])->default('available');
            $table->foreignId('owner_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('location')->nullable();
            $table->date('purchase_date')->nullable();
            $table->decimal('purchase_price', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->json('specs')->nullable();
            // specs: {"cpu":"i7","ram":"16GB","storage":"512GB SSD"}
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status','category']);
            $table->index('owner_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
