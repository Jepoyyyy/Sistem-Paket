<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\pengambilan;
use App\Models\pengantaran;

class PengambilanController extends Controller
{
    public function store(Request $request){
    $request->validate([
        'pickerofficer_name' => 'required|string|max:255',
        'unique_number'      => 'required|string|max:255',
        'picker_name'        => 'required|string|max:255',
        'receiver_name'      => 'required|string|max:255',
        'picker_phone'       => 'required|string|max:255',
        'receiver_photo'     => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    // Cek apakah unique_number ada di pengantaran
    $exists = Pengantaran::where('unique_number', $request->unique_number)->exists();

    if (!$exists) {
        return response()->json([
            'success' => false,
            'message' => 'Kode unik tidak ditemukan di tabel pengantaran.'
        ], 422);
    }

    // Simpan foto
    $receiverPhotoPath = null;
    if ($request->hasFile('receiver_photo')) {
        $receiverPhotoPath = $request->file('receiver_photo')->store('receiver_photo', 'public');
    }

    // Simpan data pengambilan
    $pengambilan = pengambilan::create([
        'pickerofficer_name' => $request->pickerofficer_name,
        'unique_number'      => $request->unique_number,
        'receiver_name'      => $request->receiver_name,
        'picker_name'        => $request->picker_name,
        'picker_phone'       => $request->picker_phone,
        'receiver_photo'     => $receiverPhotoPath,
    ]);

    return response()->json([
        'success' => true,
        'message' => 'Data pengambilan berhasil disimpan',
        'data'    => $pengambilan
    ]);
}

}
