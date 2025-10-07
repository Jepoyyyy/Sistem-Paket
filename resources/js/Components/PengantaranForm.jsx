import { useState,useRef } from 'react';
import Webcam from "react-webcam";
import axios from "axios";
import { faArrowsRotate,faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const DeliveryForm = () => {
    const [preview, setPreview] = useState(null);
    const [showLabel, setShowLabel] = useState(false);
    const webcamRef = useRef(null);

    const [facingMode, setFacingMode] = useState("user");
    const [senderName, setSenderName] = useState("");
    const [senderOfficerName, setSenderOfficerName] = useState("");
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [packageNotes, setpackageNotes] = useState("");
    const [uniqueNumber, setUniqueNumber] = useState(Date.now());
    const [screenShot, setscreenShot] = useState("");
    const [packagePhoto, setpackagePhoto] = useState("")
    const [cameraOn, setCameraOn] = useState(false);
    const [SavedPaket,setSavedPaket] = useState (null);
    const videoConstraints = {
        width: 300,
        height: 400,
        facingMode: facingMode,
        };



    const startCamera = async() => {
        setCameraOn(true);
    }

    const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
         setPreview(imageSrc);

      // ubah base64 ke blob supaya bisa dikirim ke Laravel
      const timestamp = Date.now();
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `package_photo_${timestamp}.jpg`, { type: "image/jpeg" });
          setpackagePhoto(file);

        });
        stopCamera();
    }
  };



    const stopCamera = () => {
        if (
                webcamRef.current &&
                webcamRef.current.video &&
                webcamRef.current.video.srcObject
            ) {
                webcamRef.current.video.srcObject.getTracks().forEach((track) => track.stop());
                webcamRef.current.video.srcObject = null; // buang stream
         }
         setCameraOn(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    const formData = new FormData();
    formData.append("sender_name", senderName);
    formData.append("senderofficer_name", senderOfficerName);
    formData.append("unique_number", uniqueNumber);
    formData.append("receiver_name", receiverName);
    formData.append("package_notes", packageNotes);
    formData.append("receiver_phone", receiverPhone);

    if (packagePhoto) {
      formData.append("package_photo", packagePhoto);
    }
    if (screenShot) {
      formData.append("screenshot", screenShot);
    }

    try {
      const response = await axios.post("/pengantaran", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Sukses:", response.data);
      setSavedPaket(response.data.data);
      setSenderName("");
      setPreview(null);
      setSenderOfficerName("");
      setpackageNotes("");
      setscreenShot(null);
      setReceiverName("");
      setReceiverPhone("");
      setCameraOn(false);
      setpackagePhoto(null);
      setUniqueNumber("");
      setShowLabel(false);


        }
    catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal simpan data");
        }
    };

    function sendViaWhatsAppManual(selectedPaket) {
  const rawPhone = selectedPaket?.receiver_phone || '';
  const phone = formatToE164(rawPhone);
  if (!phone) {
    alert('Nomor tujuan tidak tersedia');
    return;
  }
  const message = [
    `Halo,`,
    `Saya ingin konfirmasi pengambilan paket.`,
    `No Unik: ${selectedPaket.unique_number}`,
    `Penerima: ${selectedPaket.receiver_name}`,
    `Catatan: ${selectedPaket.package_notes || '-'}`,
    ``,
    `— dikirim otomatis dari sistem`
  ].join('\n');


  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  // buka di tab baru (user akan melihat preview dan klik "Send")
  window.open(url, '_blank');
}
  // Generate ulang unique number
    const generateNumber = () => {
        const newNumber = `BPKP-${Date.now()}`;
        setUniqueNumber(newNumber);
        setShowLabel(true);
        };

    const printLabel = () => {
    const printContents = document.getElementById("printableLabel").innerHTML;
    const newWindow = window.open("", "_blank", "width=600,height=400");
    newWindow.document.write(`
            <html>
            <head>
                <title>Label Pengantaran</title>
                <style>
                body {
                    font-family: Arial, sans-serif;
                }

                .printable-label {
                    text-align: center;
                    padding: 20px;
                    border: 2px dashed #0d6efd;
                    border-radius: 10px;
                    margin: 20px auto;
                    background: white;
                    width: 80%;
                }

                .print-label {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #0d6efd;
                    margin-bottom: 10px;
                }

                .print-number {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #198754;
                    letter-spacing: 3px;
                    margin: 15px 0;
                    padding: 10px;
                    border: 2px solid #198754;
                    border-radius: 8px;
                    background: #f8fff9;
                }

                .print-instruction {
                    font-size: 1rem;
                    color: #6c757d;
                    margin-top: 15px;
                }
                </style>
            </head>
            <body>
                <div class="printable-label">
                ${printContents}
                </div>
            </body>
            </html>
        `);
            newWindow.document.close();
            newWindow.print();
    };


    return(
        <div className="bg-white shadow   ">
                  <div className="bg-blue-600 text-white font-bold text-sm text-center rounded-t-lg px-3 py-2 mb-3">
                    🚚 PENGANTARAN PAKET
                  </div>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="senderNamelab" className="block text-gray-700 text-sm font-medium mb-1">
                        Nama Pengirim
                      </label>
                      <input
                        type="text"
                        name='sender_name'
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        id="senderName"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="officerNamelab" className="block text-gray-700 text-sm font-medium mb-1">
                        Nama Petugas *
                      </label>
                      <input
                        type="text"
                        id="officerName"
                        name='senderofficer_name'
                        value={senderOfficerName}
                        onChange={(e) => setSenderOfficerName(e.target.value)}
                        placeholder="Masukkan nama petugas"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">Nama petugas yang menangani pengantaran paket</p>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="receiverNamelab" className="block text-gray-700 text-sm font-medium mb-1">
                        Nama Penerima
                      </label>
                      <input
                        type="text"
                        id="receiverName"
                        name='receiver_name'
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="receiverphonelab" className="block text-gray-700 text-sm font-medium mb-1">
                        No. Whatsapp
                      </label>


                      <input
                        type="text"
                        inputMode="numeric"
                        id="receiverPhone"
                        name='receiver_phone'
                        placeholder="Contoh: 628123456789"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
                         e.preventDefault();
                            }
                        if (
                        e.currentTarget.value.length >= 17 &&
                        e.key !== "Backspace" &&
                        e.key !== "Delete"
                        ) {
                        e.preventDefault();
                        }
                        }}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <p className="text-xs text-gray-500 mt-1">No Whatsapp diawali oleh kode negara (62)</p>
                    </div>

          <div className="mb-3">
          <label
            htmlFor="message"
            id="packageNoteslab"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Catatan/Deskripsi Paket
          </label>

          <textarea
            id="packageNotes"
            name="package_notes"
            value={packageNotes}   // harus sama dengan state
            onChange={(e) => setpackageNotes(e.target.value)}
            className="w-full border mb-3 border-gray-300 rounded-lg p-2 text-sm resize-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
        />

        </div>

<div className="mb-3">
  <label className="block text-gray-700 text-sm font-medium mb-1">
    Foto Paket
  </label>

  <div className="flex flex-col sm:flex-row gap-4 my-4">
    {/* Webcam muncul hanya jika kamera hidup dan belum ada preview */}
    {cameraOn && !preview && (
  <div className="relative w-1/2">
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={videoConstraints}
      className="rounded-md w-full"
    />

    {/* Tombol kecil rotate */}
    <button
      type="button"
      onClick={() =>
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
      }
      className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black/80"
    >
      <FontAwesomeIcon icon={faArrowsRotate} />
    </button>
  </div>
)}

    {/* Preview selalu muncul jika ada */}
    {preview && (
      <div className="w-1/2 ">
        <h3 className="text-sm font-semibold mb-2">Preview Foto:</h3>
        <img src={preview} alt="Preview" className="rounded-md  w-full " />
      </div>
    )}
  </div>

  <div className="flex justify-between  gap-2">
    {/* Tombol toggle / ambil ulang */}
    <button
      type='button'
      onClick={() => {
        if (preview) {
          // Ambil ulang foto → reset preview dan hidupkan kamera
          setPreview(null);
          setCameraOn(true);
        } else {
          // Kamera mati → hidupkan
          setCameraOn(!cameraOn);
        }
      }}
      className="w-1/2 bg-blue-600 py-2  text-white rounded-lg"
    >
      {preview ? '📷 Reset Foto' : (cameraOn ? '📷 Matikan Kamera' : '📷 Aktifkan Kamera')}
    </button>

    {/* Tombol Ambil Foto hanya muncul jika belum ada preview */}
    {!preview && (
      <button
        onClick={capturePhoto}
        type='button'
        className="w-1/2 bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700"
      >
        📸 Ambil Foto
      </button>
    )}
  </div>
</div>
                    <button
                      type="button"
                      onClick={generateNumber}
                      className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md mt-2 hover:bg-blue-700"
                    >
                      Buat kode Unik
                    </button>
             {showLabel && (
                <div className="special-label-container p-4 border rounded-md shadow bg-white mt-4">
                  <div className="special-label font-bold text-green-600 text-lg mb-2 border border-green-600 rounded p-4">
                    <FontAwesomeIcon icon={faCheck} />
                    PAKET TELAH DIANTAR - BPKP OFFICIAL{" "}
                  <span className="unique-number ml-2">{uniqueNumber}</span>
                  </div>
                  <p className="screenshot-instruction text-sm">
                    Silakan screenshot label di atas sebagai bukti pengantaran
                  </p>
                  <p className="screenshot-instruction text-sm font-bold text-red-500">
                    Segera kirimkan Special Label ke si penerima!
                  </p>

                  {/* Upload Screenshot */}
                  <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setscreenShot(e.target.files[0])}
                />
              </div>
                  <div>
                  <button
                    type="button"
                    className="submit-btn save-delivery-btn w-full bg-blue-600 text-white px-4 py-2 rounded-md mt-4 hover:bg-blue-700"
                    onClick={handleSubmit}
                    >
                    💾 Simpan Data Pengantaran Paket
                  </button>

                    {SavedPaket && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <div>
      <h2 className="text-lg font-bold mb-4">Pesan Berhasil dikirim</h2>

      </div>

      <p>
        Kirim pesan ke <strong>{SavedPaket.receiver_name}</strong> (
        {SavedPaket.receiver_phone})
      </p>

      <div className="mt-4 flex gap-2 justify-end">
        <a
          href={`https://wa.me/${SavedPaket.receiver_phone}?text=${encodeURIComponent(
            `Halo ${SavedPaket.receiver_name}, paket dengan nomor unik ${SavedPaket.unique_number} sudah Diantar.`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Kirim WhatsApp
        </a>
        <button
          onClick={() => setSavedPaket(null)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Tutup
        </button>
      </div>
    </div>
  </div>
)}

                    </div>

                  {/* Tombol Print */}
                  <button
                    type="button"
                    className="submit-btn mt-2 w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    onClick={printLabel}
                  >
                    🖨️ Cetak Label
                  </button>

                  {/* Area Print */}
                  <div className="printable-label hidden" id="printableLabel">
                    <div className="print-label font-bold">BPKP OFFICIAL</div>
                    <div>PAKET TELAH DIANTAR</div>
                    <div className="print-number">{uniqueNumber}</div>
                    <div className="print-instruction text-sm">
                      Simpan label ini sebagai bukti pengantaran
                    </div>
                    <div>
                        <div className="print-person">
                            <div className='from'>

                            </div>

                        </div>
                    </div>
                  </div>
                </div>

                    )}
                  </form>
        </div>
    )
}
export default DeliveryForm;
