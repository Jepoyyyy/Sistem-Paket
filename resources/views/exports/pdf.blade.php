<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Data Pengiriman</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: center; vertical-align: middle; }
        th { background: #eee; }
        img { max-height: 60px; }
    </style>
</head>
<body>
    <h2>Data Pengiriman Paket</h2>
    <table>
        <thead>
            <tr>
                <th>No Unik</th>
                <th>Pengirim</th>
                <th>Penerima</th>
                <th>Catatan</th>
                <th>Foto Paket</th>
                <th>Selfie Pengambil</th>
                <th>Pengambil</th>
                <th>Petugas Pengambilan</th>
                <th>No. Pengambil</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($pakets as $paket)
                <tr>
                    <td>{{ $paket->unique_number }}</td>
                    <td>{{ $paket->sender_name }}</td>
                    <td>{{ $paket->receiver_name }}</td>
                    <td>{{ $paket->package_notes }}</td>

                    {{-- Foto Paket --}}
                    <td>
                        @if($paket->package_photo)
                            <img src="{{ public_path('storage/' . $paket->package_photo) }}" alt="Foto Paket">
                        @else
                            -
                        @endif
                    </td>

                    {{-- Selfie Pengambil --}}
                    <td>
                        @if($paket->receiver_photo)
                            <img src="{{ public_path('storage/' . $paket->receiver_photo) }}" alt="Selfie Pengambil">
                        @else
                            -
                        @endif
                    </td>

                    <td>{{ $paket->picker_name ?? '-' }}</td>
                    <td>{{ $paket->pickerofficer_name ?? '-' }}</td>
                    <td>{{ $paket->picker_phone ?? '-' }}</td>
                    <td>{{ $paket->status }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
