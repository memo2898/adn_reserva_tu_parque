async function btn_actions(id,accion){
    let ruta = '/Reservacion_parques_solicitudes'
    data = {
        'id':id,
        'accion':accion
    }
    if (accion == 'confirmada') {
        //console.log("Aceptar solicitud")
        let respuesta = await Patch(ruta,data)
        //console.log(respuesta)
        if (respuesta['message'] == 'Actualizado') {
            console.log("Actualizacion exitosa")
        }else{
            console.log("Error inesperado")
        }
    }
    else if(accion == 'rechazada'){
        //console.log("rechazar solicitud")
        let respuesta = await Patch(ruta,data)
        //console.log(respuesta)
        if (respuesta['message'] == 'Actualizado') {
            console.log("Actualizacion exitosa")
        }else{
            console.log("Error inesperado")
        }
    }else{
        console.log('¿...?')
    }
}


async function view_more(id){
    console.log(id)
    let detalles = document.querySelectorAll(".input_reservacion")
    let detalles_img = document.querySelectorAll(".img_text")
    let img = document.querySelectorAll(".parque_img")
    document.querySelector(".cuerpo-pagina").style.display='none'
    document.querySelector(".cuerpo-extra").style.display='block'

    
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

    detalles[5].innerText = respuesta[0]['fecha_evento']
    detalles[6].innerText = respuesta[0]['hora_inicio']
    detalles[7].innerText = respuesta[0]['hora_fin']
    detalles[8].innerText = respuesta[0]['nombre_evento']
    detalles[9].innerText = respuesta[0]['cantidad_participantes_adultos']
    detalles[10].innerText = respuesta[0]['cantidad_participantes_ninos']
    detalles[11].innerText = respuesta[0]['descripcion_evento']
    //----------------------------------------
}


function retroceder(){
    document.querySelector(".cuerpo-extra").style.display='none'
    document.querySelector(".cuerpo-pagina").style.display='block'
    limpiar_parques()
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