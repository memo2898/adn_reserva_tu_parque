<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>modal</title>

    <link rel="stylesheet" href="{{asset('CSS/modal_estructura.css')}}">

    <link rel="stylesheet" href="{{ asset('CSS/esquema(HOME).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/esquema(MAIN).css') }}" >
    <link rel="stylesheet" href="{{ asset('CSS/new/m_parques.css') }}" >

</head>
<body class="Home">
    <div id="mymodal_2" class="modal_2">
        <div class="modal_2-content">
            <div class="modal_2_header">
                <h2>Registro de parque</h2>
                <div class="btn_section_registro_parque">
                    <div class="btn_style btn_next_step">
                        <p>Continuar</p>
                    </div>
                </div>
            </div>
            <section class="parque_registro_step_1">
                <div class="modal_2_step">
                    <div class="image_preview">
                        <img id="previewImage_2" src="/IMG/tree-solid.svg" alt="Vista previa de la imagen" />
                    </div>
                    <div class="input_section_2">
                        <input type="file" class="input_img" id="fileInput">
                    </div>
                </div>
                <div class="modal_2_contenedor">
                    <div class="modal_2_step">
                        <div class="input_section_2">
                            <p>Nombre del parque</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>correo</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Tiempo de espera</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Provincia</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Municipio</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Sector</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Circunscripcion</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Direccion</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Coordenadas_maps</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                        <div class="input_section_2">
                            <p>Descripcion</p>
                            <input type="text" class="input_registro_2 input_data_parque">
                        </div>
                    </div>  
                </div>
            </section>
            <section class="parque_registro_step_2">
                <p>contenido</p>
            </section>
            <div class="modal_2-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal_2" onclick="closemodal_2()">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="crear_zona()">Guardar cambios</button>
            </div>
        </div>
    </div>

    <!-- -->
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

</body>
</html>