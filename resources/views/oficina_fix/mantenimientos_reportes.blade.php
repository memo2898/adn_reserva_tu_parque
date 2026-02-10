<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Seccion de reportes</title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/reportes.css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >

    <script>
        let local_sesion = @json(session('usuario'));
    </script>
    <script src="{{ asset('JS/peticiones.js') }}"></script>

    <!-- LIBRERIAS EXTERNAS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

    <!-- DATATABLE -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css" />
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.js"></script>

    <!-- Incluye pdfMake -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/pdfmake.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.68/vfs_fonts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/html-to-pdfmake/browser.js"></script>

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
                <div class="title_variant TV_2">
                    <h2>Reportes</h2>
                    <h2>-</h2>
                    <h2 style="font-style: oblique; font-weight: 500;">Opciones de reporte</h2>
                </div>
                <div class="card_section">
                    <div class="card_options" onclick="report_select('reservaciones')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"/></svg>
                        <div class="card_info">
                            <p>Reservaciones</p>
                        </div>
                    </div>
                    <!-- 
                    <div class="card_options" onclick="report_select('N2')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"/></svg>
                        <div class="card_info">
                            <p>Reporte #N</p>
                        </div>
                    </div>
                    <div class="card_options" onclick="report_select('N3')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"/></svg>
                        <div class="card_info">
                            <p>Reporte #N</p>
                        </div>
                    </div>
                    <div class="card_options" onclick="report_select('N4')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"/></svg>
                        <div class="card_info">
                            <p>Reporte #N</p>
                        </div>
                    </div>
                    <div class="card_options" onclick="report_select('N1')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M64 464c-8.8 0-16-7.2-16-16V64c0-8.8 7.2-16 16-16H224v80c0 17.7 14.3 32 32 32h80V448c0 8.8-7.2 16-16 16H64zM64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V154.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0H64zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24H264c13.3 0 24-10.7 24-24s-10.7-24-24-24H120z"/></svg>
                        <div class="card_info">
                            <p>Reporte #N</p>
                        </div>
                    </div>
                    -->
                </div>
            </div>
            <div class="cuerpo_secundario">
                <div class="title_variant">
                    <img onclick="retroceder()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" alt="" srcset="" style="width: 2rem;cursor: pointer;">
                    <h2>Reportes</h2>
                    <h2 class="text_hidden">-</h2>
                    <h2 class="text_hidden" style="font-style: oblique; font-weight: 500;">Actividad registrada</h2>
                </div>
                <div class="secund_content">
                    <div class="input_box">
                        <div class="top_filter_box">
                            <div class="date_top_section">
                                <div class="input_date">
                                    <p>Desde</p>
                                    <!-- 
                                    <select id="input_desde" oninput="selector_fecha('desde')"></select>
                                    -->
                                    <select id="input_desde"></select>
                                </div>
                                <div class="input_date">
                                    <p>Hasta</p>
                                    <!-- 
                                    <select id="input_hasta" oninput="selector_fecha('hasta')"></select>
                                    -->
                                    <select id="input_hasta"></select>
                                </div>
                            </div>
                            <div>
                                <select class="input_select" oninput="select_filtre()">
                                    <!--
                                    <option value="Todos">Todos</option>
                                    -->
                                </select>
                            </div>
                        </div>
                        <div class="middle_filter_box">
                            <!--
                            <div class="input_buscador_icon">
                                <input type="text">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onclick="get_report()"><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path></svg>
                            </div>
                            -->
                            <!--
                            <div>
                                <select name="" id="" class="input_select">
                                    <option value="1">1</option>
                                </select>
                            </div>
                            -->
                            <div class="btn_section">
                                <div class="btn_style btn_reporte" onclick="realizar_reporte()">
                                    <p>Reporte</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- =================================================== -->
                    <div class="datatable">
                        <table class="table_maps display responsive" id="myTable">
                            <thead class="display-head">
                                <tr>
                                    <th>---</th>
                                    <th>---</th>
                                    <th>---</th>
                                    <th>---</th>
                                    <th>---</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>contenido</td>
                                    <td>contenido</td>
                                    <td>contenido</td>
                                    <td>contenido</td>
                                    <td>contenido</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- =================================================== -->
                </div>
            </div>
        </div>
    </section>
</body>


<script src="{{ asset('JS/mantenimientos/reportes.js') }}"></script>
<script>
    //let table = new DataTable('#myTable');
    /*
    $(document).ready(function() {
        let table = $('#myTable').DataTable({
            responsive: true
        });
    });
    */
    /*
    $(document).ready(function() {
        let table = $('#myTable').DataTable({
            responsive: true,
            columnDefs: [
                {
                    responsivePriority: 1,
                    targets: -1
                },
            ]
        });
    });
    */
</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[10].classList.add("categoria-active")
</script>

</html>