import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilePdf, faFileExcel } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
    const [Count, setCount] = useState({
        totalPaket: 0,
        telahDiambil: 0,
        belumDiambil: 0,
        hariIni: 0,
    });

    const [pakets, setPakets] = useState([]);
    const [selectedPaket, setSelectedPaket] = useState(null); // buat modal

    useEffect(() => {
        fetchCount();
        fetchPakets();
    }, []);

    const fetchCount = async () => {
        try {
            const response = await axios.get('/dashboard/count');
            setCount(response.data);
        } catch (error) {
            console.error('Gagal mengambil data statistik:', error);
        }
    };

    const fetchPakets = async () => {
        try {
            const response = await axios.get('/dashboard/index');
            setPakets(response.data);
        } catch (error) {
            console.error('Gagal mengambil data paket:', error);
        }
    };

    const handleExport = () => {
    window.location.href = "/export/excel";
};
    const handleExportPDF = () => {
    window.location.href = "/export/pdf";

};
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="w-full my-4 bg bg-slate-200">
                {/* wrapper header */}
                <div className="mx-6  sm:px-6 lg:px-8 bg bg-slate-300 ">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg my-4 justify-center items-center">
                        <div className=" text-gray-900">Dashboard</div>
                        <p>Penerimaan dan Pengambilan Paket Pegawai BPKP</p>
                    </div>
                    <div className=' flex flex-row justify-center items-center  '>
                        <div className='w-1/4 p-8 bg-emerald-500 border rounded-md'>
                            <div>Total Paket</div>
                            <div className="text-2xl font-bold">{Count.totalPaket}</div>
                        </div>
                        <div className='w-1/4 p-8 bg-emerald-500 border rounded-md'>
                            <div>Telah Diambil</div>
                            <div className="text-2xl font-bold">{Count.telahDiambil}</div>
                        </div>
                        <div className='w-1/4 p-8 bg-emerald-500 border rounded-md'>
                            <div>Belum Diambil</div>
                            <div className="text-2xl font-bold">{Count.belumDiambil}</div>
                        </div>
                        <div className='w-1/4 p-8 bg-emerald-500 border rounded-md'>
                            <div>Hari Ini</div>
                            <div className="text-2xl font-bold">{Count.hariIni}</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-b-2xl border border-slate200/50 overflow-hidden">
                    <div className="p-6 border-b border-slate-200/50 flex flex-row justify-between">
                        <div className="flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800">
                                Daftar Paket
                            </h3>
                            <p>Paket Yang Masuk Ke Sistem</p>
                        </div>
                        <div className="flex gap-2">
                            <div>
                            <button
                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                onClick={handleExportPDF}
                            >
                                Cetak PDF
                            </button>
                            <FontAwesomeIcon icon={faFilePdf} />
                            </div>
                            <div>
                            <button
                                className="text-emerald-500 hover:text-emerald-700 text-sm font-medium"
                                onClick={handleExport}
                            >

                                Cetak Excel
                            </button>
                            <FontAwesomeIcon icon={faFileExcel} />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">No Unik</th>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">Pengirim</th>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">Penerima</th>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">Catatan</th>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">Status</th>
                                    <th className="text-center p-4 text-sm font-semibold text-slate-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pakets.map((paket, index) => (
                                    <tr
                                        key={index}
                                        className="border-b border-slate-200/50 hover:bg-slate-50/50 transition-colors"
                                    >
                                        <td className="p-4 text-center">{paket.unique_number}</td>
                                        <td className="p-4 text-center">{paket.sender_name}</td>
                                        <td className="p-4 text-center">{paket.receiver_name}</td>
                                        <td className="p-4 text-center">{paket.package_notes}</td>
                                        <td className="p-4 text-center">{paket.status}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => setSelectedPaket(paket)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                            >
                                                Lihat Detail
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Detail Paket */}
            <Dialog open={!!selectedPaket} onClose={() => setSelectedPaket(null)} className="relative z-10">
  <DialogBackdrop className="fixed inset-0 bg-black/30" />
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <DialogTitle className="text-lg font-bold text-gray-900">Detail Paket</DialogTitle>

      {selectedPaket && (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          {Object.entries({
            "Foto Paket": selectedPaket.package_photo,
            "Selfie Pengambil": selectedPaket.pengambilan?.receiver_photo,
            "Catatan": selectedPaket.package_notes,
            "No Unik": selectedPaket.unique_number,
            "Pengirim": selectedPaket.sender_name,
            "Penerima": selectedPaket.receiver_name,
            "Petugas Pengantaran": selectedPaket.senderofficer_name,
            "No. Penerima": selectedPaket.receiver_phone,
            "Diterima Oleh": selectedPaket.pengambilan?.picker_name,
            "Petugas Pengambilan": selectedPaket.pengambilan?.pickerofficer_name,
            "No. Pengambil": selectedPaket.pengambilan?.picker_phone,
            "Status": selectedPaket.status,

          }).map(([label, value]) =>
  value ? (
    <div key={label} className="space-y-1">
      <span className="font-semibold">{label}:</span>{" "}
      {label.includes("Foto") || label.includes("Selfie") ? (
        <img
          src={`http://127.0.0.1:8000/storage/${value}`}
          alt={label}
          className="mt-2 max-h-40 rounded shadow"
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  ) : null
          )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={() => setSelectedPaket(null)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Tutup
        </button>
      </div>
    </DialogPanel>
  </div>
</Dialog>

        </AuthenticatedLayout>
    );
}
