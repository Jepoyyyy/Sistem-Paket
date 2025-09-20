<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\pengambilan;
use App\Models\pengantaran;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function Count()
    {
        $totalPaket = Pengantaran::Count(); // semua paket
        $telahDiambil = Pengambilan::Count(); // sudah diambil
        $belumDiambil = $totalPaket - $telahDiambil; // belum diambil
        $hariIni = Pengambilan::whereDate('created_at', Carbon::today())->Count(); // diambil hari ini

        return response()->json([
            'totalPaket' => $totalPaket,
            'telahDiambil' => $telahDiambil,
            'belumDiambil' => $belumDiambil,
            'hariIni' => $hariIni,
        ]);
    }

    
    public function index()
{
    $pakets = Pengantaran::with('pengambilan')->get();

    // Tambahkan status tiap paket
    $pakets->transform(function($paket) {
        $paket->status = $paket->pengambilan ? 'Sudah Diambil' : 'Belum Diambil';
        return $paket;
    });

    return response()->json($pakets);
}

}
