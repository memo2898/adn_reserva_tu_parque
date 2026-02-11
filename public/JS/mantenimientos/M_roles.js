let check = false


let json = null
/*
    administrador - TODOS LOS PERMISOS - No pueden ser alterados por otros roles
    Soporte tecnico - Todos los permisos - puede ser alterado por un rol superior
    X - Operador - Ver, manipular, crear y eliminar
    tecnico - Ver, manipular 
    auxiliar - Ver 
    ||----------------------
    1. Ver
    2. Ver, Autorizar
    4. Ver, Autorizar - Gestionar mantenimientos (No puede manipular usuarios)
    5. Administrador (Acceso completo)

*/



/*
    ||=============================================
    || CRUD
    ||=============================================
*/


async function Registrar_rol(){
    let nombre = document.querySelectorAll('.event_data')[0].value
    let permiso = document.querySelector('.select_permisos').value
    let ruta = '/mantenimiento_roles'
    let body = {
        'rol': nombre,
        'permisos': permiso,
        'responsable': local_sesion['usuario'],
    }
    check = false
    let respuesta = await Post(ruta,body)
    //-------------------------------
    show_alert('Rol registrado','Se ha agregado un nuevo rol')
    Actualizar_tabla()
    clear_input()
}


async function guardar_rol(id){
    let input = document.querySelectorAll(".data_input_"+id)
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
    async function Ready(){
        let ruta = '/mantenimiento_roles/'+id
        input[3].removeAttribute('onclick')
        input[4].removeAttribute('onclick')
        let body = {
            'rol':input[0].value.trim(),
            'permisos': input[1].value,
            'estado':input[2].value,
            'responsable':local_sesion['usuario'],
        }
        check = false
        let respuesta = await Patch(ruta,body)
        //console.log(respuesta)
        input[3].setAttribute('onclick', 'eliminar_rol('+id+')')
        input[4].setAttribute('onclick', 'guardar_rol('+id+')')
        show_alert('Rol actualizado','El rol seleccionado a sido actualizado')
    }
}



async function eliminar_rol(id){
    let token = await visualizar()
    if (token['permisos'] == 'administrador'){
        Ready()
    }else{
        show_alert('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
    }
    //-----
    async function Ready(){
        let input = document.querySelectorAll(".data_input_"+id)
        let ruta = '/mantenimiento_roles/'+id
        check = false
        //input[3].removeAttribute('onclick')
        //input[4].removeAttribute('onclick')
        try {
            let respuesta = await Delete(ruta)
            console.log(respuesta)
            //----
            if (respuesta['estado'] == true) {
                show_alert('Rol eliminado','El rol seleccionado a sido eliminado')
                Actualizar_tabla()
                input[3].removeAttribute('onclick')
                input[4].removeAttribute('onclick')
            }else if(respuesta['estado'] == false){
                show_alert('Accion invalida','Este rol tiene usuarios registrados')
            }else if(respuesta['estado'] == 'error'){
                show_alert('Error inesperado','Un error inesperado a interrumpido la actualizacion')
            }else{
                show_alert('Error inesperado','Un error inesperado a interrumpido la actualizacion')
            }
        } catch (error) {
            console.log(error)
            show_alert('Error inesperado','Un error inesperado a interrumpido la actualizacion')
        }
    }
    //Actualizar_tabla()
    //show_alert('Rol eliminado','El rol seleccionado a sido eliminado')
}



async function Actualizar_tabla(){
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimiento_roles_all'
    // ------------------------------------
    let body = []
    let permisos = ``
    let estado = ``
    let botones = ``
    // ------------------------------------
    let respuesta = await Get(ruta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {
        if (respuesta[index]['permisos'] == 'administrador'){
            console.log("No mostrar")
        }
        else{ 
            if (respuesta[index]['permisos'] == 'ver') {
                permisos = `
                <select class="input_custom data_input_${respuesta[index]['id']}">
                    <option value='ver' selected>Ver solicitudes</option>
                    <option value='autorizar'>Autorizar solicitudes</option>
                    <option value='gestionar'>Gestionar parques</option>
                </select>
                `
            } else if(respuesta[index]['permisos'] == 'autorizar'){
                permisos = `
                <select class="input_custom data_input_${respuesta[index]['id']}">
                    <option value='ver'>Ver solicitudes</option>
                    <option value='autorizar' selected>Autorizar solicitudes</option>
                    <option value='gestionar'>Gestionar parques</option>
                </select>
                `    
            } else if(respuesta[index]['permisos'] == 'gestionar'){
                permisos = `
                <select class="input_custom data_input_${respuesta[index]['id']}">
                    <option value='ver'>Ver solicitudes</option>
                    <option value='autorizar'>Autorizar solicitudes</option>
                    <option value='gestionar' selected>Gestionar parques</option>
                </select>
                `    
            }
            if (respuesta[index]['estado'] == 'activo') {
                estado = `
                <select class="input_custom data_input_${respuesta[index]['id']}">
                    <option value = 'activo' selected>Activo</option>
                    <option value = 'inactivo'>Inactivo</option>
                </select>
                `
            }else{
                estado = `
                <select class="input_custom data_input_${respuesta[index]['id']}">
                    <option value = 'activo'>Activo</option>
                    <option value = 'inactivo' selected>Inactivo</option>
                </select>
                `
            }
            botones = `
            <div class='btn_section'>
                <div class="btn_style btn_eliminar data_input_${respuesta[index]['id']}" onclick="eliminar_rol(${respuesta[index]['id']})">
                    Eliminar
                </div>    
                <div class="btn_style btn_guardar data_input_${respuesta[index]['id']}" onclick="guardar_rol(${respuesta[index]['id']})">
                    Guardar
                </div>
            </div>
            `
            body.push([
                `<input type="text" value="${respuesta[index]['posicion']}" class="input_custom data_input_${respuesta[index]['id']}">`,
                permisos,
                estado,
                botones
            ]);
        }
    }
    miTabla.rows.add(body).draw();
}



/*
    ||=============================================
    || GESTION MODAL
    ||=============================================
*/

async function Desplegar_modal(){
    document.querySelector(".ventana_modal").style.display = 'block'
}
async function cerrar_modal(){
    document.querySelector(".ventana_modal").style.display = 'none'
}



function cerrar_alerta(){
    document.querySelector('.toast').style.display = 'none'
}
function show_alert(title,mensaje){
    document.querySelector('.toast').style.display = 'block'
    document.querySelector('.me-auto').innerText = title
    document.querySelector('.toast-body').innerText = mensaje
    setTimeout(function() {
        check = true
    }, 1000);
}




/*
    ||=============================================
    || ADICIONALES
    ||=============================================
*/


async function selector_permisos(){
    let lista_permisos = {
        'ver':'Solo pueden ver las solicitudes y la informacion basica del sistema',
        'autorizar':'Tiene permisos para ver la informacion del sistema asi como de aceptar o rechazar solicitudes',
        'gestionar':'Tiene permisos para ver y evaluar solicitudes asi como un acceso limitado a los mantenimientos disponibles',
        'administrador': 'posee un acceso completo del sistema',
    }
    let descripcion = document.querySelector('.permisos_info')
    let permiso = document.querySelector('.select_permisos').value
    //--------------------------------------
    console.log("Permiso seleccionado: " + permiso)
    descripcion.innerText = lista_permisos[permiso]
}


function clear_input(){
    document.querySelector(".event_data").value = ''
    document.querySelector(".select_permisos").options[0].selected = true
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
        if (check == true) {
            document.querySelector('.toast').style.display = 'none'
        }
    }
});
