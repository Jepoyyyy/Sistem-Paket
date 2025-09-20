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
        Schema::create('pengambilans', function (Blueprint $table) {
            $table->id();
            $table->string('pickerofficer_name')->nullable(); // nama pengambil
            $table->string('picker_name')->nullable(); // nama pengambil
            $table->string('picker_phone')->nullable();
            $table->string('unique_number')->unique();
            $table->string('receiver_photo')->nullable();
            $table->string('receiver_name')->nullable();
            $table->timestamps();

            $table->foreign('unique_number') ->references('unique_number') ->on('pengantarans') ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengambilan');
    }
};
