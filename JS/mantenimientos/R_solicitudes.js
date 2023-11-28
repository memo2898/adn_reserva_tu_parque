let check = false


async function btn_actions(id,accion,origen){
    let token = await visualizar()
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar' || token['permisos'] == 'autorizar') {
        console.log('Permitir')
        ready()
    }else{
        console.log('No permitir')
        Throw_alert('Accion denegada','Su usuario no cuenta con los permisos necesarios')
    }
    async function ready(){
        let btn_verde = document.querySelector('.verde_'+id)
        let btn_rojo = document.querySelector('.rojo_'+id)
        let ruta = '/Reservacion_parques_solicitudes'
        var tabla = $('#myTable').DataTable();
        //-------------------------------------
        btn_verde.removeAttribute('onclick')
        btn_rojo.removeAttribute('onclick')
        check = false
        if(origen == 'interno'){
            retroceder()
        }
        data = {
            'id':id,
            'accion':accion,
            'responsable':local_sesion['usuario'],
        }
        try {
            if (accion == 'confirmada') {
                let respuesta = await Patch(ruta,data)
                if (respuesta['message'] == 'Actualizado') {
                    //console.log("Actualizacion exitosa")
                    trigger_email(id) // ENVIAR CORREO ELECTRONICO
                    //---------------------------
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    //---------------------------
                    Throw_alert(accion,'Se ha confirmado la solicitud')
                    //tabla.row($((document.querySelector(".solicitud_"+id)))).remove().draw();
                    Actualizar_tabla()
                }else{
                    //console.log("Error inesperado")
                    //---------------------------
                    btn_verde.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    btn_rojo.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    Throw_alert('Error','Se ha producido un error inesperado durante la actualizacion')
                }
            }
            else if(accion == 'rechazada'){
                let respuesta = await Patch(ruta,data)
                if (respuesta['message'] == 'Actualizado') {
                    //console.log("Actualizacion exitosa")
                    trigger_email(id)
                    //---------------------------
                    document.querySelector(".solicitud_"+id).classList.add("table_next") //--  ANIMACION DE DESPLAZAMIENTO
                    await new Promise((resolve) => setTimeout(resolve, 5));
                    //---------------------------
                    
                    Throw_alert(accion,'Se ha rechazado la solicitud')
                    //tabla.row($((document.querySelector(".solicitud_"+id)))).remove().draw();
                    Actualizar_tabla()
                }else{
                    console.log("Error inesperado")
                    //---------------------------
                    btn_verde.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    btn_rojo.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    Throw_alert('Error','Se ha producido un error inesperado durante la actualizacion')
                }
            }else{
                console.log('¿...?')
            }
        } catch (error) {
            console.log('Error inesperado')
            btn_verde.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
            btn_rojo.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
        }
    }
}



async function trigger_email(id_reservacion){
    let ruta = '/enviar-correo_confirmacion'
    let body={
        id:id_reservacion
    }
    let respuesta = await Post(ruta,body)
    //console.log(respuesta)
}



function Throw_alert(estado,mensaje){
    document.querySelector(".me-auto").innerText = 'Actualizacion - '+estado //TITULO
    document.querySelector(".toast-body").innerText = mensaje //INFORMACION DE LA ALERTA
    document.querySelector(".toast").style.display = 'block'
    setTimeout(function() {
        check = true
    }, 1000);
}

function hide_alert(){
    document.querySelector(".toast").style.display = 'none'
}

document.addEventListener("click", function(event) {
    const toastContainer = document.querySelector(".toast");
    const isClickedInsideToast = toastContainer.contains(event.target);
    if (!isClickedInsideToast) {
        if (check == true) {
            document.querySelector('.toast').style.display = 'none'
        }
    }
});


async function view_more(id){
    let detalles = document.querySelectorAll(".input_reservacion")
    let detalles_img = document.querySelectorAll(".img_text")
    let img = document.querySelectorAll(".parque_img")
    let ruta = '/Reservaciones_preciso/'+id
    let respuesta = await Get(ruta)
    console.log(respuesta)
    //----------------------------------------
    detalles_img[0].innerText = respuesta[0]['nombre_parque']
    detalles_img[1].innerText = respuesta[0]['direccion_parque']
    img[0].src = respuesta[0]['parque_img']
    detalles_img[2].innerText = respuesta[0]['nombre_zona']
    detalles_img[3].innerText = respuesta[0]['direccion_zona']
    img[1].src = respuesta[0]['zona_img']
    //----------------------------------------
    detalles[0].innerText = respuesta[0]['usuario_info']['nombres']
    detalles[1].innerText = respuesta[0]['usuario_info']['apellidos']
    detalles[2].innerText = respuesta[0]['usuario_info']['documento']
    detalles[3].innerText = respuesta[0]['usuario_info']['correo']
    detalles[4].innerText = respuesta[0]['usuario_info']['celular']
    //----------------------------------------
    detalles[5].innerText = respuesta[0]['fecha_evento']
    detalles[6].innerText = respuesta[0]['hora_inicio']
    detalles[7].innerText = respuesta[0]['hora_fin']
    detalles[8].innerText = respuesta[0]['nombre_evento']
    detalles[9].innerText = respuesta[0]['cantidad_participantes_adultos']
    detalles[10].innerText = respuesta[0]['cantidad_participantes_ninos']
    detalles[11].innerText = respuesta[0]['descripcion_evento']
    //----------------------------------------
    document.querySelector(".boton_aceptar").attributes['onclick'].nodeValue = 'pantalla_confirmacion('+ respuesta[0]['id'] +', "confirmada", "interno")'
    document.querySelector(".boton_rechazar").attributes['onclick'].nodeValue = 'pantalla_confirmacion('+ respuesta[0]['id'] +', "rechazada", "interno")'
    document.querySelector(".cuerpo-pagina").style.display='none'
    document.querySelector(".cuerpo-extra").style.display='block'
}

async function limpiar_parques(){
    let detalles = document.querySelectorAll(".input_reservacion")
    let detalles_img = document.querySelectorAll(".img_text")
    let img = document.querySelectorAll(".parque_img")
    detalles.forEach(element => {
        element.innerText = '---'
    });
    detalles_img.forEach(element => {
        element.innerText = '---'
    });
    img.forEach(element => {
        element.src = '/IMG/parque_default.avif'
    });
}

function retroceder(){
    document.querySelector(".cuerpo-extra").style.display='none'
    document.querySelector(".cuerpo-pagina").style.display='block'
    limpiar_parques()
}




/*
    ||==================================
    || LABORATORIO DE PRUEBAS
    ||==================================
*/


let confirmacion = null
async function pantalla_confirmacion(id,accion,origen){
    let btn_confirmacion = document.querySelector('.btn_confirmar_modal')
    limpiar_tarjeta()
    card_mens('none')
    btn_confirmacion.setAttribute('onclick', 'pantalla_confirmacion_acciones("' + id + '","' + accion + '","' + origen + '")');
    //.removeAttribute('onclick')
    if (accion == 'confirmada') {
        confirmacion = await confirmar_dia(id)
        if (confirmacion.length > 0) {
            card_mens('block')
            create_card(confirmacion)
        }else{
            card_mens('none')
            confirmacion = null
        }
    }
    //-------------------------------------
    pantalla_confirmacion_display('block')
}


async function pantalla_confirmacion_acciones(id,accion,origen){
    document.querySelector('.btn_confirmar_modal').removeAttribute('onclick')
    if (confirmacion != null) {
        let ruta = '/R_solicitudes_rechazadas'
        let respuesta = await Patch(ruta,confirmacion)
    }
    btn_actions(id,accion,origen)
    pantalla_confirmacion_display('none')
}



function pantalla_confirmacion_display(accion){
    document.querySelector('.modal_confirmacion').style.display = accion
    if (accion == 'none') {
        pantalla_confirmacion_reset_btn()
        limpiar_tarjeta()
        card_mens('none')
    }
}


function pantalla_confirmacion_reset_btn(){
    let btn_confirmacion = document.querySelector('.btn_confirmar_modal')
    btn_confirmacion.removeAttribute('onclick')
}

function card_mens(estado){
    document.querySelector('.modal_info_desc').style.display = estado
    document.querySelector('.modal_mid_bottom').style.display = estado
}


async function confirmar_dia(id){
    let solicitudes_cruzadas = []
    let ruta = '/R_solicitudes_dia/'+id
    let respuesta = await Get(ruta)
    if (respuesta[1].length > 0) {
        respuesta[1].forEach(element => {
            if (element['hora_inicio'] < respuesta[0]['hora_inicio'] && element['hora_fin'] < respuesta[0]['hora_inicio']) {}
            else if (element['hora_inicio'] > respuesta[0]['hora_fin'] && element['hora_fin'] > respuesta[0]['hora_fin']) {}
            else{
                solicitudes_cruzadas.push(element);
            }
        });
    }else{}
    return (solicitudes_cruzadas)
    //----------------------
}

async function create_card(solicitudes){
    let bandeja = document.querySelector('.modal_mid_bottom')
    bandeja.innerHTML = ``;
    solicitudes.forEach(element => {
        bandeja.innerHTML += `
            <div class="solicitud_card">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M215.4 96H144 107.8 96v8.8V144v40.4 89L.2 202.5c1.6-18.1 10.9-34.9 25.7-45.8L48 140.3V96c0-26.5 21.5-48 48-48h76.6l49.9-36.9C232.2 3.9 243.9 0 256 0s23.8 3.9 33.5 11L339.4 48H416c26.5 0 48 21.5 48 48v44.3l22.1 16.4c14.8 10.9 24.1 27.7 25.7 45.8L416 273.4v-89V144 104.8 96H404.2 368 296.6 215.4zM0 448V242.1L217.6 403.3c11.1 8.2 24.6 12.7 38.4 12.7s27.3-4.4 38.4-12.7L512 242.1V448v0c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64v0zM176 160H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H336c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
                <p>${element['codigo']}</p>
            </div>
        `
    });
}


function limpiar_tarjeta(){
    let bandeja = document.querySelector('.modal_mid_bottom')
    bandeja.innerHTML = ``;
    confirmacion = null
}


/*
    ||================================
    || ACTUALIZAR TABLA
    ||================================
*/


async function Actualizar_tabla(){
    let miTabla = $('#myTable').DataTable();
    let ruta = '/R_solicitudes_all'
    let body = []
    let acciones = ``
    // ------------------------------------
    let respuesta = await Get(ruta)
    //console.log(respuesta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {
        acciones = `
            <div style="display: flex; gap: 0.2rem;">
                <img src="IMG/xmark-solid.svg" class="btn_rechazar rojo_${respuesta[index]['id']}"  onclick="pantalla_confirmacion(${respuesta[index]['id']},'rechazada','externo')">
                <img src="IMG/check-solid.svg" class="btn_aceptar verde_${respuesta[index]['id']}" onclick="pantalla_confirmacion(${respuesta[index]['id']},'confirmada','externo')">
            </div>
        `
        //=====================================================
        body [index]= [
            `${respuesta[index]['codigo_reservacion']}`,
            `${respuesta[index]['nombre_parque']}`,
            `${respuesta[index]['nombre_zona']}`,
            `${respuesta[index]['fecha_evento']}`,
            `${respuesta[index]['agregado_en']}`,
            acciones,
            `<div style="text-align: -webkit-center;"><img src="/IMG/pen-solid.svg" onclick="view_more(${respuesta[index]['id']})"></div>`
        ]
    }
    miTabla.rows.add(body).draw();
}





/*
    ||==============================================
    || LISTENER ACTIVOS
    ||==============================================
*/


window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".modal_confirmacion");
    if (event.target == modal) {
        pantalla_confirmacion_display('none')
    }
});




/*
    ||==============================================
    || LABORATORIO
    ||==============================================
*/



(function(){
    //console.log(local_sesion['permisos'])
    if (local_sesion['permisos'] == 'administrador') {
        console.log("Administrador")
    }else if (local_sesion['permisos'] == 'gestionar') {
        console.log("Gestor")
    }else if (local_sesion['permisos'] == 'autorizar') {
        console.log("autorizar")
    }else if (local_sesion['permisos'] == 'ver') {
        console.log("ver")
    }else{
        console.log("Desconocido")
    }
})();