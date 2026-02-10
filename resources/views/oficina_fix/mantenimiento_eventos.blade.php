<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mantenimientos eventos</title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/m_eventos.css') }}" >
    <link rel="stylesheet" href="{{asset('CSS/modal_estructura.css')}}">

    <script>
        let local_sesion = @json(session('usuario'));
    </script>
    <script src="{{ asset('JS/peticiones.js') }}"></script>
    <script src="{{ asset('JS/mantenimientos/M_eventos.js')}}"></script>


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
            <div class="contenido">
                <div class="title">
                    <h2>Mantenimientos</h2>
                    <h2>-</h2>
                    <h2 style="font-style: oblique; font-weight: 500;">Eventos</h2>
                </div>
                <div class="btn_header">
                    <div class="combo_res">
                        @if (session('usuario') && session('usuario')['permisos'] == 'administrador')
                            <input type="text" class="data_register">
                            <select class="select_res">
                                @foreach ($tbl_parques as $parques)
                                    <option value="{{ $parques['id'] }}"> {{ $parques['nombre_parque'] }} </option>
                                @endforeach
                            </select>
                        @else
                            <input type="text" class="data_register">
                        @endif
                        
                    </div>
                    <div class="btn_style btn_agregar" onclick="agregar_evento()">
                        <p>Agregar</p>
                    </div>
                </div>
                <!-- BORRAR SECCION -->
                <div>
                    @if (session('usuario') && session('usuario')['permisos'] == 'administrador')
                        
                    @else
                        
                    @endif
                </div>
                <!-- BORRAR SECCION -->
                <div class="contenedor_main">
                    <div class="datatable">
                        <table class="table_maps display responsive" id="myTable">
                            <thead class="display-head">
                                <tr>
                                    <th>Tipo de evento</th>
                                    @if (session('usuario') && session('usuario')['permisos'] == 'administrador')
                                        <th>Parque</th>
                                    @endif
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($tbl_tipos_eventos as $tipos_eventos)
                                <tr>
                                    <td>
                                        <input type="text" value="{{ $tipos_eventos['tipo'] }}" class="input_custom data_input_{{$tipos_eventos['id']}}">
                                    </td>
                                    @if (session('usuario') && session('usuario')['permisos'] == 'administrador')
                                        <td>
                                            <select class="select_custom data_select_{{$tipos_eventos['id']}}">
                                                @foreach ($tbl_parques as $parques)
                                                    @if ($parques['id'] == $tipos_eventos['id_parque'])
                                                        <option value="{{ $parques['id'] }}" selected> {{ $parques['nombre_parque'] }} </option>
                                                    @else
                                                        <option value="{{ $parques['id'] }}"> {{ $parques['nombre_parque'] }} </option>
                                                    @endif
                                                @endforeach
                                            </select>
                                        </td>
                                    @else
                                        
                                    @endif
                                    <td>
                                        <select class="select_custom data_input_{{$tipos_eventos['id']}}">
                                            @if ($tipos_eventos['estado'] == 'activo')
                                                <option value="{{ $tipos_eventos['estado'] }}" selected>{{ $tipos_eventos['estado'] }}</option>
                                                <option value="inactivo">inactivo</option>
                                            @else
                                                <option value="activo">activo</option>
                                                <option value="{{ $tipos_eventos['estado'] }}" selected>{{ $tipos_eventos['estado'] }}</option>
                                            @endif
                                        </select>
                                    </td>
                                    <td class="btn_section">
                                        <div class="btn_style btn_eliminar data_input_{{$tipos_eventos['id']}}" onclick="eliminar_evento({{$tipos_eventos['id']}})">
                                            Eliminar
                                        </div>
                                        <div class="btn_style btn_guardar data_input_{{$tipos_eventos['id']}}" onclick="guardar_cambios({{$tipos_eventos['id']}})">
                                            Guardar
                                        </div>
                                    </td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="/IMG/Escudo.svg" class="rounded me-2 toast_svg" alt="...">
            <strong class="me-auto"> --- </strong>
            <button type="button" class="btn_close_alert" data-bs-dismiss="toast" aria-label="Close" onclick="hide_alert()"></button>
        </div>
        <div class="toast-body"> --- </div>
    </div>
</body>



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
                    targets: -3
                },
            ]
        });
    });
</script>

<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>

<script>
    document.querySelectorAll(".cont-items-categorias")[6].classList.add("categoria-active")
</script>

</html>