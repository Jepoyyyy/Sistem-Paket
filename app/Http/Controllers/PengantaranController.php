<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pakets;
use App\Models\pengantaran;

class PengantaranController extends Controller
{
 public function store(Request $request){
        $request->validate([

            'sender_name' => 'required|string|max:255',
            'senderofficer_name' => 'required|string|max:255',
            'unique_number'         => 'required|string|max:255',
            'receiver_name'       => 'required|string|max:255',
            'package_notes'        => 'required|string|max:255',
            'receiver_phone'         => 'required|string|max:20',
            'package_photo'          => 'required|image|mimes:jpg,jpeg,png|max:2048',
            'screenshot'             => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
        $packagePhotoPath = null;
        if ($request->hasFile('package_photo')) {
            $packagePhotoPath = $request->file('package_photo')->store('package_photo', 'public');
        }
        $screenshotPath = null;
        if ($request->hasFile('screenshot')) {
            $screenshotPath = $request->file('screenshot')->store('screenshot', 'public');
        }

        $pengantaran = pengantaran::create([
            'senderofficer_name'  => $request->senderofficer_name,
            'sender_name'         => $request->sender_name,
            'unique_number'       => $request->unique_number,
            'receiver_name'       => $request->receiver_name,
            'package_notes'       => $request->package_notes,
            'receiver_phone'      => $request->receiver_phone,
            'package_photo'       => $packagePhotoPath,
            'screenshot'          => $screenshotPath,

        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data pengambilan berhasil disimpan',
            'data'    => $pengantaran
        ]);

    }

}
