<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mantenimiento - Usuarios</title>

    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/m_usuarios.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/modal_estructura.css') }}" >

    <script src="{{ asset('JS/peticiones.js') }}"></script>

    <!-- LIBRERIAS EXTERNAS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <!-- DATATABLE -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css" />
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.js"></script>
    <!-- LIBRERIA PARA CELULARES -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
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
                <section class="section_main">
                    <div class="title" style="margin-bottom: 1rem !important;">
                        <h2>Mantenimientos</h2>
                        <h2>-</h2>
                        <h2 style="font-style: oblique; font-weight: 500;">Usuarios</h2>
                    </div>
                    <div class="user_agregar">
                        <div onclick="agregar()">
                            <p>Agregar</p>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/></svg>    
                        </div>
                    </div>
                    <div class="datatable">
                        <table class="table_maps display responsive" id="myTable">
                            <thead class="display-head">
                                <tr>
                                    <th>Usuario</th>
                                    <th>Rol</th>
                                    <th>Parque</th>
                                    <th>Estado</th>
                                    <th>Mas detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($tbl_usuarios as $tbl_usuario)
                                    @if ($tbl_usuario['rol'] != 'administrador')
                                        <tr>
                                            <td>{{ $tbl_usuario['usuario'] }}</td>
                                            <td>{{ $tbl_usuario['posicion'] }}</td>
                                            <td>{{ $tbl_usuario['parque'] }}</td>
                                            <td>{{ $tbl_usuario['estado'] }}</td>
                                            <td><img src="/IMG/pen-solid.svg" onclick="view_more({{ $tbl_usuario['id'] }})"></td>
                                        </tr>
                                    @endif
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </section>
                <section class="section_more">
                    <div class="title" style="margin-bottom: 1rem !important;">
                        <div class="title_2">
                            <img onclick="retrocede()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" alt="" srcset="" style="width: 30px; cursor:pointer;">
                            <h2 class="text_off">Mantenimientos</h2>
                            <h2 class="text_off">-</h2>
                            <h2 style="font-style: oblique; font-weight: 500;">Usuarios</h2>
                        </div>
                        
                        <div class="user_actions_btn">
                            <div class="btn_style btn_edit" onclick="habilitar_edicion()">
                                <p>Editar</p>
                            </div>
                            <div class="btn_style btn_guardar" onclick="abrir_confirmacion('guardar')">
                                <p>Guardar</p>
                            </div>
                            <div class="btn_style btn_eliminar" onclick="abrir_confirmacion('eliminar')">
                                <p>Eliminar</p>
                            </div>
                        </div>
                    </div>    
                    <div class="content_more">
                        <div class="title_header">
                            <h4 class="input_data_user_extra">***</h4>
                            <p>-</p>
                            <p class="input_data_user_extra">***</p>
                            <p>-</p>
                            <p class="input_data_user_extra">***</p>
                        </div>
                        <div class="more_flex">
                            <div class="more_img_section">
                                <div class="more_img">
                                    <img src="/IMG/user.png" class="view_img">
                                </div>
                                <input type="file" id="file_upload_1" disabled>
                                <label for="file_upload_1" class="upload_label upload_label_1">
                                    Subir imagen
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                                </label>
                            </div>
                            <div class="more_info">
                                <div class="more_header">
                                    <h3>Informacion personal</h3>
                                </div>
                                <div class="more_section">
                                    <div>
                                        <p>Nombres</p>
                                        <input type="text" class="input_data_user" data-depende_red="red_B1" disabled>
                                        <div class="error_text error_box" data-red_text="red_B1">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Apellidos</p>
                                        <input type="text" class="input_data_user" data-depende_red="red_B2" disabled>
                                        <div class="error_text error_box" data-red_text="red_B2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>                                
                                </div>
                                <div class="more_section">
                                    <div>
                                        <p>Documento</p>
                                        <div class="sub_input">
                                            <select class="input_data_user input_data_user_select" data-tipo_documento="tipo_2" disabled>
                                                @foreach ($tbl_tipo_documento as $tipo_documento)
                                                    <option value="{{ $tipo_documento['id'] }}">{{ $tipo_documento['tipo_documento'] }}</option>
                                                @endforeach
                                            </select>
                                            <input type="text" class="input_data_user input_data_user_select_2" data-depende_red="red_B3" data-validar="solonum" data-registro="documento" data-depende="tipo_2" disabled>    
                                        </div>
                                        <div class="error_text error_box" data-red_text="red_B3">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="more_section">
                                    <div>
                                        <p>Celular</p>
                                        <input type="text" class="input_data_user" id="phone_2" data-depende_red="red_B4" data-validar="solonum" data-registro="celular" disabled>
                                        <div class="error_text error_box" data-red_text="red_B4">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Correo</p>
                                        <input type="text" class="input_data_user" data-registro="correo" data-depende_red="red_B5" disabled>
                                        <div class="error_text error_box" data-red_text="red_B5">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="more_header">
                                    <h3>Informacion de usuario</h3>
                                </div>
                                <div class="more_section">
                                    <div>
                                        <p>Usuario</p>
                                        <input type="text" class="input_data_user" data-depende_red="red_B6" data-registro="usuario" disabled>
                                        <div class="error_text error_box" data-red_text="red_B6">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Contraseña</p>
                                        <!-- 
                                        <input type="text" class="input_data_user" data-depende_red="red_B7" disabled>
                                        <div class="error_text error_box" data-red_text="red_B7">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                        -->
                                        <input type="button" value="Restablecer" id="rest_pass" class="input_data_user" onclick="show_reset('block')" disabled>
                                    </div>
                                </div>
                                <div class="more_section">
                                    <div>
                                        <p>Parque</p>
                                        <select class="input_data_user select_data" disabled data-depende_red="red_B8">
                                            @foreach ($tbl_parques as $parques)
                                                <option value="{{ $parques['id'] }}">{{ $parques['nombre_parque'] }}</option>
                                            @endforeach
                                        </select>
                                        <div class="error_text error_box" data-red_text="red_B8">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Rol</p>
                                        <select class="input_data_user" disabled data-depende_red="red_B9">
                                            @foreach ($tbl_permisos_usuarios as $permisos_usuarios)
                                                @if ($permisos_usuarios['posicion'] != 'administrador')
                                                    <option value="{{ $permisos_usuarios['id'] }}">{{ $permisos_usuarios['posicion'] }}</option>
                                                @endif
                                            @endforeach
                                        </select>
                                        <div class="error_text error_box" data-red_text="red_B9">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p>Estado</p>
                                        <select class="input_data_user" data-depende_red="red_B10" disabled>
                                            <option value="activo">Activo</option>
                                            <option value="inactivo">Inactivo</option>
                                        </select>
                                        <div class="error_text error_box" data-red_text="red_B10">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                            <p class="error_mens">---</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </section>

    <div id="myModal" class="modal">
        <div class="modal-content">
            <div class="modal_header">
                <h2>Registro de usuario</h2>
            </div>
            <div class="more_img_section_2">
                <div class="more_img">
                    <img src="/IMG/user.png" class="view_img">
                </div>
                <input type="file" id="file_upload_2">
                <label for="file_upload_2" class="upload_label">
                    Subir imagen
                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                </label>
            </div>
            <div class="modal_contenedor">
                <div class="input_section">
                    <p>Nombres</p>
                    <input type="text" class="input_registro input_data" data-depende_red="red_1">
                    <div class="error_text" data-red_text="red_1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Apellidos</p>
                    <input type="text" class="input_registro input_data" data-depende_red="red_2">
                    <div class="error_text" data-red_text="red_2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Documento</p>
                    <div class="long_input">
                        <select name="opciones_doc" class="long_add input_data" data-tipo_documento="tipo_1">
                            @foreach ($tbl_tipo_documento as $tipo_documento)
                                <option value="{{ $tipo_documento['id'] }}">{{ $tipo_documento['tipo_documento'] }}</option>
                            @endforeach
                        </select>
                        <input type="text" class="long_add input_data" data-validar="solonum" data-registro="documento" data-depende="tipo_1" data-depende_red="red_3">
                    </div>
                    <div class="error_text" data-red_text="red_3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Correo</p>
                    <input type="text" class="input_registro input_data" data-registro="correo" data-depende_red="red_4">
                    <div class="error_text" data-red_text="red_4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Celular</p>
                    <input type="text" class="input_registro input_data" data-validar="solonum" id="phone" data-registro="celular" data-depende_red="red_5">
                    <div class="error_text" data-red_text="red_5">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Usuario</p>
                    <input type="text" class="input_registro input_data" data-depende_red="red_6" data-registro="usuario">
                    <div class="error_text" data-red_text="red_6">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <!-- 
                <div class="input_section">
                    <p>Contraseña</p>
                    <input type="password" class="input_registro input_data" data-depende_red="red_7" data-registro="password" data-password_main="C1">
                    <div class="error_text" data-red_text="red_7">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Confirmar contraseña</p>
                    <input type="password" class="input_registro_2" data-depende_red="red_x7" data-password_extra="C1">
                    <div class="error_text" data-red_text="red_x7">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                -->
                <div class="input_section">
                    <p>Parque</p>
                    <select name="opciones_posicion" class="input_registro input_data" data-depende_red="red_8">
                        @foreach ($tbl_parques as $parques)
                            <option value="{{ $parques['id'] }}">{{ $parques['nombre_parque'] }}</option>
                        @endforeach
                    </select>   
                    <div class="error_text" data-red_text="red_8">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
                <div class="input_section">
                    <p>Rol</p>
                    <select name="opciones_posicion" class="input_registro input_data" data-depende_red="red_9">
                        @foreach ($tbl_permisos_usuarios as $permisos_usuarios)
                            @if ($permisos_usuarios['posicion'] != 'administrador')
                                <option value="{{ $permisos_usuarios['id'] }}">{{ $permisos_usuarios['posicion'] }}</option>
                            @endif
                        @endforeach
                    </select>
                    <div class="error_text" data-red_text="red_9">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                        <p class="error_mens">---</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal()">Cerrar</button>
                <button type="button" class="btn btn-primary" id="guardar-parque" onclick="guardar()">Guardar cambios</button>
            </div>
        </div>
    </div>
    

    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="/IMG/Escudo.svg" class="rounded me-2 toast_svg" alt="...">
            <strong class="me-auto">---</strong>
            <button type="button" class="btn_close_alert" data-bs-dismiss="toast" aria-label="Close" onclick="hide_alert()"></button>
        </div>
        <div class="toast-body">---</div>
    </div>


    <div class="modal_confirmacion">
        <div class="modal_confirmacion_contenido">
            <section class="section_confirmar_save">
                <div class="modal_top">
                    <p>Confirmacion</p>
                </div>
                <div class="modal_mid">
                    <p>¿Esta seguro de que desea proceder?</p>
                </div>
                <div class="modal_bottom">
                    <div class="btn_section_confirmacion">
                        <div class="btn_style btn_rechazar_modal" onclick="cerrar_confirmacion()">
                            Rechazar
                        </div>
                        <div class="btn_style btn_confirmar_modal">
                            Confirmar
                        </div>
                    </div>
                </div>
            </section>
            <section class="section_confirmar_delete">
                <div class="modal_top">
                    <p>Confirmacion de eliminacion</p>
                </div>
                <div class="modal_mid">
                    <p>¿Esta seguro de que desea proceder con esta accion? estos cambios es permanente</p>
                </div>
                <div class="modal_bottom">
                    <div class="btn_section_confirmacion">
                        <div class="btn_style btn_confirmar_modal btn_close_eliminacion" onclick="cerrar_confirmacion()">
                            Rechazar
                        </div>
                        <div class="btn_style btn_rechazar_modal btn_confirmar_eliminacion">
                            Confirmar
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <!-- -->
    <div class="confirmar_reset">
        <div class="reset_main">
            <section>
                <div class="modal_top">
                    <p>¿Esta seguro de que desea continuar?</p>
                </div>
                <div class="modal_mid">
                    <p>Una vez realizado este cambio es irreversible</p>
                </div>
                <div class="modal_bottom footer_section">
                    <div class="btn_section_confirmacion">
                        <div class="btn_style btn_reset_cancelar" onclick="show_reset('none')">
                            <p>Cancelar</p>
                        </div>
                        <div class="btn_style btn_reset_confirmacion" onclick="restablecer_password()">
                            <p>Confirmar</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</body>



<script>
    let local_sesion = @json(session('usuario'));
</script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js" integrity="sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="{{ asset('JS/mantenimientos/M_usuarios.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/Quick/Validadores.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/Quick/R_funcion.js') }}"></script>
<!-- 
<script type="module" src="{{ asset('JS/mantenimientos/modulos/modulo.js') }}"></script>
-->

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
                    responsivePriority: 1,
                    targets: -5
                },
            ]
        });
    });
</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[5].classList.add("categoria-active")
</script>
<script>
        const phoneInputField = document.querySelector("#phone");
        const phoneInput = window.intlTelInput(phoneInputField, {
            initialCountry: "do",
            preferredCountries: ["do","us"],
            utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
        //----------------
        const phoneInputField_2 = document.querySelector("#phone_2");
        const phoneInput_2 = window.intlTelInput(phoneInputField_2, {
            initialCountry: "do",
            preferredCountries: ["do","us"],
            utilsScript:
            "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
        });
</script>
</html>