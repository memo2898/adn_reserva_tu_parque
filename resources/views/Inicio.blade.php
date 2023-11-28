<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Home</title>

    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/new/home.css') }}">
    <link rel="stylesheet" href="{{ asset('CSS/new/Responsive.css') }}">

    <!-- LIBRERIAS EXTERNAS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

    <!-- DATATABLE -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css" />
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.js"></script>

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
                <!--Nombre de la persona start-->
                <div class="cont-saludo-usuario">
                    <h3 class="saludo-usuario">¡Bienvenido {{ session('usuario')['nombre'] }} {{ session('usuario')['apellido'] }}!</h3>
                </div>
                <!--Nombre de la persona end-->
                <!--Titulo principal pagina start-->
                <div class="cont-titulo-principal-pagina">
                    <h2 class="titulo-principal-pagina">Dashboard</h2>
                </div>
                <!-- ============================================= -->
                <!--Area de las cards del Dashboard start-->
                <div class="cont-cards-dash">
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/espera_1.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">En espera</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/pendiente_dash.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">Pendientes</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/confirmada_dash.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">Confirmadas</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/rechazada_dash.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">Rechazadas</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/realizada_dash.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">Realizadas</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
                <!--Item cards Dashboard start-->
                <div class="cont-card-unique-dash card-alert">
                    <div class="cont-ico-card-dash">
                        <img class="ico-dash-card" src="/IMG/new/iconos/SVG/vencida_dash.svg" alt="" srcset="">
                    </div>
                    <div class="cont-texts-card-dash">
                        <span class="descripcion-card-dash">Vencidas</span>
                        <span class="contador-card-dash">--</span>
                    </div>
                </div>
                <!--Item cards Dashboard end-->
        </div>
  <!--Area de las cards del Dashboard end-->

  <!--Area de charts start-->
  <div class="area-charts">
        <div class="chart-avance">
            <canvas id="myChart"></canvas>
        </div>
  </div>
  <!--Area de charts end-->
</div>

                <!-- ============================================= -->
            </div>
        </div>
    </section>
</body>


<script>
    let local_sesion = @json(session('usuario'));
</script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
    /*Colocar aqui la posición active del menu (Start)*/
    let posicionActual=0;
    let everyCategoryItems=document.querySelectorAll(".cont-items-categorias");
    for (let i = 0; i < everyCategoryItems.length; i++) {
        if(i==posicionActual){
            everyCategoryItems[i].classList.add("categoria-active");
            break;
        }
    }
    /*Colocar aqui la posición active del menu (end)*/
</script>
<script src="{{ asset('JS/mantenimientos/dashboard.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/Quick/Responsive.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[0].classList.add("categoria-active")
</script>

</html>