<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mantenimientos - Roles </title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >
    <link rel="stylesheet" href="{{asset('CSS/modal_estructura.css')}}">
    <link rel="stylesheet" href="{{ asset('CSS/new/m_roles.css') }}" >

    <script>
        let local_sesion = @json(session('usuario'));
    </script>
    <script src="{{ asset('JS/peticiones.js') }}"></script>
    <script src="{{ asset('JS/mantenimientos/M_roles.js') }}"></script>

        <!-- LIBRERIAS EXTERNAS -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
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
            <section class="page_main">
                <div class="contenido">
                    <div class="title">
                        <h2>Mantenimientos</h2>
                        <h2>-</h2>
                        <h2 style="font-style: oblique; font-weight: 500;">Roles</h2>
                    </div>
                    <div class="btn_header">
                        <div class="btn_style btn_agregar" onclick="Desplegar_modal()">
                            <p>Agregar</p>
                        </div>
                    </div>
                    <div class="contenedor_main">
                        <div class="datatable">
                            <table class="table_maps display responsive" id="myTable">
                                <thead class="display-head">
                                    <tr>
                                        <th>Rol</th>
                                        <th>Permisos</th>
                                        <th>Estado</th>
                                        <th>Mas detalles</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach ($tbl_permisos_usuarios as $permisos_usuarios)
                                        @if ($permisos_usuarios['permisos'] != 'administrador')
                                            <tr>
                                                <td>
                                                    <input type="text" value="{{ $permisos_usuarios['posicion'] }}" class="input_custom data_input_{{$permisos_usuarios['id']}}">
                                                </td>
                                                <td>
                                                    <select class="input_custom data_input_{{$permisos_usuarios['id']}}">
                                                        @if ($permisos_usuarios['permisos'] == 'ver')
                                                            <option value="ver" selected>Ver solicitudes</option>
                                                            <option value="autorizar">Autorizar solicitudes</option>
                                                            <option value="gestionar">Gestionar parques</option>
                                                        @elseif($permisos_usuarios['permisos'] == 'autorizar')
                                                            <option value="ver">Ver solicitudes</option>
                                                            <option value="autorizar" selected>Autorizar solicitudes</option>
                                                            <option value="gestionar">Gestionar parque</option>
                                                        @elseif($permisos_usuarios['permisos'] == 'gestionar')
                                                            <option value="ver">Ver solicitudes</option>
                                                            <option value="autorizar">Autorizar solicitudes</option>
                                                            <option value="gestionar" selected>Gestionar parque</option>
                                                        @elseif($permisos_usuarios['permisos'] == 'administrador')
                                                            <option value="administrador">Administrador</option>
                                                        @endif
                                                    </select>
                                                </td>
                                                <td>
                                                    <select class="input_custom data_input_{{$permisos_usuarios['id']}}">
                                                    @if ($permisos_usuarios['estado'] == 'activo')
                                                        <option value="{{ $permisos_usuarios['estado'] }}" selected>{{ $permisos_usuarios['estado'] }}</option>
                                                        <option value="inactivo">inactivo</option>
                                                    @else
                                                        <option value="activo">activo</option>
                                                        <option value="{{ $permisos_usuarios['estado'] }}" selected>{{ $permisos_usuarios['estado'] }}</option>
                                                    @endif
                                                    </select>
                                                </td>
                                                <td class="btn_section">
                                                    <div class="btn_style btn_eliminar data_input_{{$permisos_usuarios['id']}}" onclick="eliminar_rol({{$permisos_usuarios['id']}})">
                                                        Eliminar
                                                    </div>
                                                    <div class="btn_style btn_guardar data_input_{{$permisos_usuarios['id']}}" onclick="guardar_rol({{$permisos_usuarios['id']}})">
                                                        Guardar
                                                    </div>
                                                </td>
                                            </tr>
                                        @endif
                                    @endforeach
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>
            <section class="page_extra">
                <div class="title">
                    <img onclick="retrocede()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" alt="" srcset="" style="width: 30px; cursor:pointer;">
                    <h2>Mantenimientos</h2>
                    <h2>-</h2>
                    <h2 style="font-style: oblique; font-weight: 500;">Roles</h2>
                    <div class="section_botones">
                        <div class="btn_style btn_guardar" onclick="">
                            <p>Guardar</p>
                        </div>
                        <div class="btn_style btn_eliminar" onclick="">
                            <p>Eliminar</p>
                        </div>
                    </div>
                </div>
                <div class="contenido_adicional">
                    <h2>Lista de permisos disponibles</h2>
                    <div class="contenido_box">
                        <div class="box_combo_input">
                            <div class="box_header">
                                <p>Nombre del Rol</p>
                                <div class="box_input">
                                    <input type="text" class="data_input">
                                </div>
                            </div>
                            <div class="box_extra">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </section>


    <div class="ventana_modal">
        <div class="ventana_modal_contenido">
            <section class="seccion_modal">
                <div class="modal_top">
                    <p>Informacion del rol</p>
                </div>
                <div class="modal_mid">
                    <div class="event_card">
                        <p>Nombre</p>
                        <input class="event_data">
                    </div>
                    <div class="event_card event_card_permisos">
                        <p>Permisos de sistema</p>
                        <div class="permisos">

                            <div class="permisos_packed">
                                <div class="permisos_titulo">
                                    <select class="select_permisos" onchange="selector_permisos()">
                                        <option value="ver">Ver solicitudes</option>
                                        <option value="autorizar">Autorizar solicitudes</option>
                                        <option value="gestionar">Gestionar parque</option>
                                    </select>
                                </div>
                                <div class="permisos_info">
                                    Solo pueden ver las solicitudes y la informacion basica del sistema
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <div class="modal_bottom">
                    <div class="seccion_botones">
                        <div class="btn_style btn_rechazar_modal" onclick="cerrar_modal()">
                            Cerrar
                        </div>
                        <div class="btn_style btn_confirmar_modal" onclick="Registrar_rol()">
                            Guardar
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <script>
        window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
            var modal = document.querySelector(".ventana_modal");
            if (event.target == modal) {
                document.querySelector(".ventana_modal").style.display = 'none'
            }
        });
    </script>



<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
        <img src="/IMG/Escudo.svg" class="rounded me-2 toast_svg" alt="...">
        <strong class="me-auto"> --- </strong>
        <button type="button" class="btn_close_alert" data-bs-dismiss="toast" aria-label="Close" onclick="cerrar_alerta()"></button>
    </div>
    <div class="toast-body"> --- </div>
</div>

</body>



<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
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
                    targets: -4
                },
            ]
        });
    });
</script>

<script>
    document.querySelectorAll(".cont-items-categorias")[7].classList.add("categoria-active")
</script>
</html>