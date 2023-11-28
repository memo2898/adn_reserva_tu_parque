//let AB = await visualizar()
/*
(async function(){
    let AB = await visualizar()
})
*/

//console.log(local_sesion)

window.addEventListener('resize',function(){
    if (window.outerWidth > 500 && document.querySelector('.menu-side-bar').classList.contains('menu-side-bar_modal')) {
        console.log("Eliminar propiedad")
        document.querySelector('.menu-side-bar').classList.remove('menu-side-bar_modal')
    }
})

function bar_display(){
    document.querySelector('.menu-side-bar').classList.add('menu-side-bar_modal')
}
function bar_hide(){
    document.querySelector('.menu-side-bar').classList.remove('menu-side-bar_modal')
}


let img = null
if ( local_sesion['imagen'] != 'default' && local_sesion['imagen'] != null) {
    img = local_sesion['imagen']
}else{
    img = '/IMG/user.png'
}

let menu=`  <!--Menu incrustado aqui desde el JS start-->
<!--Bloque de info usuarios start-->
<!-- <a href="/configuraciones_usuario"> -->
    <div class="info-user-principal">
        <!--Img user start-->
            <div class="cont-p-img-user">
                <div class="cont-h-img-user">
                    <div class="cont-im-user">
                        <img src="${img}" alt="" class="img-user">
                    </div>
                </div>
            </div>
        <!--Img user end-->
        <!--Datos del usuario en cabecera start-->
            <div class="user-data-header">
                <h3 class="user-name-header">${local_sesion['nombre']} ${local_sesion['apellido']}</h3>
                <span class="other-details-user-header">${local_sesion['nombre_parque']}</span>
                <span class="other-details-user-header">${local_sesion['rol']}</span>
            </div>
        <!--Datos del usuario en cabecera end -->
    </div>
<!-- </a> -->
    <!-- ICONO CLOSE-MODAL -->
    <div class="modal_exit_content" onclick='bar_hide()'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class='modal_exit'><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
    </div>
<!--Bloque de info usuarios end-->

<!--Categorias de Menu start-->
<div class="categorias-menu">


    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior"></span>
        <a href="/inicio">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/home.svg">
                <span class="nombre-categoria">Inicio</span>
            </div>
        </a>
    </div>
    <!--Categoria end-->

    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior">Reservaciones</span>
        <!--Item categoria Start-->
        <a href="/R_solicitudes">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/solicitudes.svg">
                <span class="nombre-categoria">Solicitudes</span>
            </div>
        </a>
        <!--Item categoria End-->
        <!--Item categoria Start-->
        <a href="/R_reservaciones">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/reservaciones.svg">
                <span class="nombre-categoria">Reservaciones</span>
            </div>
        </a>
        <!--Item categoria End-->
        <!--Item categoria Start-->
        <a href="/R_espera">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/espera.svg">
                <span class="nombre-categoria">En espera</span>
            </div>
        </a>
        <!--Item categoria End-->
    </div>
    <!--Categoria end-->
    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior">Mantenimientos</span>
        <!--Item categoria Start-->
        <a href="/mantenimientos_parques">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/parques.svg">
                <span class="nombre-categoria">Parques</span>
            </div>
        </a>
        <!--Item categoria End-->
        <!--Item categoria Start-->
        <a href="/mantenimientos_usuarios">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/users.svg">
                <span class="nombre-categoria">Usuarios</span>
            </div>
        </a>
        <!--Item categoria End-->
        <!--Item categoria Start-->
        <a href="/mantenimientos_eventos">
            <div class="cont-items-categorias">
                <!--
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/parques.svg">
                -->
                <svg xmlns="http://www.w3.org/2000/svg" class="ico-categoria" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M86.4 5.5L61.8 47.6C58 54.1 56 61.6 56 69.2V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L105.6 5.5C103.6 2.1 100 0 96 0s-7.6 2.1-9.6 5.5zm128 0L189.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L233.6 5.5C231.6 2.1 228 0 224 0s-7.6 2.1-9.6 5.5zM317.8 47.6c-3.8 6.5-5.8 14-5.8 21.6V72c0 22.1 17.9 40 40 40s40-17.9 40-40V69.2c0-7.6-2-15-5.8-21.6L361.6 5.5C359.6 2.1 356 0 352 0s-7.6 2.1-9.6 5.5L317.8 47.6zM128 176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48c-35.3 0-64 28.7-64 64v71c8.3 5.2 18.1 9 28.8 9c13.5 0 27.2-6.1 38.4-13.4c5.4-3.5 9.9-7.1 13-9.7c1.5-1.3 2.7-2.4 3.5-3.1c.4-.4 .7-.6 .8-.8l.1-.1 0 0 0 0s0 0 0 0s0 0 0 0c3.1-3.2 7.4-4.9 11.9-4.8s8.6 2.1 11.6 5.4l0 0 0 0 .1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c3-3.5 7.4-5.4 12-5.4s9 2 12 5.4l.1 .1c.1 .1 .4 .4 .7 .7c.7 .7 1.7 1.7 3.1 3c2.8 2.6 6.8 6.1 11.8 9.5c10.2 7.1 23 13.1 36.3 13.1s26.1-6 36.3-13.1c5-3.5 9-6.9 11.8-9.5c1.4-1.3 2.4-2.3 3.1-3c.3-.3 .6-.6 .7-.7l.1-.1c2.9-3.4 7.1-5.3 11.6-5.4s8.7 1.6 11.9 4.8l0 0 0 0 0 0 .1 .1c.2 .2 .4 .4 .8 .8c.8 .7 1.9 1.8 3.5 3.1c3.1 2.6 7.5 6.2 13 9.7c11.2 7.3 24.9 13.4 38.4 13.4c10.7 0 20.5-3.9 28.8-9V288c0-35.3-28.7-64-64-64V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H256V176c0-17.7-14.3-32-32-32s-32 14.3-32 32v48H128V176zM448 394.6c-8.5 3.3-18.2 5.4-28.8 5.4c-22.5 0-42.4-9.9-55.8-18.6c-4.1-2.7-7.8-5.4-10.9-7.8c-2.8 2.4-6.1 5-9.8 7.5C329.8 390 310.6 400 288 400s-41.8-10-54.6-18.9c-3.5-2.4-6.7-4.9-9.4-7.2c-2.7 2.3-5.9 4.7-9.4 7.2C201.8 390 182.6 400 160 400s-41.8-10-54.6-18.9c-3.7-2.6-7-5.2-9.8-7.5c-3.1 2.4-6.8 5.1-10.9 7.8C71.2 390.1 51.3 400 28.8 400c-10.6 0-20.3-2.2-28.8-5.4V480c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32V394.6z"/></svg>
                <span class="nombre-categoria">Eventos</span>
            </div>
        </a>
        <!--Item categoria End-->

        <!--Item categoria Start-->
        <a href="/mantenimiento_roles">
            <div class="cont-items-categorias">
                <!-- <img class="ico-categoria" src="/IMG/new/iconos/SVG/users.svg"> -->
                <svg xmlns="http://www.w3.org/2000/svg" class="ico-categoria" viewBox="0 0 640 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M144 160A80 80 0 1 0 144 0a80 80 0 1 0 0 160zm368 0A80 80 0 1 0 512 0a80 80 0 1 0 0 160zM0 298.7C0 310.4 9.6 320 21.3 320H234.7c.2 0 .4 0 .7 0c-26.6-23.5-43.3-57.8-43.3-96c0-7.6 .7-15 1.9-22.3c-13.6-6.3-28.7-9.7-44.6-9.7H106.7C47.8 192 0 239.8 0 298.7zM320 320c24 0 45.9-8.8 62.7-23.3c2.5-3.7 5.2-7.3 8-10.7c2.7-3.3 5.7-6.1 9-8.3C410 262.3 416 243.9 416 224c0-53-43-96-96-96s-96 43-96 96s43 96 96 96zm65.4 60.2c-10.3-5.9-18.1-16.2-20.8-28.2H261.3C187.7 352 128 411.7 128 485.3c0 14.7 11.9 26.7 26.7 26.7H455.2c-2.1-5.2-3.2-10.9-3.2-16.4v-3c-1.3-.7-2.7-1.5-4-2.3l-2.6 1.5c-16.8 9.7-40.5 8-54.7-9.7c-4.5-5.6-8.6-11.5-12.4-17.6l-.1-.2-.1-.2-2.4-4.1-.1-.2-.1-.2c-3.4-6.2-6.4-12.6-9-19.3c-8.2-21.2 2.2-42.6 19-52.3l2.7-1.5c0-.8 0-1.5 0-2.3s0-1.5 0-2.3l-2.7-1.5zM533.3 192H490.7c-15.9 0-31 3.5-44.6 9.7c1.3 7.2 1.9 14.7 1.9 22.3c0 17.4-3.5 33.9-9.7 49c2.5 .9 4.9 2 7.1 3.3l2.6 1.5c1.3-.8 2.6-1.6 4-2.3v-3c0-19.4 13.3-39.1 35.8-42.6c7.9-1.2 16-1.9 24.2-1.9s16.3 .6 24.2 1.9c22.5 3.5 35.8 23.2 35.8 42.6v3c1.3 .7 2.7 1.5 4 2.3l2.6-1.5c16.8-9.7 40.5-8 54.7 9.7c2.3 2.8 4.5 5.8 6.6 8.7c-2.1-57.1-49-102.7-106.6-102.7zm91.3 163.9c6.3-3.6 9.5-11.1 6.8-18c-2.1-5.5-4.6-10.8-7.4-15.9l-2.3-4c-3.1-5.1-6.5-9.9-10.2-14.5c-4.6-5.7-12.7-6.7-19-3L574.4 311c-8.9-7.6-19.1-13.6-30.4-17.6v-21c0-7.3-4.9-13.8-12.1-14.9c-6.5-1-13.1-1.5-19.9-1.5s-13.4 .5-19.9 1.5c-7.2 1.1-12.1 7.6-12.1 14.9v21c-11.2 4-21.5 10-30.4 17.6l-18.2-10.5c-6.3-3.6-14.4-2.6-19 3c-3.7 4.6-7.1 9.5-10.2 14.6l-2.3 3.9c-2.8 5.1-5.3 10.4-7.4 15.9c-2.6 6.8 .5 14.3 6.8 17.9l18.2 10.5c-1 5.7-1.6 11.6-1.6 17.6s.6 11.9 1.6 17.5l-18.2 10.5c-6.3 3.6-9.5 11.1-6.8 17.9c2.1 5.5 4.6 10.7 7.4 15.8l2.4 4.1c3 5.1 6.4 9.9 10.1 14.5c4.6 5.7 12.7 6.7 19 3L449.6 457c8.9 7.6 19.2 13.6 30.4 17.6v21c0 7.3 4.9 13.8 12.1 14.9c6.5 1 13.1 1.5 19.9 1.5s13.4-.5 19.9-1.5c7.2-1.1 12.1-7.6 12.1-14.9v-21c11.2-4 21.5-10 30.4-17.6l18.2 10.5c6.3 3.6 14.4 2.6 19-3c3.7-4.6 7.1-9.4 10.1-14.5l2.4-4.2c2.8-5.1 5.3-10.3 7.4-15.8c2.6-6.8-.5-14.3-6.8-17.9l-18.2-10.5c1-5.7 1.6-11.6 1.6-17.5s-.6-11.9-1.6-17.6l18.2-10.5zM472 384a40 40 0 1 1 80 0 40 40 0 1 1 -80 0z"/></svg>
                <span class="nombre-categoria">Roles</span>
            </div>
        </a>
        <!--Item categoria End-->

        <!--Item categoria Start-->
        <a href="/mantenimientos_documentos">
            <div class="cont-items-categorias">
                <!-- 
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/parques.svg">
                -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="ico-categoria"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><style>svg{fill:#ffffff}</style><path d="M512 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H512zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM208 256a64 64 0 1 0 0-128 64 64 0 1 0 0 128zm-32 32c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H304c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H176zM376 144c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24h80c13.3 0 24-10.7 24-24s-10.7-24-24-24H376z"/></svg>
                <span class="nombre-categoria">Tipos de documento</span>
            </div>
        </a>
        <!--Item categoria End-->


    </div>
    <!--Categoria end-->
    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior">Configuraciones</span>
        <!--Item categoria Start-->
        <a href="/configuraciones_usuario">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/user.svg">
                <span class="nombre-categoria">Mi usuario</span>
            </div>
        </a>
        <!--Item categoria End-->
   
       
    </div>
    <!--Categoria end-->
    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior">Reportes</span>
        <!--Item categoria Start-->
        <a href="/reportes">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/file.svg">
                <span class="nombre-categoria">Reporte</span>
            </div>
        </a>
        <!--Item categoria End-->
   
       
    </div>
    <!--Categoria end-->

    <!--Categoria start-->
    <div class="categoria-menu">
        <span class="nombre-categoria-superior">Estadísticas</span>
        <!--Item categoria Start-->
        <a href="/estadisticas">
            <div class="cont-items-categorias">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/bars.svg">
                <span class="nombre-categoria">Estadistica</span>
            </div>
        </a>

        <!--Item categoria End-->
   
       
    </div>
    <!--Categoria end-->

</div>

<!--Categorias de Menu end-->

<!--Categoria de Menu Logout start-->
<div class="logut-categoria">
     <!--Categoria start-->
     <div class="categoria-menu-log">
        <span class="nombre-categoria-superior"></span>
        <!--Item categoria Start-->
        <a href="/return">
            <div class="cont-items-categorias categoria-active-alternative">
                <img class="ico-categoria" src="/IMG/new/iconos/SVG/salir.svg">
                <span class="nombre-categoria">Cerrar Sesión</span>
            </div>
        </a>

        <!--Item categoria End-->
   
       
    </div>
    <!--Categoria end-->
</div>
<!--Categoria de Menu Logout end-->


<!--Menu incrustado aqui desde el JS end-->
`;

document.querySelector(".menu-side-bar").innerHTML=menu;

