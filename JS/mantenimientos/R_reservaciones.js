
async function btn_actions(id,accion,origen){
    console.log(id)
    console.log(accion)
    //return
    let token = await visualizar()
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar' || token['permisos'] == 'autorizar') {
        console.log('Permitir')
        ready()
    }else{
        console.log('No permitir')
        //Throw_alert('Accion denegada','Su usuario no cuenta con los permisos necesarios')
    }
    async function ready(){
        let btn_verde = document.querySelector('.verde_'+id)
        let btn_rojo = document.querySelector('.rojo_'+id)
        let ruta = '/Reservacion_parques_solicitudes'
        var tabla = $('#myTable').DataTable();
        //-------------------------------------
        btn_verde.removeAttribute('onclick')
        btn_rojo.removeAttribute('onclick')
        //check = false
        //if(origen == 'interno'){
        //    retroceder()
        //}
        data = {
            'id':id,
            'accion':accion,
            'responsable':local_sesion['usuario'],
        }
        try {
            if (accion == 'realizada') {
                let respuesta = await Patch(ruta,data)
                if (respuesta['message'] == 'Actualizado') {
                    console.log("Actualizacion exitosa - REALIZADA")
                    //trigger_email(id) // ENVIAR CORREO ELECTRONICO
                    //---------------------------
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    //---------------------------
                    //Throw_alert(accion,'Se ha confirmado la solicitud')
                    //tabla.row($((document.querySelector(".solicitud_"+id)))).remove().draw();
                    //Actualizar_tabla()
                }else{
                    //console.log("Error inesperado")
                    //---------------------------
                    btn_verde.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    btn_rojo.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    //Throw_alert('Error','Se ha producido un error inesperado durante la actualizacion')
                }
            }
            else if(accion == 'rechazada'){
                let respuesta = await Patch(ruta,data)
                if (respuesta['message'] == 'Actualizado') {
                    console.log("Actualizacion exitosa - CANCELADA")
                    //trigger_email(id)
                    //---------------------------
                    //document.querySelector(".solicitud_"+id).classList.add("table_next") //--  ANIMACION DE DESPLAZAMIENTO
                    //await new Promise((resolve) => setTimeout(resolve, 5));
                    //---------------------------
                    
                    //Throw_alert(accion,'Se ha rechazado la solicitud')
                    //tabla.row($((document.querySelector(".solicitud_"+id)))).remove().draw();
                    //Actualizar_tabla()
                }else{
                    console.log("Error inesperado")
                    //---------------------------
                    btn_verde.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    btn_rojo.setAttribute('onclick', 'pantalla_confirmacion("' + id + '","' + accion + '","' + origen + '")');
                    //Throw_alert('Error','Se ha producido un error inesperado durante la actualizacion')
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


async function view_more(id){
    let detalles = document.querySelectorAll(".input_reservacion")
    let detalles_img = document.querySelectorAll(".img_text")
    let img = document.querySelectorAll(".parque_img")
    document.querySelector(".cuerpo-pagina").style.display='none'
    document.querySelector(".cuerpo-extra").style.display='block'

    
    let ruta = '/Reservaciones_preciso/'+id
    let respuesta = await Get(ruta)
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




async function pantalla_confirmacion(id,accion,origen){
    let token = await visualizar()
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar' || token['permisos'] == 'autorizar') {
        console.log('Permitir')
        ready()
    }else{
        console.log('No permitir')
        //Throw_alert('Accion denegada','Su usuario no cuenta con los permisos necesarios')
    }
    async function ready(){
        let btn_confirmacion = document.querySelector('.btn_confirmar_modal')
        btn_confirmacion.setAttribute('onclick', 'pantalla_confirmacion_acciones("' + id + '","' + accion + '","' + origen + '")');
        pantalla_confirmacion_display('block')
    }
}

async function pantalla_confirmacion_acciones(id,accion,origen){
    let token = await visualizar()
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar' || token['permisos'] == 'autorizar') {
        console.log('Permitir')
        ready()
    }else{
        console.log('No permitir')
        //Throw_alert('Accion denegada','Su usuario no cuenta con los permisos necesarios')
    }
    async function ready(){
        //console.log("ID - "+id)
        //console.log("Accion - "+accion)
        //console.log("Origen - "+origen)
        if (origen == 'interno') {
            console.log("Nada")
        }else{
            console.log("Cerrar view more")
        }
        btn_actions(id,accion,origen)
    }
}

function pantalla_confirmacion_display(accion){
    document.querySelector('.modal_confirmacion').style.display = accion
    //pantalla_confirmacion_reset_btn()
    if (accion == 'none') {
        pantalla_confirmacion_reset_btn()
        //limpiar_tarjeta()
        //card_mens('none')
    }
}

function pantalla_confirmacion_reset_btn(){
    let btn_confirmacion = document.querySelector('.btn_confirmar_modal')
    btn_confirmacion.removeAttribute('onclick')
}

window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".modal_confirmacion");
    if (event.target == modal) {
        pantalla_confirmacion_display('none')
    }
});






