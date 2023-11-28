<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reservaciones - solicitudes</title>


    <script src="{{ url('JS/peticiones.js') }}"></script>
    <script src="{{ asset('JS/mantenimientos/Quick/R_funcion.js') }}"></script>


    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/new/R_solicitudes.css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}">
    <link rel="stylesheet" href="{{asset('CSS/modal_estructura.css')}}">

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
                    <h2 style="font-style: oblique; font-weight: 500;">Solicitudes</h2>
            </div>
            <!-- ------------------------------------------------- -->
                <div class="datatable">
                    <table class="table_maps display responsive" id="myTable">
                        <thead class="display-head">
                            <tr>
                                <th>Codigo reservacion</th>
                                <th>Parque</th>
                                <th>Gazebo</th>
                                <th>Fecha del evento</th>
                                <th>Fecha de emision</th>
                                <th>Acciones</th>
                                <th>Mas detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                            <script>
                                let date = null
                                let time = null
                            </script>
                            @foreach ($tbl_reservaciones as $tbl_reservacione)
                                <tr class="solicitud_{{ $tbl_reservacione['id'] }}">
                                    <td>{{ $tbl_reservacione['codigo_reservacion'] }}</td>
                                    <td>{{ $tbl_reservacione['nombre_parque'] }}</td>
                                    <td>{{ $tbl_reservacione['nombre_zona'] }}</td>
                                    <td>{{ $tbl_reservacione['fecha_evento'] }}</td>
                                    <td>{{ $tbl_reservacione['agregado_en'] }}</td>
                                    <td>
                                        <div style="display: flex; gap: 0.2rem;">
                                            <img src="{{ asset('IMG/xmark-solid.svg') }}" class="btn_rechazar rojo_{{ $tbl_reservacione['id'] }}"  onclick="pantalla_confirmacion({{ $tbl_reservacione['id'] }},'rechazada','externo')">
                                            <img src="{{ asset('IMG/check-solid.svg') }}" class="btn_aceptar verde_{{ $tbl_reservacione['id'] }}" onclick="pantalla_confirmacion({{ $tbl_reservacione['id'] }},'confirmada','externo')">    
                                        </div>
                                    </td>
                                    <td>
                                        <div style="text-align: -webkit-center;">
                                            <img src="/IMG/pen-solid.svg" onclick="view_more({{ $tbl_reservacione['id'] }})">
                                        </div>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            <!-- ------------------------------------------------- -->
            </div>
        </div>
        <!-- ----------------------------------------------------------------------------------- -->
        <section class="cuerpo-extra">
            <div class="cont-logo-principal">
                <img  src="/IMG/Logo_ADN.svg" alt="" class="logo-principal">
            </div>
            <!-- ============================================= -->
            <div class="contenido">
                <div class="title title_2">
                    <div class="text_flex">
                        <img onclick="retroceder()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" style="cursor: pointer; width:4%; min-width: 30px;">
                        <h2>Reservaciones</h2>
                        <h2 class="text_responsive">-</h2>
                        <h2 class="text_responsive" style="font-style: oblique; font-weight: 500;">Solicitudes</h2>
                        <h2 class="text_responsive">-</h2>
                        <h2 style="font-style: oblique; font-weight: 500;" class="text_responsive">Detalles</h2>
                    </div>
                    <div class="section_botones">
                        <div class="btn_style boton_rechazar" onclick="pantalla_confirmacion_display('none')">
                            <p>Rechazar</p>
                        </div>
                        <div class="btn_style boton_aceptar" onclick="pantalla_confirmacion_display()">
                            <p>Aceptar</p>
                        </div>
                    </div>
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
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Correo electronico</p>
                                        <p class="input_reservacion">---</p>
                                    </div>
                                </div>
                                <div class="info_text">
                                    <div class="reservacion_info">
                                        <p class="input_header">Celular</p>
                                        <p class="input_reservacion">---</p>
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
    <!-- ----------------------------------------------------------------------------------- -->
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="/IMG/Escudo.svg" class="rounded me-2 toast_svg" alt="...">
            <strong class="me-auto">Titulo</strong>
            <button type="button" class="btn_close_alert" data-bs-dismiss="toast" aria-label="Close" onclick="hide_alert()"></button>
        </div>
        <div class="toast-body">
            contenido del mensaje
        </div>
    </div>
    <!-- ----------------------------------------------------------------------------------- -->
    <div class="modal_confirmacion">
        <div class="modal_confirmacion_contenido">
            <div class="modal_top">
                <p>Confirmacion</p>
            </div>
            <div class="modal_mid">
                <p class="modal_info_desc">Las siguientes solicitudes comparten un horario similar y por lo tanto seran descartadas</p>
                <p class="modal_info_quest">¿Esta seguro de que desea continuar?</p>
            </div>
            <div class="modal_mid_bottom">
                <div class="solicitud_card">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
                    <p>---</p>
                </div>
            </div>
            <div class="modal_bottom">
                <div class="btn_section_confirmacion">
                    <div class="btn_style btn_rechazar_modal" onclick="pantalla_confirmacion_display('none')">
                        Cancelar
                    </div>
                    <div class="btn_style btn_confirmar_modal" onclick="pantalla_confirmacion_acciones()">
                        Confirmar
                    </div>
                </div>
            </div>
        </div>
    </div>

</body>


<script>
    let local_sesion = @json(session('usuario'));
</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/R_solicitudes.js') }}"></script>
<script>
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
    document.querySelector("#myTable > thead > tr > th:nth-child(5)").click()
</script>
<script>
    document.querySelectorAll(".cont-items-categorias")[1].classList.add("categoria-active")
</script>
</html>