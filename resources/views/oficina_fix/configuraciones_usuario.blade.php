<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mi usuario</title>
    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/configuraciones_usuarios.css') }}" >

    <script src="{{ asset('JS/peticiones.js') }}"></script>


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
                <div class="title">
                    <h2>Configuraciones</h2>
                    <h2>-</h2>
                    <h2 style="font-style: oblique; font-weight: 500;">Mi usuario</h2>
                </div>
            </div>
            <div class="main_body">
                <div class="title_card">
                    <h2 class="data_header">Administrador</h2>                   
                    <h2> del </h2>
                    <h2 class="data_header">Nombre del parque</h2>
                </div>
                <div class="main_card">
                    <div class="more_img_section">
                        <div class="more_img">
                            @if (session('usuario'))
                                <img src="/IMG/user.png" alt="" class="view_img">
                            @else
                                <img src="/IMG/user.png" alt="">
                            @endif
                        </div>
                        <input type="file" id="file_upload_1">
                        <label for="file_upload_1" class="upload_label upload_label_1">
                            Subir imagen
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                        </label>
                    </div>
                    <div class="personal_box">
                        <div class="personal_section">
                            <p>Nombre</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                        <div class="personal_section">
                            <p>Apellido</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                        <div class="personal_section">
                            <p>Documento</p>
                            <div class="input_combinado">
                                <select class="data_input">
                                    @foreach ($tbl_tipo_documento as $tipo_documento)
                                        <option value="{{$tipo_documento['id']}}">{{$tipo_documento['tipo_documento']}}</option>
                                    @endforeach
                                </select>
                                <input type="text" class="personal_input_c data_input" value="">    
                            </div>
                        </div>
                        <div class="personal_section">
                            <p>Correo</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                        <div class="personal_section">
                            <p>Celular</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                        <div class="personal_section">
                            <p>Usuario</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                        <div class="personal_section">
                            <p>Contraseña</p>
                            <input type="text" class="personal_input data_input" value="">
                        </div>
                    </div>
                    <div class="inferior_btn_section">
                        <div class="btn_style btn_guardar" onclick="guardar_cambios()">
                            <p>Guardar cambios</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

</body>

<script>
    let local_sesion = @json(session('usuario'));
</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/C_usuarios.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[9].classList.add("categoria-active")
</script>

<!-- ENCRYPT -->
<script src="{{ asset('JS/mantenimientos/Quick/R_funcion.js') }}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js" integrity="sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

</html>