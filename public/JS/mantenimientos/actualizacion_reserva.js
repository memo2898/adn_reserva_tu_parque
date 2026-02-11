
async function trigger_email(){
    let ruta = '/enviar-correo_confirmacion'
    let body={
        id:id
    }
    let respuesta = await Post(ruta,body)
    console.log(respuesta)
}














