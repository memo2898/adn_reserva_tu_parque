<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Mantenimiento - Parques</title>

    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/datatable.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/m_parques.css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/modal_estructura.css') }}" >


    <script src="{{ asset('JS/peticiones.js') }}"></script>

    <!-- LIBRERIAS EXTERNAS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <!-- DATATABLE -->
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.4/css/jquery.dataTables.css" />
    <script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.js"></script>
    <!-- DATATABLE-responsive -->
    <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.5.0/css/responsive.bootstrap.css">
    <script src="https://cdn.datatables.net/responsive/2.5.0/js/dataTables.responsive.js"></script>
    <!-- LIBRERIA PARA CELULARES -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"/>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>

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
                <section class="sect_1">
                    <div class="title">
                        <h2>Mantenimientos</h2>
                        <h2>-</h2>
                        <h2 style="font-style: oblique; font-weight: 500;">Parques</h2>
                    </div>
                    <div class="section_botones" style="margin-bottom: 1rem">
                        <div class="btn_style parque_creacion" onclick="view_modal_2()">
                            <p>Agregar nuevo parque</p>
                        </div>
                    </div>
                    <div class="datatable">
                        <table class="table_maps display responsive" id="myTable">
                            <thead class="display-head">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Correo</th>
                                    <th>Provincia</th>
                                    <th>Circunscripcion</th>
                                    <th>Estado</th>
                                    <th>Mas detalles</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($tbl_parques as $parques)
                                <tr>
                                    <td>{{ $parques['nombre_parque'] }}</td>
                                    <td>{{ $parques['correo'] }}</td>
                                    <td>{{ $parques['provincia'] }}</td>
                                    <td>{{ $parques['circunscripcion'] }}</td>
                                    <td>{{ $parques['estado'] }}</td>
                                    <td style="text-align: -webkit-center;"><img src="/IMG/pen-solid.svg" onclick="view_more({{ $parques['id'] }})"></td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                </section>
                <!-- ========================================= -->
                <section class="sect_2">
                    <!-- 
                        HEADER + BOTON PARA RETROCEDER
                    -->
                    <div class="title" style="margin-bottom: 0.4rem"> 
                        <div class="title_2">
                            <img onclick="retroceder()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" alt="" srcset="">
                            <h2>Mantenimientos</h2>
                            <h2 class="text_blank">-</h2>
                            <h2 class="text_blank" style="font-style: oblique; font-weight: 500;">Parques</h2>
                        </div>
                        <div class="section_botones parques_botones">
                            <div class="btn_style parque_eliminar" onclick="open_confirm('parque','eliminar')">
                                <p>Eliminar</p>
                            </div>
                            <div class="btn_style parque_edicion" onclick="activar_edicion('parque')">
                                <p>Editar</p>
                            </div>
                            <div class="btn_style parque_guardar" onclick="open_confirm('parque','guardar')">
                                <p>Guardar</p>
                            </div>
                            <div>
                                <select class="Select_estado_parque" disabled>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="info_parque">
                        <!-- 
                            HEADER CON EL NOMBRE DEL PARQUE
                        -->
                        <div class="info_header">
                            <h3>---</h3>
                        </div>
                        <div class="info_2">
                            <div class="info_section_1">
                                <div class="img_box">
                                    <img  src="" class="parque_img">
                                </div>
                                <div class="btn_img_posicion">
                                    <input type="file" class="edit_img" id="edit_file_img_1" disabled>
                                    <label for="edit_file_img_1" class="custom-file-upload_1">
                                        Subir imagen
                                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg>
                                    </label>
                                </div>
                                <div>
                                    <div class="custom_label" onclick="mod_terminos_condiciones('block')">
                                        Terminos y condiciones
                                    </div>
                                </div>
                                <!-- ===================================================== -->
                                <div class="calendar">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Dia</th>
                                                <th>Horario de apertura</th>
                                                <th>Horario de cierre</th>
                                                <th>No laborable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>Lunes</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Martes</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Miercoles</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Jueves</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Viernes</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Sabado</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Domingo</th>
                                                <th>
                                                    <select name="parque_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="parque_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- ===================================================== -->
                            </div>
                            <div class="info_section_2">
                                <div class="info_seccion">
                                    <p>Nombre del parque</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A1" disabled>
                                    <div class="error_text" data-red_text="red_A1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Correo</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A2" data-registro="correo" disabled>
                                    <div class="error_text" data-red_text="red_A2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Telefono</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A3" data-validar="solonum" id="phone_2" data-registro="celular" disabled>
                                    <div class="error_text" data-red_text="red_A3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Provincia</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A4" disabled>
                                    <div class="error_text" data-red_text="red_A4">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Municipio</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A5" disabled>
                                    <div class="error_text" data-red_text="red_A5">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Sector</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A6" disabled>
                                    <div class="error_text" data-red_text="red_A6">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Circunscripcion</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A7" disabled>
                                    <div class="error_text" data-red_text="red_A7">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Direccion</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A8" disabled>
                                    <div class="error_text" data-red_text="red_A8">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Dias de espera</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A9" data-validar="solonum" disabled>
                                    <div class="error_text" data-red_text="red_A9">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Coordenadas Maps.</p>
                                    <input type="text" class="parque_input" data-depende_red="red_A10" disabled>
                                    <div class="error_text" data-red_text="red_A10">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Descripcion</p>
                                    <textarea cols="30" rows="10" class="parque_input" data-depende_red="red_A11" disabled></textarea>
                                    <div class="error_text" data-red_text="red_A11">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="info_zonas">
                        <div class="info_header_zonas">
                            <h3>Gazebos</h3>
                            <div class="btn_position">
                                <div class="btn_style btn_agregar_zona" onclick="view_modal()">
                                    <p>Agregar</p>
                                </div>
                            </div>
                        </div>
                        <div class="display_zonas"> <!-- RECORDAR QUE ESTO DEBE SER GENERADO POR MEDIO DE UN CODIGO JS AL REALIZAR UN GET A ZONAS -->
                            <!-- AQUI VA TODA LA INFORMACION RESPECTO A LA INFORMACION DE LAS ZONAS -->
                        </div>
                    </div>
                </section>
                <!-- 
                    =========================================================================
                -->
                <section class="sect_3">
                    <div class="title title_3">
                        <div class="title_2">
                            <img onclick="retroceder_2()" class="flecha_atras atras" src="/IMG/new/iconos/SVG/flecha_izq.svg" alt="" srcset="">
                            <h2>Mantenimientos **</h2>
                            <h2 class="title_blank">-</h2>
                            <h2 class="title_blank" style="font-style: oblique; font-weight: 500;">Parques</h2>
                            <h2 class="title_blank">-</h2>
                            <h2 class="title_blank" style="font-style: oblique; font-weight: 500;">Zonas</h2>
                        </div>
                        <div class="section_botones zona_botones">
                            <div class="btn_style zona_eliminar" onclick="open_confirm('zona','eliminar')">
                                <p>Eliminar</p>
                            </div>
                            <div class="btn_style zona_edicion" onclick="activar_edicion('zona')">
                                <p>Editar</p>
                            </div>
                            <div class="btn_style zona_guardar" onclick="open_confirm('zona','guardar')">
                                <p>Guardar</p>
                            </div>
                            <div>
                                <select class="Select_estado_zona" disabled>
                                    <option value="activo">Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="info_zonas">
                        <div class="info_header_2">
                            <h3>---</h3>
                        </div>
                        <div class="info_2">
                            <div class="info_section_1">
                                <div class="img_box">
                                    <img  src="" class="zona_img">
                                </div>
                                <input type="file" class="edit_img" id="edit_file_img_2" disabled>
                                <label for="edit_file_img_2" class="custom-file-upload_2">
                                    Subir imagen
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                                </label>

                                <!-- ===================================================== -->
                                <div class="calendar"> 
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Dia</th>
                                                <th>Horario de apertura</th>
                                                <th>Horario de cierre</th>
                                                <th>No laborable</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th>Lunes</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Martes</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Miercoles</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Jueves</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Viernes</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Sabado</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                            <tr>
                                                <th>Domingo</th>
                                                <th>
                                                    <select name="zona_horarios_start" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th>
                                                    <select name="zona_horarios_end" disabled>
                                                        <!-- CONTENIDO -->
                                                    </select>
                                                </th>
                                                <th><input type="checkbox" name="" id="" disabled></th>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <!-- ===================================================== -->
                            </div>
                            <div class="info_section_2">
                                <div class="info_seccion">
                                    <p>Nombre</p>
                                    <input type="text" class="zona_input" data-depende_red="red_B1" disabled>
                                    <div class="error_text" data-red_text="red_B1">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Direccion</p>
                                    <input type="text" class="zona_input" data-depende_red="red_B2" disabled>
                                    <div class="error_text" data-red_text="red_B2">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                                <div class="info_seccion">
                                    <p>Coordenadas maps</p>
                                    <input type="text" class="zona_input" data-depende_red="red_B3" disabled>
                                    <div class="error_text" data-red_text="red_B3">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                        <p class="error_mens">---</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
                <!-- ========================================= -->
            </div>
        </div>
    </section>

    <!-- ================================================================== -->
    <div id="myModal" class="modal">
        <div class="modal-content">
            <span onclick="closeModal()" style="float: right; cursor: pointer;">&times;</span>
            <div class="modal_header">
                <h2>Registro de zona</h2>
            </div>
            <div class="modal_step">
                <div class="image_preview">
                    <img class="previewimg" id="previewImage_1" src="/IMG/parque_default.avif" alt="Vista previa de la imagen" />
                </div>
                <div class="input_section">
                    <input type="file" class="input_img" id="fileInput_1" style="display: none">
                    <label for="fileInput_1" class="custom-file-upload_4">
                        Subir imagen
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                    </label>
                </div>
            </div>
            <div class="modal_contenedor">
                <div class="modal_step">
                    <div class="input_section">
                        <p>Nombre</p>
                        <input type="text" class="input_registro input_data" data-depende_red="red_C1">
                        <div class="error_text" data-red_text="red_C1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            <p class="error_mens">---</p>
                        </div>
                    </div>
                    <div class="input_section">
                        <p>Direccion</p>
                        <input type="text" class="input_registro input_data" data-depende_red="red_C2">
                        <div class="error_text" data-red_text="red_C2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            <p class="error_mens">---</p>
                        </div>
                    </div>
                    <div class="input_section">
                        <p>Coordenadas</p>
                        <input type="text" class="input_registro input_data" data-depende_red="red_C3">
                        <div class="error_text" data-red_text="red_C3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            <p class="error_mens">---</p>
                        </div>
                    </div>
                </div>
                <div class="modal_step">
                    <table class="date_register">
                        <thead>
                            <tr>
                                <th>Dia</th>
                                <th>Desde</th>
                                <th>Hasta</th>
                            </tr>
                        </thead>
                        <tbody class="modal_display">
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal" onclick="closeModal()">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="crear_zona('zona')">Guardar cambios</button>
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



    <div id="mymodal_2" class="modal_2">
        <div class="modal_2-content">
            <div class="modal_2_header">
                <h2>Registro de parque</h2>
                <!--
                <div class="btn_section_registro_parque">
                    <div class="btn_style btn_next_step" onclick="modal_2_replace('siguiente')">
                        <p>Continuar</p>
                    </div>
                    <div class="btn_style btn_next_step" onclick="modal_2_replace('anterior')" style="display: none">
                        <p>Retroceder</p>
                    </div>
                </div>
                -->
            </div>
            <section class="parque_registro_step_1">
                <div class="modal_2_step">
                    <div class="image_preview">
                        <img class="previewimg" id="previewImage_2" src="/IMG/parque_default.avif" alt="Vista previa de la imagen" />
                    </div>
                    <div class="input_section_2">
                        <input type="file" class="input_img" id="fileInput_2" style="display: none">
                        <label for="fileInput_2" class="custom-file-upload_3">
                            Subir imagen
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"></path></svg>
                        </label>
                    </div>
                </div>
                <div class="modal_2_contenedor">
                    <div class="modal_2_step">
                        <div class="input_section_2">
                            <p>Nombre del parque</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_1">
                            <div class="error_text" data-red_text="red_1">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>correo</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-registro="correo" data-depende_red="red_2">
                            <div class="error_text" data-red_text="red_2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Telefono</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-validar="solonum" id="phone" data-registro="celular" data-depende_red="red_3">
                            <div class="error_text" data-red_text="red_3">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Provincia</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_4">
                            <div class="error_text" data-red_text="red_4">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Municipio</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_5">
                            <div class="error_text" data-red_text="red_5">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Sector</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_6">
                            <div class="error_text" data-red_text="red_6">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Circunscripcion</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_7">
                            <div class="error_text" data-red_text="red_7">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Direccion</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_8">
                            <div class="error_text" data-red_text="red_8">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Dias de espera</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_9" data-validar="solonum">
                            <div class="error_text" data-red_text="red_9">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Coordenadas maps</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_10">
                            <div class="error_text" data-red_text="red_10">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                        <div class="input_section_2">
                            <p>Descripcion</p>
                            <input type="text" class="input_registro_2 input_data_parque" data-depende_red="red_11">
                            <div class="error_text" data-red_text="red_11">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                                <p class="error_mens">---</p>
                            </div>
                        </div>
                    </div>  
                    <div class="modal_step">
                        <table class="date_register">
                            <thead>
                                <tr>
                                    <th>Dia</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                </tr>
                            </thead>
                            <tbody class="modal_display">
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            <section class="parque_registro_step_2">
                
                <div class="modal_step">
                    <div class="image_preview">
                        <img class="previewimg" id="previewImage_3" src="/IMG/parque_default.avif" alt="Vista previa de la imagen" />
                    </div>
                    <div class="input_section">
                        <input type="file" class="input_img" id="fileInput_3">
                    </div>
                </div>
                <div class="modal_contenedor">
                    <div class="modal_step">
                        <div class="input_section">
                            <p>Nombre</p>
                            <input type="text" class="input_registro input_data_zona">
                        </div>
                        <div class="input_section">
                            <p>Direccion</p>
                            <input type="text" class="input_registro input_data_zona">
                        </div>
                        <div class="input_section">
                            <p>Coordenadas</p>
                            <input type="text" class="input_registro input_data_zona">
                        </div>
                    </div>
                    <div class="modal_step">
                        <table class="date_register">
                            <thead>
                                <tr>
                                    <th>Dia</th>
                                    <th>Desde</th>
                                    <th>Hasta</th>
                                </tr>
                            </thead>
                            <tbody class="modal_display">
                            </tbody>
                        </table>
                    </div>
            </section>
            <div class="modal_2-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal_2" onclick="closemodal_2()">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="crear_parque('parque')">Guardar cambios</button>
            </div>
        </div>
    </div>


    <div class="modal_confirmacion">
        <div class="modal_confirmacion_contenido">
            <div class="modal_top">
                <p>Confirmacion</p>
            </div>
            <div class="modal_mid">
                <p>¿Esta seguro de que desea proceder?</p>
            </div>
            <div class="modal_bottom">
                <div class="btn_section_confirmacion">
                    <div class="btn_style btn_rechazar_modal" onclick="close_confirm()">
                        Rechazar
                    </div>
                    <div class="btn_style btn_confirmar_modal">
                        Confirmar
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="modal_window modal_term_condicion">
        <div class="modal_page">
            <section>
                <div class="modal_top">
                    <p>Terminos y condiciones de uso</p>
                </div>
                <div class="modal_mid">
                    <div class="box_text">
                        <textarea id="terminos_condiciones" data-depende_red="red_T1"></textarea>
                        <div class="error_text" data-red_text="red_T1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>
                            <p class="error_mens">---</p>
                        </div>
                    </div>
                </div>
                <div class="modal_bottom footer_section">
                    <div class="btn_section_confirmacion">
                        <div class="btn_style btn_red_style" data-btn_accion="cerrar">
                            <p>Cerrar</p>
                        </div>
                        <div class="btn_style btn_blue_style" data-btn_accion="guardar">
                            <p>Guardar</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</body>



<script src="{{ asset('JS/mantenimientos/Quick/R_funcion.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/Quick/Validadores.js') }}"></script>
<script>
    let local_sesion = @json(session('usuario'));
</script>
<script>
    $(document).ready(function() {
        let table = $('#myTable').DataTable({
            responsive: true,
            columnDefs: [
                {
                    responsivePriority: 1,
                    targets: -6
                },
                {
                    responsivePriority: 2,
                    targets: -1
                },
            ]
        });
    });
</script>
<script src="{{ asset('JS/mantenimientos/M_pruebas.js') }}"></script>
<script src="{{ asset('JS/mantenimientos/M_parques.js') }}"></script>
<script>
    document.querySelectorAll(".cont-items-categorias")[4].classList.add("categoria-active")
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