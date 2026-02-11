/*
async function Try(input){
    ruta = '/solicitud_estado_codigo'
    let body = {
        'input':input
    }
    let respuesta = await Post(ruta,body)
    console.log(respuesta)
}
*/
//Try()


/*
    ||======================================
    || CRUD
    ||======================================
*/



async function reservacion_get(id){
    let input = document.querySelector('.input_objeto').value
    let icono = document.querySelector('.Carga_icon')
    let body
    let ruta  = ''
    check = false
    //console.log('ID - '+id)
    //console.log('INPUT - '+input)
    document.querySelector('.toast').style.display = 'none'
    if (id == undefined) {
        //ruta = '/solicitud_estado_json/'+input+"/input"
        ruta = '/solicitud_estado_json'
        body = {
            'id':input,
            'estado':'input'
        }
    }else{
        //ruta = '/solicitud_estado_json/'+id+"/id"
        ruta = '/solicitud_estado_json'
        body = {
            'id':id,
            'estado':'id'
        }
    }
    icono.style.display = 'block'
    icono.style.visibility = 'initial'
    document.querySelector('.box_middle').style.display = 'none'
    try {
        //let respuesta = await Get(ruta)
        let respuesta = await Post(ruta,body)
        //console.log(respuesta)
        //console.log(respuesta['estado_reservacion'])
        if (respuesta['estado_reservacion'] == 'confirmada') {
            await mostrar_reservacion(respuesta)
            icono.style.visibility = 'hidden'
            icono.style.display = 'none'
            //QR_token(respuesta['reservacion']['reservacion_id']) // - CREACION DEL QR
            document.querySelector('.box_middle').style.display = 'block'
        }else if(respuesta['estado_reservacion'] == 'pendiente'){
            show_alert('Estado de reservacion','Esta reservacion aun esta en revision')
        }else if(respuesta['estado_reservacion'] == 'rechazada'){
            show_alert('Estado de reservacion','Esta reservacion ha sido rechazada')
        }else if(respuesta['estado_reservacion'] == 'espera'){
            show_alert('Estado de solicitud','El usuario aun debe validar el correo para esta solicitud')
        }
    } catch (error) {
        //console.log(error)
        if (error['response']['status'] == 500) {
            //console.log("Registro inexistente")
            show_alert('Error','Esta reservacion no existe')
        }else if(error['response']['status'] == 404){
            //console.log('Error de peticion')
            show_alert('Error','Se ha producido un error durante la busqueda')
        }else{
            //console.log("Error inesperado")
            show_alert('Busqueda','Se ha producido un error inesperado')
        }
    }
    icono.style.visibility = 'hidden'
    
}






async function mostrar_reservacion(respuesta){
    let user = document.querySelectorAll('.user_info')
    let reservacion = document.querySelectorAll('.reservacion_info')
    let parque = document.querySelectorAll('.parque_info')
    let extra = document.querySelectorAll('.extra_info')
    //----------------------------------------
    user[0].innerText = respuesta['solicitante']['nombres'] + ' ' + respuesta['solicitante']['apellidos']
    user[1].innerText = respuesta['solicitante']['tipo_documento']
    user[2].innerText = respuesta['solicitante']['documento']
    user[3].innerText = respuesta['solicitante']['correo']
    user[4].innerText = respuesta['solicitante']['celular']
    //----------------------------------------
    reservacion[0].innerText = respuesta['reservacion']['codigo_reservacion']
    reservacion[1].innerText = respuesta['reservacion']['responsables']
    reservacion[2].innerText = respuesta['reservacion']['motivo_evento']
    reservacion[3].innerText = respuesta['reservacion']['fecha_evento']
    reservacion[4].innerText = respuesta['reservacion']['hora_inicio'] + ' - ' + respuesta['reservacion']['hora_fin']
    reservacion[5].innerText = respuesta['reservacion']['cantidad_adultos']
    reservacion[6].innerText = respuesta['reservacion']['cantidad_ninos']
    reservacion[7].innerText = respuesta['reservacion']['descripcion']
    //----------------------------------------
    parque[0].innerText = respuesta['parque']['nombre_parque']
    parque[1].innerText = respuesta['parque']['direccion']
    parque[2].innerText = respuesta['zona']['nombre_zona']
    parque[3].innerText = respuesta['zona']['direccion']
    //----------------------------------------
    extra[0].innerText = respuesta['parque']['correo']
    extra[1].innerText = respuesta['parque']['telefono_parque']
    extra[2].innerText = respuesta['parque']['provincia']
    extra[3].innerText = respuesta['parque']['municipio']
    extra[4].innerText = respuesta['parque']['sector']
    extra[5].innerText = respuesta['parque']['circunscripcion']

}

//respuesta['solicitante']['']
//user[0].innerText = respuesta['solicitante']['']
//reservacion[0].innerText = respuesta['reservacion']['']
//parque[0].innerText = respuesta['parque']['']
//extra[0].innerText = respuesta['parque']['']



/*
    ||===================================
    || QR MANAGER
    ||===================================
*/

async function solicitud_email(id){
    let ruta = '/enviar-correo_confirmacion'
    let body = {
        'id':id,
        'qr':document.querySelector("#QR_pruebas > canvas").toDataURL()
    }
    //console.log(body)
    let respuesta = await Post(ruta,body)
    console.log(respuesta)
}
//solicitud_email(2)


async function QR_token(id){
    let ruta = ruta_actual + '/'+id
    let QR_canvas = await QRMaker(ruta)
    let lienzo = document.querySelector('#QR_pruebas')
    let img = document.querySelector('.qr_img')

    QR_canvas.append(lienzo)

    //console.log(QR_canvas)

    //EXTRACTOR BASE64
    //document.querySelector("#QR_pruebas > canvas").toDataURL()
}

function img_qr(){
    let img = document.querySelector('.qr_img')
    img.src = document.querySelector("#QR_pruebas > canvas").toDataURL()
}

/*
    ||========================================
    || GESTION DE ALERTAS
    ||========================================
*/


function show_alert(title,mensaje){
    document.querySelector('.toast').style.display = 'block'
    document.querySelector('.me-auto').innerText = title
    document.querySelector('.toast-body').innerText = mensaje
    setTimeout(function() {
        check = true
    }, 1000);
}

/*
    ||===================================
    || LISTENERS
    ||===================================
*/



