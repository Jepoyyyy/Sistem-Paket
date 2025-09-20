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
        Schema::create('pakets', function (Blueprint $table) {
            $table->id();
            $table->string('unique_number')->unique(); // nomor unik
            $table->string('senderofficer_name');            // nama petugas
            $table->string('sender_name');             // nama pengirim
            $table->string('receiver_name');           // nama penerima
            $table->string('receiver_phone');          // no hp penerima
            $table->string('package_notes'); // catatan paket
            $table->string('picker_name')->nullable(); // nama pengambil
            $table->string('picker_phone')->nullable();
            $table->string('pickerofficer_name')->nullable();
            $table->string('package_photo')->nullable();
            $table->string('receiver_photo')->nullable();
            $table->timestamps();                      // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pakets');
    }
};
