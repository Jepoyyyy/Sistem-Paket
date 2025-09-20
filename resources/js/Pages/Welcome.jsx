import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import DeliveryForm from '../Components/PengantaranForm';
import PickingForm from '../Components/PengambilanForm';


export default function Welcome({ auth, laravelVersion, phpVersion }) {


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState(null);



    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 m-6">
            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-400 text-white p-4 rounded-lg mb-4 flex items-center gap-3">
        <div className="bg-white rounded-full p-1 flex items-center justify-center shadow w-12 h-12">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/11/BPKP_Logo.png"
            alt="Logo BPKP"
            className="w-10 h-auto rounded-full"
          />
        </div>
        <div>
          <h1 className="text-lg font-bold">📦 Input Data Paket</h1>
          <p className="text-xs">Sistem Monitoring Penerimaan dan Pengambilan Paket</p>
        </div>
      </div>

      {/* Dropdown */}
      <div className="relative mb-4 w-full z-50">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg flex justify-between items-center gap-2"
        >
          <span>☰ Pilih Jenis Layanan</span>
          <span className={`arrow transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow divide-y divide-gray-200">
            <div
              onClick={() => { setSelectedForm('delivery'); setDropdownOpen(false); }}
              className="dropdown-item px-4 py-3 text-center cursor-pointer hover:bg-gray-100"
            >
              🚚 PENGANTARAN PAKET
            </div>
            <div
              onClick={() => { setSelectedForm('pickup'); setDropdownOpen(false); }}
              className="dropdown-item px-4 py-3 text-center cursor-pointer hover:bg-gray-100"
            >
              📤 PENGAMBILAN PAKET
            </div>
            <div
              onClick={() => { setSelectedForm(null); setDropdownOpen(false); }}
              className="dropdown-item px-4 py-3 text-center cursor-pointer hover:bg-gray-100"
            >
              📊 DASHBOARD
            </div>
          </div>
        )}
      </div>

      {/* Forms */}
      {selectedForm === 'delivery' && <DeliveryForm />}
      {selectedForm === 'pickup' && <PickingForm />}



            </div>
        </>
    );
}
