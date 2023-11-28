let check = false


//console.log(local_sesion['usuario'])

/*
    ||=============================================
    || CRUD
    ||=============================================
*/

// show_alert('Actualizacion', 'Se ha actualizado el evento')
// show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
/*
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
*/

/*
async function Try(){
    let token = await visualizar()
    console.log(token)
}
*/


async function agregar_evento(){
    let token = await visualizar()
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
        let buttom = document.querySelector(".btn_agregar")
        let evento = document.querySelector(".data_register")
        buttom.removeAttribute('onclick')
        //--------------------------------------------
        if (evento.value.trim() != '') {
            Ready()
        }else{
            buttom.setAttribute('onclick', 'agregar_evento()')
            show_alert('Registro incompleto', 'Se necesita un mínimo de caracteres para registrar el evento')
        }
        //====================================
        async function Ready(){
            try {
                let ruta = '/mantenimientos_eventos'
                let body
                if (token['permisos'] == 'administrador'){
                    let link = document.querySelector('.select_res').value
                    body = {
                        'tipo': evento.value.trim(),
                        'id_parque': link,
                        'estado':'activo',
                        'responsable': local_sesion['usuario'],
                    }
                }else{
                    body = {
                        'tipo': evento.value.trim(),
                        'id_parque':token['id_parque'],
                        'estado':'activo',
                        'responsable': local_sesion['usuario'],
                    }
                }
                let respuesta = await Post(ruta,body)
                //console.log(respuesta)
                if (respuesta['message'] == 'Actualizado') {
                    evento.value = ''
                    show_alert('Evento registrado', 'Se ha agregado un nuevo evento')
                    Actualizar_tabla()
                }else{
                    show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
                }
                //--------------------------------------------
                buttom.setAttribute('onclick', 'agregar_evento()')
            } catch (error) {
                buttom.setAttribute('onclick', 'agregar_evento()')
                //show_alert('Evento registrado', 'Se ha agregado un nuevo evento')
            }
        }
    }
    else{
        console.log("Acceso denegado")
        show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
    }
}



async function guardar_cambios(id){
    let input = document.querySelectorAll('.data_input_'+id)
    try {
        let token = await visualizar()
        if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
            //Ready()
            if (input[0].value.trim() != '') {
                Ready()
            }else{
                show_alert('Accion denegada', 'Falta informacion')
            }
        }else{
            show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        }
        async function Ready(){
            //let input = document.querySelectorAll('.data_input_'+id)
            let ruta = '/mantenimientos_eventos/'+id
            let body
            check = false
            //------------------------------------------
            let button = document.querySelectorAll(".data_input_"+id)[3]
            button.removeAttribute('onclick')
            //------------------------------------------
            //+++++++++++++++++++++++++++++++++++++
            console.log(input[0].value.trim())
            if (token['permisos'] == 'administrador') {
                let link = document.querySelectorAll('.data_select_'+id)[0].value
                body = {
                    'tipo': input[0].value.trim(),
                    'parque': link,
                    'estado': input[1].value,
                    'responsable': local_sesion['usuario'],
                }
            }else{
                body = {
                    'tipo': input[0].value.trim(),
                    'parque': token['id_parque'],
                    'estado': input[1].value,
                    'responsable': local_sesion['usuario'],
                }
            }
            //+++++++++++++++++++++++++++++++++++++
            /*
            let body = {
                'tipo': input[0].value.trim(),
                'estado': input[1].value,
                'responsable': local_sesion['usuario'],
            }
            */
            let respuesta = await Patch(ruta,body)
            console.log(respuesta)
            if (respuesta['message'] = 'Actualizado') {
                show_alert('Evento actualizado', 'El evento seleccionado a sido actualizado')
            }else{
                show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
            }
            //------------------------------------------
            button.setAttribute('onclick', 'guardar_cambios('+id+')')
        }
    } catch (error) {
        button.setAttribute('onclick', 'guardar_cambios('+id+')')
        show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
    }
}


async function eliminar_evento(id){
    try {
        let token = await visualizar()
        if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
            Ready()
        }else{
            show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        }
        async function Ready(){
            console.log(id)
            let button = document.querySelectorAll(".data_input_"+id)[3]
            button.removeAttribute('onclick')
            //------------------------------------------
            let ruta = '/mantenimientos_eventos/'+id
            let respuesta = await Delete(ruta)
            //console.log(respuesta)
            if (respuesta['estado'] == true) {
                show_alert('Evento eliminado', 'El evento seleccionado a sido eliminado')
                Actualizar_tabla()
            }else if(respuesta['estado'] == false){
                show_alert('Accion invalida','Este evento tiene usuarios registrados')
            }else if(respuesta['estado'] == 'error'){
                show_alert('Error inesperado','Un error inesperado a interrumpido la actualizacion')
            }else{
                show_alert('Error inesperado','Un error inesperado a interrumpido la actualizacion')
            }
        }
    } catch (error) {
        show_alert('Error', 'Ha ocurrido un error durante la actualizacion')
    }
}



async function Actualizar_tabla(){
    //return
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimientos_eventos_all'
    let token = await visualizar()
    let multi_select = ``
    let body = []
    let acciones = ``
    let select = ``
    let respuesta = await Get(ruta)
    miTabla.clear().draw();
    for (let index = 0; index < respuesta['eventos'].length; index++) {
        if (token['permisos'] == 'administrador') {
            multi_select = '<select class="select_custom data_select_'+respuesta['eventos'][index]['id']+'">';
            respuesta['parques'].forEach(element => {
                if (respuesta['eventos'][index]['id_parque'] == element['id']) {
                    multi_select += `<option value="${element['id']}" selected >${element['nombre_parque']}</option>`;
                }else{
                    multi_select += `<option value="${element['id']}">${element['nombre_parque']}</option>`;
                }
            });
            multi_select += '</select>';
        }
        //=====================================================
        if (respuesta['eventos'][index]['estado'] == 'activo') {
            select = `
            <select class="select_custom data_input_${respuesta['eventos'][index]['id']}"> 
                <option value="activo" selected >activo</option>
                <option value="inactivo">inactivo</option>
            </select>
            `
        }else{
            select = `
            <select class="select_custom data_input_${respuesta['eventos'][index]['id']}"> 
                <option value="activo">activo</option>
                <option value="inactivo" selected>inactivo</option>
            </select>
            `
        }
        //=====================================================
        acciones = `
        <div class="btn_section">
            <div class="btn_style btn_eliminar data_input_${respuesta['eventos'][index]['id']}" onclick="eliminar_evento(${respuesta['eventos'][index]['id']})">
                Eliminar
            </div>
            <div class="btn_style btn_guardar data_input_${respuesta['eventos'][index]['id']}" onclick="guardar_cambios(${respuesta['eventos'][index]['id']})">
                Guardar
            </div>
        </div>
        `
        //=====================================================
        if (token['permisos'] == 'administrador') {
            body [index]= [
                '<input type="text" value="'+respuesta['eventos'][index]['tipo'] +'" class="input_custom data_input_'+respuesta['eventos'][index]['id'] +'">', 
                multi_select,
                select,
                acciones
            ]
        }else{
            body [index]= [
                '<input type="text" value="'+respuesta['eventos'][index]['tipo'] +'" class="input_custom data_input_'+respuesta['eventos'][index]['id'] +'">', 
                select,
                acciones
            ]
        }
        
    }
    miTabla.rows.add(body).draw();
}



/*
    ||=============================================
    || MODALES
    ||=============================================
*/


function show_alert(title,mensaje){
    document.querySelector('.toast').style.display = 'block'
    document.querySelector('.me-auto').innerText = title
    document.querySelector('.toast-body').innerText = mensaje
    setTimeout(function() {
        check = true
    }, 1000);
}

function hide_alert(){
    document.querySelector('.toast').style.display = 'none'
    check = false
}


/*
    ||=============================================
    || LISTENER
    ||=============================================
*/



document.addEventListener("click", function(event) {
    const toastContainer = document.querySelector(".toast");
    const isClickedInsideToast = toastContainer.contains(event.target);
    if (!isClickedInsideToast) {
        //console.log("Estado - " +check)
        if (check == true) {
            //console.log("Cerrando")
            hide_alert()
        }
    }
});




/*
async function Try(id){
    let ruta = '/reservaciones_eventos/'+id
    let respuesta = await Get(ruta)
    console.log(respuesta)
}
*/