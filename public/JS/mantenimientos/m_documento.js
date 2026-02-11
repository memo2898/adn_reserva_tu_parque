//console.log(local_sesion['usuario'])


/*
    ||=============================
    || CRUD
    ||=============================
*/

async function Registrar_tipo(){
    let input = document.querySelector('.data_register')
    try {
        let token = await visualizar()
        if (token['permisos'] == 'administrador'){
            if (input.value.trim() != '') {
                Ready()
            }else{
                show_alert('Registro incompleto', 'Se necesita un mínimo de caracteres')
            }
        }else{
            show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        }
        //=================================
        async function Ready(){
            let ruta = '/mantenimientos_documentos'
            let button = document.querySelector('.btn_agregar')
            let body = {
                'tipo':input.value.trim(),
                'estado':'activo',
                'responsable':local_sesion['usuario']
            }
            check = false
            if (input.value == '') {
                return
            }
            button.removeAttribute('onclick')
            let respuesta = await Post(ruta,body)
            Actualizar_tabla()
            input.value = ''
            //----------------------
            show_alert('Tipo de documento registrado','Se ha agregado un nuevo tipo de documento')
            button.setAttribute('onclick', 'Registrar_tipo()')
        }
    } catch (error) {
        show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
    }
}


async function Guardar_tipo(id){
    let input = document.querySelectorAll('.data_input_'+id)
    try {
        let token = await visualizar()
        if (token['permisos'] == 'administrador'){
            if (input[0].value.trim() != '') {
                Ready()
            }else{
                show_alert('Accion denegada', 'Falta informacion')
            }
        }else{
            show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        }
    } catch (error) {
        show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
    }
    async function Ready(){
        //let input = document.querySelectorAll('.data_input_'+id)
        let ruta = '/mantenimientos_documentos/'+id
        let button = document.querySelectorAll('.data_input_'+id)
        button[2].removeAttribute('onclick')
        button[3].removeAttribute('onclick')
        let body = {
            'tipo':input[0].value.trim(),
            'estado':input[1].value,
            'responsable':local_sesion['usuario']
        }
        check = false
        let respuesta = await Patch(ruta,body)
        //console.log(respuesta)
        //----------------------
        show_alert('Tipo de documento actualizado','El documento seleccionado a sido actualizado')
        button[3].setAttribute('onclick', 'Guardar_tipo('+id+')')
        button[2].setAttribute('onclick', 'Eliminar_tipo('+id+')')
    }
}



async function Eliminar_tipo(id){
    try {
        let token = await visualizar()
        if (token['permisos'] == 'administrador'){
            Ready()
        }else{
            show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        }
    } catch (error) {
        show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
    }
    async function Ready(){
        let ruta = '/mantenimientos_documentos/'+id
        let button = document.querySelectorAll('.data_input_'+id)
        let respuesta = await Delete(ruta)
        //console.log(respuesta)
        if (respuesta['estado'] == true) {
            button[2].removeAttribute('onclick')
            button[3].removeAttribute('onclick')
            Actualizar_tabla()
            show_alert('Tipo de documento eliminado','El documento seleccionado a sido eliminado')
        }else if(respuesta['estado'] == false){
            show_alert('Accion invalida','Este documento tiene usuarios registrados')
        }
        check = false
    }
}



async function Actualizar_tabla(){
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimientos_documentos_all'
    let body = []
    let acciones = ``
    let select = ``
    // ------------------------------------
    let respuesta = await Get(ruta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {
        //=====================================================
        if (respuesta[index]['estado'] == 'activo') {
            select = `
            <select class="input_custom data_input_${respuesta[index]['id']}"> 
                <option value="activo" selected >activo</option>
                <option value="inactivo">inactivo</option>
            </select>
            `
        }else{
            select = `
            <select class="input_custom data_input_${respuesta[index]['id']}"> 
                <option value="activo">activo</option>
                <option value="inactivo" selected>inactivo</option>
            </select>
            `
        }
        //=====================================================
        acciones = `
        <div class="btn_section">
            <div class="btn_style btn_eliminar data_input_${respuesta[index]['id']}" onclick="Eliminar_tipo(${respuesta[index]['id']})">
                Eliminar
            </div>
            <div class="btn_style btn_guardar data_input_${respuesta[index]['id']}" onclick="Guardar_tipo(${respuesta[index]['id']})">
                Guardar
            </div>
        </div>
        `
        //=====================================================
        body [index]= [
            '<input type="text" value="'+respuesta[index]['tipo_documento'] +'" class="input_custom data_input_'+respuesta[index]['id'] +'">', 
            select,
            acciones
        ]
    }
    miTabla.rows.add(body).draw();
}



/*
async function Try(){
    let respuesta = await Get('/mantenimientos_documentos_all')
    console.log(respuesta)
}
*/

/*
    ||=============================
    || ADICIONALES
    ||=============================
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
    ||=============================
    || LISTENER
    ||=============================
*/




