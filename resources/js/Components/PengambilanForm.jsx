import { useState,useRef } from 'react';
import Webcam from "react-webcam";
import axios from "axios";

const PickingForm = () => {
    const [preview, setPreview] = useState(null);
    const [showLabel, setShowLabel] = useState(false);
    const webcamRef = useRef(null);


    const [PickerName, setPickerName] = useState("");
    const [PickerOfficerName, setPickerOfficerName] = useState("");
    const [ReceiverName, setReceiverName] = useState("");
    const [PickerPhone, setPickerPhone] = useState("");
    const [UniqueNumber, setUniqueNumber] = useState("");
    const [ReceiverPhoto, setReceiverPhoto] = useState("");
    const [cameraOn, setCameraOn] = useState(false);

    const videoConstraints = {
        width: 300,
        height: 400,

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
          const file = new File([blob], `receiver_photo_${timestamp}.jpg`, { type: "image/jpeg" });
          setReceiverPhoto(file);

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
    formData.append("pickerofficer_name", PickerOfficerName);
    formData.append("unique_number", UniqueNumber);
    formData.append("picker_name", PickerName);
    formData.append("receiver_name", ReceiverName);
    formData.append("picker_phone", PickerPhone);


    if (ReceiverPhoto) {
      formData.append("receiver_photo", ReceiverPhoto);
    }

    try {
      const response = await axios.post("/pengambilan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Sukses:", response.data);
      alert("Berhasil disimpan");
        }
    catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Gagal simpan data");
        }
    };

    return(
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <div className="bg-green-600 text-white font-bold text-sm text-center rounded-t-lg px-3 py-2 mb-3">
            📤 PENGAMBILAN PAKET
          </div>
          <form>
            <div className="mb-3">
              <label htmlFor="pickupOfficerName" className="block text-gray-700 text-sm font-medium mb-1">
                Nama Petugas *
              </label>
              <input
                type="text"
                id="pickerOfficerName"
                name='pickerofficer_name'
                value={PickerOfficerName}
                onChange={(e) => setPickerOfficerName(e.target.value)}
                placeholder="Masukkan nama petugas"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <p className="text-xs text-gray-500 mt-1">Nama petugas yang menangani pengambilan paket</p>
            </div>
            <div className="mb-3">
              <label htmlFor="pickupOfficerName" className="block text-gray-700 text-sm font-medium mb-1">
                Nomor Unik Paket
              </label>
              <input
                type="text"
                id="uniqueNumber"
                name='unique_number'
                value={UniqueNumber}
                onChange={(e) => setUniqueNumber(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            </div>
            <div className="mb-3">
              <label htmlFor="pickupOfficerName" className="block text-gray-700 text-sm font-medium mb-1">
                Nama Pengambil
              </label>
              <input
                type="text"
                id="pickerName"
                name='picker_name'
                value={PickerName}
                onChange={(e) => setPickerName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            </div>
            <div className="mb-3">
              <label htmlFor="pickupOfficerName" className="block text-gray-700 text-sm font-medium mb-1">
                Nama Sesuai Di Paket
              </label>
              <input
                type="text"
                id="receiverName"
                name='receiver_name'
                value={ReceiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            </div>
            <div className="mb-3">
              <label htmlFor="pickupOfficerName" className="block text-gray-700 text-sm font-medium mb-1">
                No. Telepon
              </label>
              <input
                type="text"
                id="pickerPhone"
                name='picker_phone'
                value={PickerPhone}
                onChange={(e) => setPickerPhone(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />

            </div>

            <div className="mb-3">
             <label
                        htmlFor="packagePhoto"
                        className="block text-gray-700 text-sm font-medium mb-1"
                      >
                        Foto Paket
                      </label>
                            <div>
                                <div className='flex flex-col sm:flex-row '>
                              {cameraOn && (
                    <Webcam
                        audio={false}
                        height={400}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        width={300}
                        videoConstraints={videoConstraints}
                        className="rounded-md border w-1/2"
                    />
                )}

                {/* PREVIEW FOTO */}
                {preview && (
                    <div className="w-1/2">
                        <h3 className="text-sm font-semibold mb-2">Preview Foto:</h3>
                        <img src={preview} alt="Preview" className="rounded-md border" />
                    </div>
                )}
                          </div>

                              <div className="flex justify-between">
                                {cameraOn && (
                                <button
                                  onClick={capturePhoto}
                                  type='button'
                                  className="w-1/2 mr-2 bg-green-600 text-white font-semibold py-2 rounded-md mt-2 hover:bg-green-700"
                                >
                                  📸 Ambil Foto
                                </button>
                                )}
                                <button
                                type='button'
                                  onClick={startCamera}
                                  className="w-1/2 ml-2 bg-gray-100 text-black border border-gray-400 font-semibold py-2 rounded-md mt-2 hover:border-blue-700"
                                >
                                  Akses Kamera
                                </button>
                              </div>
                            </div>
                          </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-md mt-2 hover:bg-green-700"
              onClick={handleSubmit}
            >
              ✅ Simpan Data Pengambilan
            </button>
          </form>
        </div>
    )
}
export default PickingForm;
