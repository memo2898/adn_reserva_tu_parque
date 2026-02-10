<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reservaciones - espera</title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <script src="{{ asset('JS/peticiones.js') }}"></script>
    <script src="{{ asset('JS/mantenimientos/R_espera.js') }}"></script>


    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/R_espera.css') }}" >

        <!-- LIBRERIAS EXTERNAS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    
        <!-- DATATABLE -->
        <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css" />
        <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.js"></script>

    <!-- DATATABLE-responsive -->
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap.css">
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.js"></script>

</head>
<body class="Home">
    <section class="contenedor-full-page">
        <div class="bar_icon" onclick="bar_display()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>
        </div>
        <div class="menu-side-bar">
            <!--Codigo menu aqui-->
        </div>
        <div class="cuerpo-pagina">
            <div class="cont-logo-principal">
                <img  src="/IMG/Logo_ADN.svg" alt="" class="logo-principal">
            </div>
            <!-- ============================================= -->
            <div class="contenido">
                <div class="title">
                    <h2>Reservaciones</h2>
                    <h2>-</h2>
                    <h2 style="font-style: oblique; font-weight: 500;">Espera</h2>
                </div>                
                <div class="table">
                    <!-- -->
                    <div class="datatable">
                        <table class="table_maps display responsive" id="myTable">
                            <thead class="display-head">
                                <tr>
                                    <th>Codigo reservacion</th>
                                    <th>Parque</th>
                                    <th>Zona</th>
                                    <th>Fecha del evento</th>
                                    <th>Fecha de emision</th>
                                    <th>Estado</th>
                                    <th>Mas detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($tbl_reservaciones as $tbl_reservacione)
                                <tr>
                                    <td>{{ $tbl_reservacione['codigo_reservacion'] }}</td>
                                    <td>{{ $tbl_reservacione['nombre_parque'] }}</td>
                                    <td>{{ $tbl_reservacione['nombre_zona'] }}</td>
                                    <td>{{ $tbl_reservacione['fecha_evento'] }}</td>
                                    <td>{{ $tbl_reservacione['agregado_en'] }}</td>
                                    <td>{{ $tbl_reservacione['estado'] }}</td>
                                    <td style="text-align: -webkit-center;"><img src="/IMG/pen-solid.svg" onclick="view_more({{ $tbl_reservacione['id'] }})"></td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <!-- -->
                </div>
            </div>
        </div>
        <section class="cuerpo-extra">
            <div class="cont-logo-principal">
                <img  src="/IMG/Logo_ADN.svg" alt="" class="logo-principal">
            </div>
            <!-- ============================================= -->
            <div class="contenido">
                <div class="title">
                    <img onclick="retroceder()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" style="cursor: pointer; width:4%; min-width: 30px;">
                    <h2>Reservaciones</h2>
                    <h2 class="title_2">-</h2>
                    <h2 class="title_2" style="font-style: oblique; font-weight: 500;">Reservacion</h2>
                    <h2 class="title_2">-</h2>
                    <h2 class="title_2" style="font-style: oblique; font-weight: 500;">Detalles</h2>
                </div>
                <div>
                    <div class="details_body">
                        <div class="img_info">
                            <div class="box_content">
                                <p class="img_text">Nombre parque</p>
                                <div class="img_box">
                                    <img  src="/IMG/parque_default.avif" class="parque_img">
                                </div>
                                <p class="img_text">Direccion</p>
                            </div>
                            <div class="box_content">
                                <p class="img_text">Nombre zona</p>
                                <div class="img_box">
                                    <img  src="/IMG/parque_default.avif" class="parque_img">
                                </div>   
                                <p class="img_text">Direccion</p>
                            </div>
                    </div>
                        <!-- ============================================ -->
                        <div class="info_section">
                            <div class="reservacion_estructura">
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Nombre</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                    <div class="reservacion_info">
                                        <p class="input_header">Apellido</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <!-- -->
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Documento</p>
                                        <p class="input_reservacion"> --- </p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Correo electronico</p>
                                        <p class="input_reservacion"> --- </p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Celular</p>
                                        <p class="input_reservacion"> --- </p>
                                    </div>
                                </div>
                            </div>
                            <!-- ============================= -->
                            <div class="reservacion_estructura">
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Fecha del evento</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <!-- -->
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Desde</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                    <div class="reservacion_info">
                                        <p class="input_header">Hasta</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Motivo del evento</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Adultos participantes</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                    <div class="reservacion_info">
                                        <p class="input_header">niños participantes</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Descripcion del evento</p>
                                        <textarea class="input_reservacion" id="input_long" cols="30" rows="10" disabled>
                                            ---
                                        </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- ============================================ -->
                    </div>
                </div>
            </div>
        </section>

    </section>
</body>

<script>
    let local_sesion = @json(session('usuario'));
</script>
<script>
    //let table = new DataTable('#myTable');
    /*
    $(document).ready(function() {
        let table = $('#myTable').DataTable({
            responsive: true
        });
    });
    */
    $(document).ready(function() {
        let table = $('#myTable').DataTable({
            responsive: true,
            columnDefs: [
                {
                    responsivePriority: 2,
                    targets: -1 
                },
                {
                    responsivePriority: 3,
                    targets: -2
                },
                {
                    responsivePriority: 1,
                    targets: -7 
                },
                {
                    responsivePriority: 4,
                    targets: -5
                }
            ]
        });
    });

</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[3].classList.add("categoria-active")
</script>
</html>