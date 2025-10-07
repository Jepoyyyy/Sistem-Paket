import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileExcel,
  faCheckCircle,
  faBoxes,
  faClock,
  faCalendarDay,
  faEye,
  faSearch,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';

export default function Dashboard() {
  const [Count, setCount] = useState({
    totalPaket: 0,
    telahDiambil: 0,
    belumDiambil: 0,
    hariIni: 0,
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pakets, setPakets] = useState([]);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const delayDebounce = setTimeout(() => {
      fetchPakets(1, controller);
    }, 300);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [search, sortBy, sortOrder]);

  const fetchCount = async () => {
    try {
      const response = await axios.get('/dashboard/count');
      setCount(response.data);
    } catch (error) {
      console.error('Gagal mengambil data statistik:', error);
    }
  };

  const fetchPakets = async (page = 1, controller) => {
    try {
      setLoading(true);
      const response = await axios.get('/dashboard/index', {
        params: {
          page,
          search,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
        signal: controller?.signal,
      });

      setPakets(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
      });
    } catch (error) {
      if (error.name !== "CanceledError") {
        console.error('Gagal mengambil data paket:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => (window.location.href = "/export/excel");
  const handleExportPDF = () => (window.location.href = "/export/pdf");

  const handleSort = (column) => {
    const newOrder = sortBy === column && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortOrder(newOrder);
  };

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="bg-slate-100">
        <div className="mx-4 sm:px-4 lg:px-8">
          {/* Header */}
          <div className="py-4 px-2 text-start">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Penerimaan dan Pengambilan Paket Pegawai BPKP</p>
          </div>

          {/* Statistik */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Paket" value={Count.totalPaket} icon={faBoxes} color="bg-blue-600" />
            <StatCard title="Telah Diambil" value={Count.telahDiambil} icon={faCheckCircle} color="bg-[#198754]" />
            <StatCard title="Belum Diambil" value={Count.belumDiambil} icon={faClock} color="bg-[#ffc107]" />
            <StatCard title="Hari Ini" value={Count.hariIni} icon={faCalendarDay} color="bg-[#0dcaf0]" />
          </div>

          {/* Daftar Paket */}
          <div className="py-4 px-4 lg:px-6 flex flex-col lg:flex-row lg:items-center lg:justify-between my-4 bg-blue-600 rounded-t-lg gap-3">
            {/* Kiri: Judul */}
            <div>
              <h3 className="text-xl font-extrabold text-white">Daftar Paket</h3>
              <p className="text-slate-300 text-sm">Paket yang masuk ke sistem</p>
            </div>

            {/* Tengah: Search */}
            <div className="relative w-full lg:w-64">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengirim / penerima..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 border px-3 py-2 rounded-lg w-full"
              />
            </div>

            {/* Kanan: Export */}
            <div className="inline-flex">
              <ExportButton icon={faFilePdf} text="PDF" onClick={handleExportPDF} color="hover:bg-red-500" />
              <ExportButton icon={faFileExcel} text="Excel" onClick={handleExport} color="hover:bg-emerald-600" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-500 rounded-lg">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-400">
                  {["unique_number", "sender_name", "receiver_name",].map((col, i) => (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className={`w-28 align-middle py-4 cursor-pointer select-none ${i === 0 ? "" : "text-center"}`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        {col === "unique_number" && "No Unik"}
                        {col === "sender_name" && "Pengirim"}
                        {col === "receiver_name" && "Penerima"}
                        {sortBy === col && (
                          <FontAwesomeIcon
                            icon={sortOrder === "asc" ? faArrowUp : faArrowDown}
                            className="text-[10px] text-gray-500 transition-transform duration-200"
                          />
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="w-28 align-middle py-4 text-center">Status</th>
                  <th className="w-28 align-middle py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : pakets.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      Tidak ada data paket
                    </td>
                  </tr>
                ) : (
                  pakets.map((paket, index) => (
                    <tr key={index} className="hover:bg-slate-300 transition border-b border-gray-300">
                      <td className="p-3 text-center">{paket.unique_number}</td>
                      <td className="p-3 text-center">{paket.sender_name}</td>
                      <td className="p-3 text-center">{paket.receiver_name}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded text-white inline-block ${
                            paket.status === "Sudah Diambil" ? "bg-[#198754]" : "bg-[#ffc107]"
                          }`}
                        >
                          {paket.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedPaket(paket)}
                          className="border-blue-600 border text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-600 hover:text-white"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="6" className="p-3 text-center">
                    <div className="flex justify-between items-center">
                      <button
                        disabled={pagination.current_page === 1}
                        onClick={() => fetchPakets(pagination.current_page - 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Prev
                      </button>
                      <span>
                        Halaman {pagination.current_page} dari {pagination.last_page}
                      </span>
                      <button
                        disabled={pagination.current_page === pagination.last_page}
                        onClick={() => fetchPakets(pagination.current_page + 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition show={!!selectedPaket} as={Fragment}>
        <Dialog open={!!selectedPaket} onClose={() => setSelectedPaket(null)} className="relative z-10">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 transform transition-all">
                <DialogTitle className="text-lg font-bold text-gray-900">Detail Paket</DialogTitle>
                {selectedPaket && (
                  <div className="mt-4 space-y-2 text-sm text-gray-700 max-h-[70vh] overflow-y-auto pr-2">
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
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </AuthenticatedLayout>
  );
}

/* ------------------ Components Kecil ------------------ */
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`flex flex-col justify-between ${color} text-white rounded-xl p-4 shadow-md`}>
      <div className="flex w-full justify-between items-center text-sm sm:text-base">
        <span>{title}</span>
        <FontAwesomeIcon icon={icon} />
      </div>
      <span className="text-xl sm:text-2xl font-extrabold">{value}</span>
    </div>
  );
}

function ExportButton({ icon, text, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center mx-1 px-3 py-2 rounded-lg border text-sm text-white ${color} transition`}
    >
      <FontAwesomeIcon icon={icon} className="mr-1" /> {text}
    </button>
  );
}
