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
        Schema::create('pengantarans', function (Blueprint $table) {
            $table->id();
            $table->string('unique_number')->unique(); // nomor unik
            $table->string('senderofficer_name');            // nama petugas
            $table->string('sender_name');             // nama pengirim
            $table->string('receiver_name');           // nama penerima
            $table->string('receiver_phone');          // no hp penerima
            $table->string('package_notes'); // catatan paket
            $table->string('package_photo')->nullable();
            $table->string('screenshot')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengantaran');
    }
};
