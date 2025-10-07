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


    public function index(Request $request)
{
    $search = $request->input('search');
    $sortBy = $request->input('sort_by', 'created_at'); // default
    $sortOrder = $request->input('sort_order', 'desc'); // default

    $pakets = Pengantaran::with('pengambilan')
        ->when($search, function ($query, $search) {
            $query->where(function ($q) use ($search) {
                $q->where('sender_name', 'like', "%{$search}%")
                  ->orWhere('receiver_name', 'like', "%{$search}%");
            });
        })
         ->orderBy($sortBy, $sortOrder)
        ->paginate(5);
;

    $pakets->transform(function($paket) {
        $paket->status = $paket->pengambilan ? 'Sudah Diambil' : 'Belum Diambil';
        return $paket;
    });

    return response()->json($pakets);
}


}
