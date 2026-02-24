<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR - Parques ADN</title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <script type="text/javascript" src="https://unpkg.com/qr-code-styling@1.5.0/lib/qr-code-styling.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }


        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f0f4f8;
            color: #1a2e4a;
            padding: 2rem;
        }

        .page-header {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            margin-bottom: 2.5rem;
            padding-bottom: 1.5rem;
            border-bottom: 3px solid #105289;
            flex-wrap: wrap;
        }

        .page-header img {
            height: 60px;
        }

        .page-header-text h1 {
            font-size: 1.6rem;
            font-weight: 700;
            color: #105289;
        }

        .page-header-text p {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 0.25rem;
        }

        .btn-download-all {
            margin-left: auto;
            background: #105289;
            color: #fff;
            border: none;
            padding: 0.65rem 1.4rem;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
        }

        .btn-download-all:hover { background: #0d3f6b; }

        .parks-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
        }

        .park-qr-card {
            background: #fff;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 12px rgba(16,82,137,.10);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }

        .park-qr-card h3 {
            font-size: 1rem;
            font-weight: 700;
            color: #105289;
            text-align: center;
        }

        .park-qr-card .park-location {
            font-size: 0.8rem;
            color: #6b7280;
            text-align: center;
        }

        .qr-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.5rem;
            background: #fff;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
        }

        .btn-download {
            width: 100%;
            background: #f0f4f8;
            color: #105289;
            border: 2px solid #105289;
            padding: 0.55rem 1rem;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .btn-download:hover {
            background: #105289;
            color: #fff;
        }

        .empty-state {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
            color: #6b7280;
        }

        @media print {
            .btn-download, .btn-download-all { display: none; }
            body { background: #fff; padding: 1rem; }
            .park-qr-card { box-shadow: none; border: 1px solid #ddd; }
        }
    </style>
</head>
<body>

    <div class="page-header">
        <img src="{{ asset('IMG/Logo_ADN.svg') }}" alt="ADN">
        <div class="page-header-text">
            <h1>QR de Parques</h1>
            <p>Descarga los códigos QR para colocarlos físicamente en cada parque.</p>
        </div>
        @if(count($tbl_parques) > 0)
            <button class="btn-download-all" onclick="downloadAll()">Descargar todos</button>
        @endif
    </div>

    <div class="parks-grid">
        @forelse($tbl_parques as $parque)
            <div class="park-qr-card">
                <h3>{{ $parque->nombre_parque }}</h3>
                @if($parque->direccion)
                    <p class="park-location">{{ $parque->direccion }}</p>
                @endif
                <div class="qr-container">
                    <div id="qr_{{ $parque->id }}"></div>
                </div>
                <button class="btn-download" onclick="downloadQR({{ $parque->id }}, '{{ addslashes($parque->nombre_parque) }}')">
                    Descargar QR
                </button>
            </div>
        @empty
            <div class="empty-state">
                <p>No hay parques activos registrados.</p>
            </div>
        @endforelse
    </div>

    <script>
        const baseUrl = '{{ url('/reservaciones') }}';
        const qrCodes = {};

        const parks = @json($tbl_parques->map(fn($p) => ['id' => $p->id, 'nombre' => $p->nombre_parque]));

        parks.forEach(function(park) {
            const url = baseUrl + '?parqueID=' + park.id;

            const qr = new QRCodeStyling({
                width: 300,
                height: 300,
                data: url,
                margin: 0,
                image: '/IMG/Azul.svg',
                qrOptions: {
                    typeNumber: '0',
                    mode: 'Byte',
                    errorCorrectionLevel: 'Q'
                },
                imageOptions: {
                    hideBackgroundDots: true,
                    imageSize: 0.4,
                    margin: 4
                },
                dotsOptions: {
                    type: 'square',
                    color: '#105289'
                },
                backgroundOptions: {
                    color: '#ffffff'
                },
                cornersSquareOptions: {
                    type: '',
                    color: '#105289'
                },
                cornersDotOptions: {
                    type: '',
                    color: '#105289'
                }
            });

            qr.append(document.getElementById('qr_' + park.id));
            qrCodes[park.id] = { qr: qr, nombre: park.nombre };
        });

        function downloadQR(parkId, parkName) {
            qrCodes[parkId].qr.download({ name: parkName, extension: 'png' });
        }

        function downloadAll() {
            const ids = Object.keys(qrCodes);
            ids.forEach(function(id, index) {
                setTimeout(function() {
                    qrCodes[id].qr.download({ name: qrCodes[id].nombre, extension: 'png' });
                }, index * 500);
            });
        }
    </script>

</body>
</html>
