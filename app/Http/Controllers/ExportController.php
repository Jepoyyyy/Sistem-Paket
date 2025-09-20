<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use Barryvdh\DomPDF\Facade\Pdf;

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
                'p1.picker_phone'
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
                        'p1.picker_phone'
                    )
            )
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Header
        $sheet->setCellValue('A1', 'Unique Number');
        $sheet->setCellValue('B1', 'Sender Name');
        $sheet->setCellValue('C1', 'Receiver Name');
        $sheet->setCellValue('D1', 'Receiver Phone');
        $sheet->setCellValue('E1', 'Package Notes');
        $sheet->setCellValue('F1', 'Picker Officer');
        $sheet->setCellValue('G1', 'Picker Name');
        $sheet->setCellValue('H1', 'Picker Phone');

        // Isi data
        $row = 2;
        foreach ($data as $item) {
            $sheet->setCellValueExplicit('A'.$row, $item->unique_number, DataType::TYPE_STRING);
            $sheet->setCellValue('B'.$row, $item->sender_name);
            $sheet->setCellValue('C'.$row, $item->receiver_name);
            $sheet->setCellValueExplicit('D'.$row, $item->receiver_phone, DataType::TYPE_STRING);
            $sheet->setCellValue('E'.$row, $item->package_notes);
            $sheet->setCellValue('F'.$row, $item->pickerofficer_name);
            $sheet->setCellValue('G'.$row, $item->picker_name);
            $sheet->setCellValueExplicit('H'.$row, $item->picker_phone, DataType::TYPE_STRING);
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
