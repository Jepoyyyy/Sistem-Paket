<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

use App\Models\Pengambilan;

class ExportController extends Controller
{
   public function excel()
    {
        $data = DB::table('pengambilans as p1')
            ->leftJoin('pengantarans as p2', 'p1.unique_number', '=', 'p2.unique_number')
            ->select(
                'p1.unique_number',
                'p2.sender_name',
                'p2.receiver_name',
                'p2.receiver_phone',
                'p2.package_notes',
                'p1.pickerofficer_name',
                'p1.picker_name',
                'p1.picker_phone',
                'p2.created_at as pengantaran_at',
                'p1.created_at as pengambilan_at'
            )
            ->union(
                DB::table('pengantarans as p2')
                    ->leftJoin('pengambilans as p1', 'p1.unique_number', '=', 'p2.unique_number')
                    ->select(
                        'p2.unique_number',
                        'p2.sender_name',
                        'p2.receiver_name',
                        'p2.receiver_phone',
                        'p2.package_notes',
                        'p1.pickerofficer_name',
                        'p1.picker_name',
                        'p1.picker_phone',
                        'p2.created_at as pengantaran_at',
                        'p1.created_at as pengambilan_at'

                    )
            )
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $sheet->setCellValue('A1', 'Tanggal Pengantaran');
$sheet->setCellValue('B1', 'Waktu Pengantaran');
$sheet->setCellValue('C1', 'Nomor Unik');
$sheet->setCellValue('D1', 'Pengirim');
$sheet->setCellValue('E1', 'No. Penerima');
$sheet->setCellValue('F1', 'Petugas Pengantaran');
$sheet->setCellValue('G1', 'Catatan Paket');
$sheet->setCellValue('H1', 'Penerima');
$sheet->setCellValue('I1', 'Pengambil');
$sheet->setCellValue('J1', 'No. Pengambil');
$sheet->setCellValue('K1', 'Tanggal Pengambilan');
$sheet->setCellValue('L1', 'Waktu Pengambilan');

// Isi data
$row = 2;
foreach ($data as $item) {
    $sheet->setCellValueExplicit('C'.$row, $item->unique_number, DataType::TYPE_STRING);
    $sheet->setCellValue('D'.$row, $item->sender_name);
    $sheet->setCellValue('E'.$row, $item->receiver_name);
    $sheet->setCellValueExplicit('F'.$row, $item->receiver_phone, DataType::TYPE_STRING);
    $sheet->setCellValue('G'.$row, $item->package_notes);
    $sheet->setCellValue('H'.$row, $item->pickerofficer_name);
    $sheet->setCellValue('I'.$row, $item->picker_name);
    $sheet->setCellValueExplicit('J'.$row, $item->picker_phone, DataType::TYPE_STRING);

    // Format tanggal & waktu (kalau datanya ada)
    $pengantaranAt = $item->pengantaran_at ?? null;
    $pengambilanAt = $item->pengambilan_at ?? null; // kamu perlu alias di query kalau ada 2 created_at

    if ($pengantaranAt) {
        $date = Carbon::parse($pengantaranAt);
        $sheet->setCellValue('A'.$row, $date->format('Y-m-d')); // tanggal
        $sheet->setCellValue('B'.$row, $date->format('H:i:s')); // waktu
    }

    if ($pengambilanAt) {
        $date2 = Carbon::parse($pengambilanAt);
        $sheet->setCellValue('K'.$row, $date2->format('Y-m-d'));
        $sheet->setCellValue('L'.$row, $date2->format('H:i:s'));
    }

    $row++;
        }

        $writer = new Xlsx($spreadsheet);

        return response()->streamDownload(function () use ($writer) {
            $writer->save("php://output");
        }, 'DataPaket.xlsx');
    }

    public function pdf(){
        $pakets = DB::table('pengantarans as p1')
        ->leftJoin('pengambilans as p2', 'p1.unique_number', '=', 'p2.unique_number')
        ->select(
            'p1.unique_number',
            'p1.sender_name',
            'p1.receiver_name',
            'p1.package_notes',
            'p1.package_photo',
            'p2.picker_name',
            'p2.pickerofficer_name',
            'p2.picker_phone',
            'p2.receiver_photo',
            DB::raw('CASE WHEN p2.id IS NULL THEN "Belum Diambil" ELSE "Sudah Diambil" END as status')
        )
        ->get();

    $pdf = Pdf::loadView('exports.pdf', compact('pakets'))
            ->setPaper('a4', 'landscape');

    return $pdf->download('data-pengiriman.pdf');
    }

}
