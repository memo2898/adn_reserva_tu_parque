let id_parque = null
let id_zona = null
let horarios = null
let horarios_temp = null
let check = false
//let local_sesion['usuario'] = 'Admin'

async function reset(){
    id_parque = null
    id_zona = null
    horarios = null
    horarios_temp = null
}
/*
async function Try(){
    let ruta = '/terminos_condiciones'
    let respuesta = await Get(ruta);
    console.log(respuesta)
}
*/
document.querySelectorAll('[data-btn_accion]').forEach(function(elemento) {
    elemento.addEventListener('click', function() {
        if (this.dataset['btn_accion'] == 'guardar') {
            terminos_condiciones_manager(this.dataset['term_value'])
        }else if(this.dataset['btn_accion'] == 'cerrar'){
            mod_terminos_condiciones('none')
        }else{
            console.log('¿...?')
        }
    });
});


async function terminos_condiciones_manager(id){
    let input = document.querySelector('#terminos_condiciones')
    let text_red = document.querySelector('[data-red_text='+input.dataset['depende_red']+']')
    let mensaje_err = null
    let token = await visualizar()
    check = false
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
        if (input.value.trim() != '') {
            ready()
            reset_text_red()
        }else{
            show_modal('Formulario invalido', 'Informacion insuficiente')
            mensaje_err = 'Formulario incompleto'
            text_red.lastElementChild.innerText = mensaje_err
            text_red.classList.add('error_text_show')
            input.classList.add('estado_red')
        }
    }else{
        show_modal('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        document.querySelector(".modal_confirmacion").style.display = 'none'
    }
    async function ready(){
        let ruta = '/terminos_condiciones'
        let body = {
            'id':id,
            'terminos':input.value
        }
        let respuesta = await Post(ruta,body);
        console.log(respuesta)
        if (respuesta['estado'] == true) {
            show_modal('Terminos y condiciones actualizada', 'Los terminos y condiciones de uso del parque seleccionado han sido actualizados')
        }else{
            show_modal('Error inesperado', 'No se ha podido completar esta accion')
        }
    }
}

function mod_terminos_condiciones(accion){
    document.querySelector('.modal_term_condicion').style.display = accion
    if (accion == 'block') {
        document.querySelector('[data-btn_accion=guardar]').setAttribute('data-term_value',+id_parque)
    }else{
        document.querySelector('[data-btn_accion=guardar]').removeAttribute('data-term_value')
    }
}


window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".modal_term_condicion");
    if (event.target == modal) {
        mod_terminos_condiciones('none')
    }
});


/*
    ||====================================================
    ||DESPLEGAR INFORMACION A LA PANTALLA - START
    ||====================================================
*/


async function view_more(id){
    let campo = document.querySelectorAll(".parque_input")
    let estado = document.querySelector('.Select_estado_parque')
    let terms = document.querySelector('#terminos_condiciones')
    let ruta = '/Search_parque/'+id
    let respuesta = await Get(ruta)
    document.querySelector(".sect_1").style.display = 'none'
    document.querySelector(".sect_2").style.display = 'block'
    document.querySelector('[data-depende_red=red_A2]').setAttribute('data-identify',+id)
    document.querySelector('[data-depende_red=red_A3]').setAttribute('data-identify',+id)
    await reset()
    //console.log(respuesta)
    //-----------------------------------------
    horarios_temp = respuesta['horarios']
    id_parque = respuesta['id']
    //-----------------------------------------
    campo[0].value = respuesta['nombre_parque']
    campo[1].value = respuesta['correo']
    campo[2].value = respuesta['telefono']
    document.querySelector(".info_header").children[0].innerText = respuesta['nombre_parque'];
    campo[3].value = respuesta['provincia']
    campo[4].value = respuesta['municipio']
    campo[5].value = respuesta['sector']
    campo[6].value = respuesta['circunscripcion']
    campo[7].value = respuesta['direccion']
    campo[8].value = respuesta['espera']
    campo[9].value = respuesta['coordenadas_maps']
    campo[10].value = respuesta['descripcion']
    if (respuesta['condiciones'] != null) {
        terms.value = respuesta['condiciones']['condiciones']
    }else{
        terms.value = ''
    }
    if (respuesta['estado'] == 'activo') {
        estado.options[0].selected = true
    }else{
        estado.options[1].selected = true
    }
    //document.querySelector(".parque_img").src = respuesta['imagen']
    if (respuesta['imagen'] == null || respuesta['imagen'] == '') {
        document.querySelector(".parque_img").src = '/IMG/parque_default.avif'
    }else{
        document.querySelector(".parque_img").src = respuesta['imagen']
    }

    zonas_display(id)
    generar_horarios(respuesta['horarios'],'parque'); //APUNTADO HACIA LOS PARQUES
}


async function zonas_display(id){ //FUNCIONAL
    let zona = document.querySelector(".display_zonas")
    zona.innerHTML = ``
    let ruta = '/Reservaciones_zonas_img/'+id
    let respuesta = await Get(ruta)
    let img_temp = null
    //console.log(respuesta)
    //-------------------------------------------
    //<img src="${element['imagen_ruta']}"
    respuesta.forEach(element => {
        if (element['imagen'] == null || element['imagen'] == '') {
            img_temp = '/IMG/parque_default.avif'
        }else{
            img_temp =  element['imagen']
        }
        zona.innerHTML += `
        <div class="Zonas_card">
            <div class="zone_map" onclick='Zona_target(${element['id']})'">
                <img src=${img_temp} class="Z_img">
                <div class="Z_locate">
                    <img src="/IMG/location-dot-solid.svg" class="Z_svg">
                    <p class="Z_direct">${element['direccion']}</p>
                </div>
                <p class="Z_mesg">${element['nombre']}</p>
            </div>
        </div>
        `
    })
    //generar_horarios(respuesta['horarios'],'zona'); //APUNTADO HACIA LAS ZONAS
}

async function Zona_target(id){
    let zonas = document.querySelectorAll(".zona_input")
    let ruta = '/Search_zonas/'+id
    let zona_estado = document.querySelector('.Select_estado_zona')
    let response = await Get(ruta)
    //console.log(response)
    //-----------------------------
    document.querySelector(".sect_2").style.display = 'none'
    document.querySelector(".sect_3").style.display = 'block'
    //-----------------------------
    if (response['imagenes'][0]['imagen'] == null || response['imagenes'][0]['imagen'] == '') {
        document.querySelector('.zona_img').src = '/IMG/parque_default.avif'
    }else{
        document.querySelector('.zona_img').src = response['imagenes'][0]['imagen']
    }
    //document.querySelector('.zona_img').src = response['imagenes'][0]['imagen']
    document.querySelector(".info_header_2").children[0].innerText = response['zonas']['nombre']
    zonas[0].value = response['zonas']['nombre']
    zonas[1].value = response['zonas']['direccion']
    zonas[2].value = response['zonas']['coordenadas_maps']
    if (response['zonas']['estado'] == 'activo') {
        zona_estado.options[0].selected = true
    }else{
        zona_estado.options[1].selected = true
    }
    generar_horarios(response['horarios'],'zona'); //APUNTADO HACIA LAS ZONAS
    id_zona = response['zonas']['id']
    reset_all_parques()
}

//  ||---------------------------------------------------
//  || SUBDIVISION / GENERADORES POR CODIGO - END
//  ||---------------------------------------------------
async function generar_horarios(horarios,origen){ // GENERAL HORARIOS DE FORMA AUTOMATICA
    let start = document.getElementsByName(origen+"_horarios_start")
    let end = document.getElementsByName(origen+"_horarios_end")
    let apertura_12 = null
    let cierre_12 = null
    for (let i = 0; i < start.length; i++) {
        apertura_12 = await R_convertir_12h(horarios[i]['hora_apertura'])
        cierre_12 = await R_convertir_12h(horarios[i]['hora_cierre'])
        start[i].innerHTML = `
            <option value="default"> -- ${apertura_12} -- </option>
            <option value="7:00">7:00 AM</option>
            <option value="7:30">7:30 AM</option>
            <option value="8:00">8:00 AM</option>
            <option value="8:30">8:30 AM</option>
            <option value="9:00">9:00 AM</option>
            <option value="9:30">9:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <!-- -->
            <option value="13:00">1:00 PM</option>
            <option value="13:30">1:30 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="14:30">2:30 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="15:30">3:30 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="16:30">4:30 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <!-- -->
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
            <option value="21:30">9:30 PM</option>
            <option value="22:00">10:00 PM</option>
            <option value="22:30">10:30 PM</option>
            <option value="23:00">11:00 PM</option>
            <option value="23:30">11:30 PM</option>
            <option value="24:00">12:00 PM</option>
            <option value="24:30">12:30 PM</option>
        `
        end[i].innerHTML = `
            <option value="default"> -- ${cierre_12} -- </option>
            <option value="7:00">7:00 AM</option>
            <option value="7:30">7:30 AM</option>
            <option value="8:00">8:00 AM</option>
            <option value="8:30">8:30 AM</option>
            <option value="9:00">9:00 AM</option>
            <option value="9:30">9:30 AM</option>
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <!-- -->
            <option value="13:00">1:00 PM</option>
            <option value="13:30">1:30 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="14:30">2:30 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="15:30">3:30 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="16:30">4:30 PM</option>
            <option value="17:00">5:00 PM</option>
            <option value="17:30">5:30 PM</option>
            <option value="18:00">6:00 PM</option>
            <option value="18:30">6:30 PM</option>
            <!-- -->
            <option value="19:00">7:00 PM</option>
            <option value="19:30">7:30 PM</option>
            <option value="20:00">8:00 PM</option>
            <option value="20:30">8:30 PM</option>
            <option value="21:00">9:00 PM</option>
            <option value="21:30">9:30 PM</option>
            <option value="22:00">10:00 PM</option>
            <option value="22:30">10:30 PM</option>
            <option value="23:00">11:00 PM</option>
            <option value="23:30">11:30 PM</option>
            <option value="24:00">12:00 PM</option>
            <option value="24:30">12:30 PM</option>
        `
    }
}

generar_horarios_registro()
function generar_horarios_registro(){
    let registro = document.querySelectorAll('.modal_display')
    let dia = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo']
    let tipo = ['modal_register','modal_register_parque','modal_register_zona']
    for (let i = 0; i < registro.length; i++) {
        registro[i].innerHTML = ``
        for (let index = 0; index < 7; index++) {
            registro[i].innerHTML += `
                <tr>
                    <th class="registro_zona">${dia[index]}</th>
                    <th class="registro_zona">
                        <select name="${tipo[i]}_start">
                            <option value="7:00">7:00 AM</option>
                            <option value="7:30">7:30 AM</option>
                            <option value="8:00">8:00 AM</option>
                            <option value="8:30">8:30 AM</option>
                            <option value="9:00">9:00 AM</option>
                            <option value="9:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <!-- -->
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <!-- -->
                            <option value="19:00">7:00 PM</option>
                            <option value="19:30">7:30 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="20:30">8:30 PM</option>
                            <option value="21:00">9:00 PM</option>
                            <option value="21:30">9:30 PM</option>
                            <option value="22:00">10:00 PM</option>
                            <option value="22:30">10:30 PM</option>
                            <option value="23:00">11:00 PM</option>
                            <option value="23:30">11:30 PM</option>
                            <option value="24:00">12:00 PM</option>
                            <option value="24:30">12:30 PM</option>
                        </select>
                    </th>
                    <th class="registro_zona">
                        <select name="${tipo[i]}_end">
                            <option value="7:00">7:00 AM</option>
                            <option value="7:30">7:30 AM</option>
                            <option value="8:00">8:00 AM</option>
                            <option value="8:30">8:30 AM</option>
                            <option value="9:00">9:00 AM</option>
                            <option value="9:30">9:30 AM</option>
                            <option value="10:00">10:00 AM</option>
                            <option value="10:30">10:30 AM</option>
                            <option value="11:00">11:00 AM</option>
                            <option value="11:30">11:30 AM</option>
                            <option value="12:00">12:00 PM</option>
                            <option value="12:30">12:30 PM</option>
                            <!-- -->
                            <option value="13:00">1:00 PM</option>
                            <option value="13:30">1:30 PM</option>
                            <option value="14:00">2:00 PM</option>
                            <option value="14:30">2:30 PM</option>
                            <option value="15:00">3:00 PM</option>
                            <option value="15:30">3:30 PM</option>
                            <option value="16:00">4:00 PM</option>
                            <option value="16:30">4:30 PM</option>
                            <option value="17:00">5:00 PM</option>
                            <option value="17:30">5:30 PM</option>
                            <option value="18:00">6:00 PM</option>
                            <option value="18:30">6:30 PM</option>
                            <!-- -->
                            <option value="19:00">7:00 PM</option>
                            <option value="19:30">7:30 PM</option>
                            <option value="20:00">8:00 PM</option>
                            <option value="20:30">8:30 PM</option>
                            <option value="21:00">9:00 PM</option>
                            <option value="21:30">9:30 PM</option>
                            <option value="22:00">10:00 PM</option>
                            <option value="22:30">10:30 PM</option>
                            <option value="23:00">11:00 PM</option>
                            <option value="23:30">11:30 PM</option>
                            <option value="24:00">12:00 PM</option>
                            <option value="24:30">12:30 PM</option>
                        </select>
                    </th>
                </tr>
            `
        }
    }
}

//  ||---------------------------------------------------
//  || SUBDIVISION / GENERADORES POR CODIGO - END
//  ||---------------------------------------------------


/*
    ||====================================================
    ||DESPLEGAR INFORMACION A LA PANTALLA - END
    ||====================================================
*/



/*
    ||====================================================
    ||NAVEGACION ENTRE PANTALLAS PRINCIPALES - START
    ||====================================================
*/


function retroceder(){
    let parque = document.querySelectorAll('.parque_input')
    document.querySelector(".sect_1").style.display = 'block'
    document.querySelector(".sect_2").style.display = 'none'
    alterar_campos(parque,true)
    alterar_horarios('parque',true)
    limpiar_all_parque()
    reset_text_red()
    //--------
    document.querySelector(".parque_edicion").style.display = 'block'
    document.querySelector(".parque_guardar").style.display = 'none'
    document.querySelector("#edit_file_img_1").disabled = true
    document.querySelector(".custom-file-upload_1").style.visibility = 'hidden'
    document.querySelector(".custom_label").style.visibility = 'hidden'
    document.querySelector('[data-depende_red=red_A2]').removeAttribute('data-identify')
    document.querySelector('[data-depende_red=red_A3]').removeAttribute('data-identify')
}
function retroceder_2(){
    let zona = document.querySelectorAll('.zona_input')
    document.querySelector(".sect_3").style.display = 'none'
    document.querySelector(".sect_2").style.display = 'block'
    alterar_campos(zona,true)
    alterar_horarios('zona',true)
    limpiar_all_zona()
    reset_text_red()
    //-------
    document.querySelector(".zona_edicion").style.display = 'block'
    document.querySelector(".zona_guardar").style.display = 'none'
    document.querySelector("#edit_file_img_2").disabled = true
    document.querySelector(".custom-file-upload_2").style.visibility = 'hidden'
}



/*
    ||====================================================
    ||NAVEGACION ENTRE PANTALLAS PRINCIPALES - END
    ||====================================================
*/



/*
    ||====================================================
    ||ACCIONES DE EDICION - START
    ||====================================================
*/

function activar_edicion(origen){
    let parque = document.querySelectorAll('.parque_input')
    let zona = document.querySelectorAll('.zona_input')
    //----------------------------------------------------
    //console.log("Permitir edicion - " + origen)
    if (origen == "parque") {
        document.querySelector(".parque_edicion").style.display = 'none'
        document.querySelector(".parque_guardar").style.display = 'block'
        document.querySelector("#edit_file_img_1").disabled = false
        document.querySelector(".custom-file-upload_1").style.visibility = 'visible'
        document.querySelector(".custom_label").style.visibility = 'visible'
        alterar_campos(parque,false)
    }else if(origen == "zona"){
        //console.log("Habilitar zonas")
        document.querySelector(".zona_edicion").style.display = 'none'
        document.querySelector(".zona_guardar").style.display = 'block'
        document.querySelector("#edit_file_img_2").disabled = false
        document.querySelector(".custom-file-upload_2").style.visibility = 'visible'
        alterar_campos(zona,false)
    }
    alterar_horarios(origen,false)
}

async function alterar_campos(block,estado){
    //console.log('Estado: ' + estado)
    if (estado == false) {
        let check_in = await desbloquear_estado()
        //console.log(check_in['estado'])
        if (check_in['estado'] == true) {
            //console.log("True - Desbloquear")
            document.querySelector('.Select_estado_parque').disabled = estado
            document.querySelector('.Select_estado_zona').disabled = estado
        }else{
            //console.log('Falso - Mantener bloqueado')
    }
    }else{
        document.querySelector('.Select_estado_parque').disabled = estado
        document.querySelector('.Select_estado_zona').disabled = estado
    }
    //---------------------------------------
    block.forEach(element => {
        element.disabled = estado;
    });
    //document.querySelector('.Select_estado_parque').disabled = estado
    //document.querySelector('.Select_estado_zona').disabled = estado
    //---------------------------------------
    /*
    let check_in = await desbloquear_estado()
    console.log(check_in['estado'])
    if (check_in['estado'] == true) {
        console.log("True - Desbloquear")
    }else{
        console.log('Falso - Mantener bloqueado')
    }
    */
}

async function desbloquear_estado(){
    let ruta = '/mantenimientos_parques_zonas/'+id_parque
    let respuesta = await Get(ruta);
    //console.log(respuesta['estado'])
    return respuesta
}

function alterar_horarios(origen,estado){
    let start = document.getElementsByName(origen+"_horarios_start")
    let end = document.getElementsByName(origen+"_horarios_end")

    start.forEach(element => {
        element.disabled = estado;
    });
    end.forEach(element => {
        element.disabled = estado;
    });
}



async function guardar(origen){
    let parque = document.querySelectorAll('.parque_input')
    let zona = document.querySelectorAll('.zona_input')
    let token = await visualizar()
    let elemento = null
    let estado = []
    check = false
    //console.log(origen)
    if (origen == 'parque') {
        //console.log("Acceso a parque")
        elemento = parque
    }else if (origen == 'zona'){
        //console.log("Acceso a zona")
        elemento = zona
    }else{
        //console.log("¿...?")
        return
    }
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar') {
        for (const element of elemento) {
            let red = document.querySelector('[data-red_text='+element.dataset['depende_red']+']');
            let mensaje_err = null
            if (element.value.trim() != '') {
                if (element.dataset['registro'] == 'documento') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'correo') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'celular') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'usuario') {
                    estado.push(await checked_red(element, id_parque));
                }
                /**/
                else if (element.dataset['registro'] == 'password'){
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    if (element.value == Confirmar.value) {
                        estado.push(true);
                        element.classList.remove('estado_red');
                        if (red != null) {
                            red.classList.remove('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.remove('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.classList.remove('error_text_show')
                        }
                    }else{
                        estado.push(false);
                        element.classList.add('estado_red');
                        mensaje_err = 'Las contraseñas no coinciden'
                        if (red != null) {
                            red.lastElementChild.innerText = mensaje_err
                            red.classList.add('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.add('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.lastElementChild.innerText = mensaje_err
                            Confirmar_red.classList.add('error_text_show')
                        }
                    }
                }
                /**/
                else {
                    estado.push(true);
                    element.classList.remove('estado_red');
                    if (red != null) {
                        red.classList.remove('error_text_show')
                    }
                }
            }else {
                mensaje_err = 'Formulario incompleto'
                if (element.dataset['registro'] == 'documento') {
                    estado.push(false);
                    element.parentElement.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }else if (element.dataset['registro'] == 'password') {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                    //+++++++++++++++++++++++++++
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    Confirmar.classList.add('estado_red');
                    if (Confirmar_red != null) {
                        Confirmar_red.lastElementChild.innerText = mensaje_err
                        Confirmar_red.classList.add('error_text_show')
                    }
                }else {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }
            }
        }
        let end = estado.every((valor) => valor === true);
        if (end) {
            ready()
        }else{
            show_modal('Formulario invalido', 'Informacion invalida')
            document.querySelector(".modal_confirmacion").style.display = 'none'
            document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
        }
    }else{
        show_modal('Accion denegada','Su usuario no cuenta con los permisos necesarios')
        return
    }
    //--------------------------------
    async function ready(){
        //let parque = document.querySelectorAll('.parque_input')
        //let zona = document.querySelectorAll('.zona_input')
        let parque_estado = document.querySelector('.Select_estado_parque').value
        let ruta = null
        let fix = null
        check = false
        if (origen == 'parque') {
            ruta = '/mantenimientos_parques_actualizar/'+id_parque
        }
        else if(origen == 'zona'){
            ruta = '/mantenimientos_zona_actualizar/'+id_zona
        }
        //=============================================================
        fix = parque[9].value.split('"')
        if (fix.length > 10) {
            fix = fix[1]
        }else{
            fix = parque[9].value
        }
        //=============================================================
        if (origen == 'parque') {
            document.querySelector(".parque_edicion").style.display = 'block'
            document.querySelector(".parque_guardar").style.display = 'none'
            document.querySelector("#edit_file_img_1").disabled = true
            document.querySelector(".custom-file-upload_1").style.visibility = 'hidden'
            document.querySelector(".custom_label").style.visibility = 'hidden'
            //==============================
            alterar_campos(parque,true)
            alterar_horarios(origen,true)
            let body = {
                'nombre_parque': parque[0].value,
                'correo': parque[1].value,
                'telefono': parque[2].value,
                'provincia': parque[3].value,
                'municipio': parque[4].value,
                'sector': parque[5].value,
                'circunscripcion': parque[6].value,
                'direccion': parque[7].value,
                'espera': parque[8].value,
                //'coordenadas_maps': parque[9].value,
                'coordenadas_maps': fix,
                'descripcion': parque[10].value,
                'modificado_por': local_sesion['usuario'],
                'estado':parque_estado,
                //'imagen': parque[0].value,
            }
            //console.log(fix)
            //==============================
            let respuesta = await Patch(ruta,body)
            if (respuesta['message'] == 'Actualizado') {
                //console.log("Actualizacion de parques registrada")
                document.querySelector(".info_header").children[0].innerText = parque[0].value
                let response = await guardar_horarios_parques(origen)
                if (response == true) {
                    ruta = '/mantenimientos_parques_actualizar_imagen/'+id_parque
                    body = null
                    respuesta = null
                    body = {
                        'imagen':edit_file,
                        'responsable':local_sesion['usuario'],
                    }
                    if (edit_file != null) {
                        respuesta = await Patch(ruta,body)
                        //console.log("=========== ESTADO DE LA IMAGEN ===========")
                        //console.log(respuesta)
                    }else{
                        //console.log("=========== SIN IMAGEN PARA GUARDAR ===========")
                    }
                    show_modal('Parque actualizado','El registro seleccionado ha sido actualizado')
                    Actualizar_tabla()
                }
            }else{
                show_modal('Actualizacion invalida','Ha ocurrido un error inesperado')
                //console.log("Error durante la actualizacion")
            }
        }else if (origen == 'zona'){
            document.querySelector(".zona_edicion").style.display = 'block'
            document.querySelector(".zona_guardar").style.display = 'none'
            document.querySelector("#edit_file_img_2").disabled = true
            document.querySelector(".custom-file-upload_2").style.visibility = 'hidden'
            //==============================
            alterar_campos(zona,true)
            alterar_horarios(origen,true)
            //==============================
            let body = {
                'nombre': zona[0].value,
                'direccion': zona[1].value,
                'coordenadas_maps': zona[2].value,
                'estado':parque_estado,
            }
            //==============================
            let respuesta = Patch(ruta,body)
            if (respuesta['message'] = 'Actualizado') {
                //console.log("Actualizacion a las zonas registrado")
                document.querySelector(".info_header_2").children[0].innerText = zona[0].value
                let response = await guardar_horarios_parques(origen)
                if (response == true) {
                    ruta = '/mantenimientos_zona_actualizar_imagen/'+id_zona
                    body = null
                    respuesta = null
                    body = {
                        'imagen':edit_file_2,
                        'responsable':local_sesion['usuario'],
                    }
                    if (edit_file_2 != null) {
                        respuesta = await Patch(ruta,body)
                        //console.log("=========== ZONA CON IMAGEN ===========")
                        //console.log(respuesta)
                    }else{
                        //console.log("=========== ZONA SIN IMAGEN ===========")
                    }
                    //------------------------------
                    //respuesta = await Patch(ruta,body)
                    //console.log("=========== ESTADO DE LA IMAGEN ZONA ===========")
                    zonas_display(id_parque)
                }
                show_modal('Gazebo actualizado','El registro seleccionado ha sido actualizado')
                Actualizar_tabla()
                //close_confirm()
            }else{
                show_modal('Actualizacion invalida','Ha ocurrido un error inesperado')
                //console.log("Error durante la actualizacion")
                //document.querySelector(".modal_confirmacion").style.display = 'none'
                //document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
            }
        }
        close_confirm()
    }
}


async function eliminar(origen){
    let token = await visualizar()
    if (token['permisos'] == 'administrador') {
        //console.log("Permiso")
        ready()
    }else{
        show_modal('Accion denegada','Su usuario no cuenta con los permisos necesarios')
        return
    }
    //return
    async function ready(){
        close_confirm()
        check = false
        if (origen == 'parque') {
            let ruta = '/mantenimientos_parques_eliminar/'+id_parque
            let respuesta = await Delete(ruta)
            //console.log(respuesta)
            //---
            if (respuesta['estado'] == true) {
                Actualizar_tabla()
                show_modal('Parque eliminado','Se ha eliminado el registro con exito')
                retroceder()
            }else if(respuesta['estado'] == false){
                show_modal('Parque activo','Los parques con actividad registrada no pueden ser eliminados')
            }else{
                show_modal('Error inesperado','Se ha producido un error inesperado')
            }
            //--------------------------
            //await view_more(id_parque)
            //retroceder()
        }
        else if(origen == 'zona'){
            //console.log("Zona - " +id_zona)
            let ruta = '/mantenimientos_zona_eliminar/'+id_zona
            let respuesta = await Delete(ruta)
            //console.log(respuesta)
            if (respuesta['estado'] == true) {
                Actualizar_tabla()
                await view_more(id_parque)
                show_modal('Gazebo eliminado','Se ha eliminado el registro con exito')
                retroceder_2()
            }else if(respuesta['estado'] == false){
                show_modal('Gazebo activo','Los gazebos con actividad registrada no pueden ser eliminados')
            }else{
                show_modal('Error inesperado','Se ha producido un error inesperado')
            }
            //--------------------------
            //await view_more(id_parque)
            //retroceder_2()
        }
    }
}




async function guardar_horarios_parques(origen){
    //console.log(origen)
    //---------------------------------------------------
    let start = document.getElementsByName(origen+"_horarios_start")
    let end = document.getElementsByName(origen+"_horarios_end")
    //---------------------------------------------------
    let ruta = null
    if (origen == 'parque') {
        ruta = '/mantenimientos_parques_actualizar_horarios/'+id_parque;
    }else if(origen == 'zona'){
        ruta = '/mantenimientos_zona_actualizar_horarios/'+id_zona
    }
    
    let body = {
        'lunes':{
            'hora_apertura':start[0].value,
            'hora_cierre':end[0].value,
        },
        'martes':{
            'hora_apertura':start[1].value,
            'hora_cierre':end[1].value,
        },
        'miercoles':{
            'hora_apertura':start[2].value,
            'hora_cierre':end[2].value,
        },
        'jueves':{
            'hora_apertura':start[3].value,
            'hora_cierre':end[3].value,
        },
        'viernes':{
            'hora_apertura':start[4].value,
            'hora_cierre':end[4].value,
        },
        'sabado':{
            'hora_apertura':start[5].value,
            'hora_cierre':end[5].value,
        },
        'domingo':{
            'hora_apertura':start[6].value,
            'hora_cierre':end[6].value,
        },
    }
    
    //console.log("Realizando llamada...")
    let respuesta = await Patch(ruta,body);
    //console.log(respuesta)
    if (respuesta['message'] == 'Actualizado') {
        return true
        //console.log("Actualizacion registrada")
        //console.log("Ubicacion - " + origen)
        //console.log("ruta utilizada - " + ruta)
    }else{
        return false
        //console.log("Error durante la actualizacion")
    }
}






/*
    ||===================================================
    ||BOTONES
    ||===================================================
*/


async function crear_parque(origen){ //CREACION SOLO PARQUE SIN ZONA INMEDIATA
    let campos = document.querySelectorAll(".input_data_parque")
    let token = await visualizar()
    let estado = []
    check = false
    if (token['permisos'] == 'administrador') {
        for (const element of campos) {
            let red = document.querySelector('[data-red_text='+element.dataset['depende_red']+']');
            let mensaje_err = null
            if (element.value.trim() != '') {
                if (element.dataset['registro'] == 'documento') {
                    estado.push(await checked_red(element, null));
                } else if (element.dataset['registro'] == 'correo') {
                    estado.push(await checked_red(element, null));
                } else if (element.dataset['registro'] == 'celular') {
                    estado.push(await checked_red(element, null));
                } else if (element.dataset['registro'] == 'usuario') {
                    estado.push(await checked_red(element, null));
                }
                /**/
                else if (element.dataset['registro'] == 'password'){
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    if (element.value == Confirmar.value) {
                        estado.push(true);
                        element.classList.remove('estado_red');
                        if (red != null) {
                            red.classList.remove('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.remove('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.classList.remove('error_text_show')
                        }
                    }else{
                        estado.push(false);
                        element.classList.add('estado_red');
                        mensaje_err = 'Las contraseñas no coinciden'
                        if (red != null) {
                            red.lastElementChild.innerText = mensaje_err
                            red.classList.add('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.add('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.lastElementChild.innerText = mensaje_err
                            Confirmar_red.classList.add('error_text_show')
                        }
                    }
                }
                /**/
                else {
                    estado.push(true);
                    element.classList.remove('estado_red');
                    if (red != null) {
                        red.classList.remove('error_text_show')
                    }
                }
            }else {
                mensaje_err = 'Formulario incompleto'
                if (element.dataset['registro'] == 'documento') {
                    estado.push(false);
                    element.parentElement.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }else if (element.dataset['registro'] == 'password') {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                    //+++++++++++++++++++++++++++
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    Confirmar.classList.add('estado_red');
                    if (Confirmar_red != null) {
                        Confirmar_red.lastElementChild.innerText = mensaje_err
                        Confirmar_red.classList.add('error_text_show')
                    }
                }else {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }
            }
        }
        let end = estado.every((valor) => valor === true);
        if (end) {
            ready()
            //console.log("Ready")
        }else{
            show_modal('Formulario invalido', 'Informacion invalida')
        }
    }else{
        show_modal('Accion denegada','Su usuario no cuenta con los permisos necesarios')
        return
    }
    //=================================
    async function ready(){
        document.querySelectorAll(".btn-primary")[1].disabled = true
        let ruta = '/mantenimientos_parque_agregar'
        let id_temp = null
        //let finalizo = null
        //=================================
        fix = campos[9].value.split('"')
        if (fix.length > 10) {
            fix = fix[1]
        }else{
            fix = campos[9].value
        }
        //=================================
        let body = {
            'nombre':campos[0].value,
            'correo':campos[1].value,
            'telefono':campos[2].value, // CAMBIAR POR TELEFONO
            'provincia':campos[3].value,
            'municipio':campos[4].value,
            'sector':campos[5].value,
            'circunscripcion':campos[6].value,
            'direccion':campos[7].value,
            'espera':campos[8].value, // TIEMPO DE ESPERA
            'coordenadas_maps':fix,
            'descripcion':campos[10].value,
            'responsable':local_sesion['usuario'],
        }
        let respuesta = await Post(ruta,body) //REGISTRO DE PARQUE
        id_temp = respuesta['response']['id']
        if (respuesta['status'] == 200) {
            ruta = null
            body = null
            respuesta = null
            //------------------------------
            ruta = '/mantenimientos_parque_agregar_img'
            body = {
                'id_parque': id_temp,
                'img':File_img2,
                'responsable':local_sesion['usuario'],
            }
            respuesta = await Post(ruta,body) // REGISTRO DE IMAGEN
            if (respuesta['status'] == 200) {
                ruta = null
                body = null
                respuesta = null
                //-------------------------------------
                ruta = '/mantenimientos_parque_agregar_horarios/'+id_temp
                body = await registrar_horario_flex('parque')
                respuesta = await Post(ruta,body) // REGISTRO DE HORARIO DEL PARQUE
                //-------------------------------------
                reset_modal_parque()
                closemodal_2()
                show_modal('Parque registrado','Se ha completado exitosamente el nuevo registro')
                Actualizar_tabla()
            }else{
                closemodal_2()
                show_modal('Registro invalido','Se ha producido un error inesperado durante el registro del parque, Por favor vuelva a intentarlo')
                Actualizar_tabla()
            }
        }
        document.querySelectorAll(".btn-primary")[1].disabled = false
    }
}



async function registrar_horario_flex(origen){
    let start = document.getElementsByName('modal_register_'+origen+'_start')
    let end = document.getElementsByName('modal_register_'+origen+'_end')

    let body = {
        'lunes':{
            'hora_apertura':start[0].value,
            'hora_cierre':end[0].value,
        },
        'martes':{
            'hora_apertura':start[1].value,
            'hora_cierre':end[1].value,
        },
        'miércoles':{
            'hora_apertura':start[2].value,
            'hora_cierre':end[2].value,
        },
        'jueves':{
            'hora_apertura':start[3].value,
            'hora_cierre':end[3].value,
        },
        'viernes':{
            'hora_apertura':start[4].value,
            'hora_cierre':end[4].value,
        },
        'sábado':{
            'hora_apertura':start[5].value,
            'hora_cierre':end[5].value,
        },
        'domingo':{
            'hora_apertura':start[6].value,
            'hora_cierre':end[6].value,
        },
        //'responsable':local_sesion['usuario'],
    }
    return body
}




//==========================================================
//ZONAS
//==========================================================





async function crear_zona(origen){
    let campos = document.querySelectorAll(".input_data")
    let token = await visualizar()
    let estado = []
    check = false
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar') {
        //console.log('Accion')
        for (const element of campos) {
            let red = document.querySelector('[data-red_text='+element.dataset['depende_red']+']');
            let mensaje_err = null
            if (element.value.trim() != '') {
                if (element.dataset['registro'] == 'documento') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'correo') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'celular') {
                    estado.push(await checked_red(element, id_parque));
                } else if (element.dataset['registro'] == 'usuario') {
                    estado.push(await checked_red(element, id_parque));
                }
                /**/
                else if (element.dataset['registro'] == 'password'){
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    if (element.value == Confirmar.value) {
                        estado.push(true);
                        element.classList.remove('estado_red');
                        if (red != null) {
                            red.classList.remove('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.remove('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.classList.remove('error_text_show')
                        }
                    }else{
                        estado.push(false);
                        element.classList.add('estado_red');
                        mensaje_err = 'Las contraseñas no coinciden'
                        if (red != null) {
                            red.lastElementChild.innerText = mensaje_err
                            red.classList.add('error_text_show')
                        }
                        //++++++++++++++++++++++++++++++++++
                        Confirmar.classList.add('estado_red');
                        if (Confirmar_red != null) {
                            Confirmar_red.lastElementChild.innerText = mensaje_err
                            Confirmar_red.classList.add('error_text_show')
                        }
                    }
                }
                /**/
                else {
                    estado.push(true);
                    element.classList.remove('estado_red');
                    if (red != null) {
                        red.classList.remove('error_text_show')
                    }
                }
            }else {
                mensaje_err = 'Formulario incompleto'
                if (element.dataset['registro'] == 'documento') {
                    estado.push(false);
                    element.parentElement.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }else if (element.dataset['registro'] == 'password') {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                    //+++++++++++++++++++++++++++
                    let Confirmar = document.querySelector('[data-password_extra='+element.dataset['password_main']+']')
                    let Confirmar_red = document.querySelector('[data-red_text='+Confirmar.dataset['depende_red']+']')
                    Confirmar.classList.add('estado_red');
                    if (Confirmar_red != null) {
                        Confirmar_red.lastElementChild.innerText = mensaje_err
                        Confirmar_red.classList.add('error_text_show')
                    }
                }else {
                    estado.push(false);
                    element.classList.add('estado_red');
                    if (red != null) {
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }
            }
        }
        let end = estado.every((valor) => valor === true);
        if (end) {
            ready()
        }else{
            show_modal('Formulario invalido', 'Informacion invalida')
            document.querySelector(".modal_confirmacion").style.display = 'none'
            document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
        }
        //ready()
    }else{
        show_modal('Accion denegada','Su usuario no cuenta con los permisos necesarios')
        return
    }
    async function ready(){
        document.querySelectorAll(".btn-primary")[0].disabled = true
        //let campos = document.querySelectorAll(".input_data")
        let ruta = '/mantenimientos_zona_agregar'
        let body = {
            'id_parque': id_parque,
            'nombre': campos[0].value,
            'direccion': campos[1].value,
            'coordenadas_maps': campos[2].value,
        }
        // 'img':File_img,
        let respuesta = await Post(ruta,body)
        if (respuesta['status']== 200) {
            //console.log('Registro de zona')
            ruta = null
            body = null
            ruta = '/mantenimientos_zona_agregar_img'
            body = {
                'id_zona': respuesta['response']['id'],
                'img':File_img,
                'responsable':local_sesion['usuario'],
            }
            respuesta = await Post(ruta,body)
            //console.log(respuesta)
            if (respuesta['status']== 200) {
                //console.log("Registrando horarios")
                registrar_horario(respuesta['response']['id_zona'])
                reset_modal_zona()
                zonas_display(id_parque)
                show_modal('Actualizacion-zona','Se ha completado exitosamente el registro')
                closeModal()
                document.querySelectorAll(".btn-primary")[0].disabled = false
            }
            
        }
        //console.log(respuesta)
    }
}


async function registrar_horario(id){
    //console.log(id)
    let ruta = '/mantenimientos_zona_agregar_horarios/'+id
    let start = document.getElementsByName('modal_register_start')
    let end = document.getElementsByName('modal_register_end')
    let body = {
        'lunes':{
            'hora_apertura':start[0].value,
            'hora_cierre':end[0].value,
        },
        'martes':{
            'hora_apertura':start[1].value,
            'hora_cierre':end[1].value,
        },
        'miércoles':{
            'hora_apertura':start[2].value,
            'hora_cierre':end[2].value,
        },
        'jueves':{
            'hora_apertura':start[3].value,
            'hora_cierre':end[3].value,
        },
        'viernes':{
            'hora_apertura':start[4].value,
            'hora_cierre':end[4].value,
        },
        'sábado':{
            'hora_apertura':start[5].value,
            'hora_cierre':end[5].value,
        },
        'domingo':{
            'hora_apertura':start[6].value,
            'hora_cierre':end[6].value,
        },
    }
    //console.log(body)

    let respuesta = await Post(ruta,body)
    //console.log(respuesta)
}




//-------------------------- SECCION DE PRUEBAS
//let file = null
let File_img = null
document.getElementById('fileInput_1').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        //console.log(reader)
        reader.onload = function() {
            const previewImage = document.getElementById('previewImage_1');
            previewImage.src = reader.result;
            File_img = reader.result
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});


let File_img2 = null
document.getElementById('fileInput_2').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        //console.log(reader)
        reader.onload = function() {
            const previewImage = document.getElementById('previewImage_2');
            previewImage.src = reader.result;
            File_img2 = reader.result
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

let File_img3 = null
document.getElementById('fileInput_3').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        //console.log(reader)
        reader.onload = function() {
            const previewImage = document.getElementById('previewImage_3');
            previewImage.src = reader.result;
            File_img3 = reader.result
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});


/*
    ||======================================================
    ||CONTROLADORES DE EDICION
    ||======================================================
*/

let edit_file = null
document.getElementById('edit_file_img_1').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        //console.log(reader)
        reader.onload = function() {
            const previewImage = document.querySelector('.parque_img');
            previewImage.src = reader.result;
            edit_file = reader.result
            //console.log(edit_file)
            //previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});


let edit_file_2 = null
document.getElementById('edit_file_img_2').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        //console.log(reader)
        reader.onload = function() {
            const previewImage = document.querySelector('.zona_img');
            previewImage.src = reader.result;
            edit_file_2 = reader.result
            //console.log(edit_file)
            //previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});




function reset_modal_zona(){
    let campos = document.querySelectorAll(".input_data")
    document.getElementById('previewImage_1').src = '/IMG/parque_default.avif'
    document.querySelector("#fileInput_1").value = null
    campos.forEach(element => {
        element.value = ''
    });
    File_img = null
    reset_horarios()
}
function reset_horarios(){
    let start = document.getElementsByName('modal_register_start')
    let end = document.getElementsByName('modal_register_end')
    start.forEach(element => {
        element.options[0].selected = true
    });
    end.forEach(element => {
        element.options[0].selected = true
    });
}



function reset_modal_parque(){
    let campos = document.querySelectorAll(".input_data_parque")
    let campos2 = document.querySelectorAll(".input_data_zona")
    document.getElementById('previewImage_2').src = '/IMG/parque_default.avif'
    document.getElementById('previewImage_3').src = '/IMG/parque_default.avif'
    document.querySelector("#fileInput_2").value = null
    document.querySelector("#fileInput_3").value = null
    campos.forEach(element => {
        element.value = ''
    });
    campos2.forEach(element => {
        element.value = ''
    });
    File_img2 = null
    File_img3 = null
    reset_horarios_2()
}
function reset_horarios_2(){
    let start = document.getElementsByName('modal_register_parque_start')
    let end = document.getElementsByName('modal_register_parque_end')
    start.forEach(element => {
        element.options[0].selected = true
    });
    end.forEach(element => {
        element.options[0].selected = true
    });
    start = document.getElementsByName('modal_register_zona_start')
    end = document.getElementsByName('modal_register_zona_end')
    start.forEach(element => {
        element.options[0].selected = true
    });
    end.forEach(element => {
        element.options[0].selected = true
    });

}





/*
    ||====================================================
    ||GESTION DE MODALES - START
    ||====================================================
*/





function view_modal(){
    document.querySelector(".modal").style.display = 'block'
}
function view_modal_2(){
    document.querySelector(".modal_2").style.display = 'block'
}


function closeModal(){
    document.querySelector(".modal").style.display = 'none'
    reset_text_red()
}
window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        closeModal()
    }
});

function closemodal_2(){
    document.querySelector(".modal_2").style.display = 'none'
    reset_text_red()
}
window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.getElementById("mymodal_2");
    if (event.target == modal) {
        closemodal_2()
    }
});

/*
function open_confirm(origen,accion){
    console.log(origen)
    document.querySelector(".modal_confirmacion").style.display = 'block'
    document.querySelector(".btn_confirmar_modal").setAttribute("onclick", "guardar('"+origen+"')");
}
*/
function open_confirm(origen,accion){
    //console.log(origen)
    document.querySelector(".modal_confirmacion").style.display = 'block'
    //document.querySelector(".btn_confirmar_modal").setAttribute("onclick", "guardar('"+origen+"')");
    document.querySelector(".btn_confirmar_modal").setAttribute("onclick", accion+"('"+origen+"')");
}
function close_confirm(){
    document.querySelector(".modal_confirmacion").style.display = 'none'
    document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
    reset_all_parques()
    reset_all_zonas()
}
window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".modal_confirmacion");
    if (event.target == modal) {
        //close_confirm()
        document.querySelector(".modal_confirmacion").style.display = 'none'
        document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
    }
});


/*
function modal_2_replace(direct){ //DESHABILITAR CREACION DE ZONA AUTOMATICA
    if (direct == 'siguiente') {
        document.querySelector(".parque_registro_step_1").style.display = 'none'
        document.querySelector(".parque_registro_step_2").style.display = 'block'
        document.querySelectorAll('.btn_next_step')[0].style.display = 'none'
        document.querySelectorAll('.btn_next_step')[1].style.display = 'block'
    }else if(direct == 'anterior'){
        document.querySelector(".parque_registro_step_2").style.display = 'none'
        document.querySelector(".parque_registro_step_1").style.display = 'block'
        document.querySelectorAll('.btn_next_step')[1].style.display = 'none'
        document.querySelectorAll('.btn_next_step')[0].style.display = 'block'
    }
}
*/


function show_modal(titulo,mensaje,accion){
    document.querySelector(".toast").style.display = 'block'
    document.querySelector(".me-auto").innerText = titulo //TITULO
    document.querySelector(".toast-body").innerText = mensaje //BODY
    //console.log(accion)
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


function reset_all_parques(){
    let parque = document.querySelectorAll('.parque_input')
    document.querySelector(".parque_edicion").style.display = 'block'
    document.querySelector(".parque_guardar").style.display = 'none'
    document.querySelector("#edit_file_img_1").disabled = true
    document.querySelector(".custom-file-upload_1").style.visibility = 'hidden'
    document.querySelector(".custom_label").style.visibility = 'hidden'
    alterar_campos(parque,true)
    alterar_horarios('parque',true)
}

function reset_all_zonas(){
    let zona = document.querySelectorAll('.zona_input')
    document.querySelector(".zona_edicion").style.display = 'block'
    document.querySelector(".zona_guardar").style.display = 'none'
    document.querySelector("#edit_file_img_2").disabled = true
    document.querySelector(".custom-file-upload_2").style.visibility = 'hidden'
    alterar_campos(zona,true)
    alterar_horarios('zona',true)
}

function limpiar_all_parque(){
    let parque = document.querySelectorAll('.parque_input')
    let terms = document.querySelector('#terminos_condiciones')
    terms.value = ''
    document.querySelector('.Select_estado_parque').options[0].selected = true
    document.querySelector(".info_header").children[0].innerText = '---';
    document.querySelector(".parque_img").src = '/IMG/parque_default.avif'
    parque.forEach(element => {
        element.value = ''
    });
}

function limpiar_all_zona(){
    let zona = document.querySelectorAll('.zona_input')
    document.querySelector('.Select_estado_zona').options[0].selected = true
    document.querySelector(".info_header_2").children[0].innerText = '---'
    document.querySelector('.zona_img').src = '/IMG/parque_default.avif'
    zona.forEach(element => {
        element.value = ''
    });
}

/*
    ||====================================================
    ||GESTION DE MODALES - END
    ||====================================================
*/


/*
    ||====================================================
    || DATASET LIVE CHECK - END
    ||====================================================
*/

document.querySelectorAll('[data-registro]').forEach(function(elemento) {
    elemento.addEventListener('change', function() {
        if (this.dataset['identify'] != undefined) {
            checked_red(this, this.dataset['identify'])
            //console.log('Patch')
        }else{
            checked_red(this, null)
            //console.log('Post')
        }
    });
});

/*
    ||====================================================
    || DATASET LIVE CHECK - END
    ||====================================================
*/


/*
    ||====================================================
    || OPCIONES DE ADMINISTRADOR
    ||====================================================
*/

// console.log('Gestionar las acciones por nivel de usuario')



/*
(function(){
    if (local_sesion['permisos'] != 'administrador') {
        document.querySelector('.parque_creacion').remove()
    }
    //------------------------------
    if (local_sesion['permisos'] == 'administrador') {
        console.log("Administrador")
    }else if (local_sesion['permisos'] == 'gestionar') {
        console.log("Gestor")
    }else if (local_sesion['permisos'] == 'autorizar') {
        console.log("Auxiliar")
    }else if (local_sesion['permisos'] == 'ver') {
        console.log("Soporte")
    }else{
        console.log('¿...?')
    }
})();
*/



/*
(function(a,b){
    console.log("Tirando")
    console.log(local_sesion)
    console.log(a)
    console.log(b)
})(1,2);

(async () => {
    let respuesta = await visualizar()
    console.log(respuesta)
})();
*/

/*
    ||====================================================
    || LABORATORIO
    ||====================================================
*/


async function Actualizar_tabla(){
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimientos_parques_all'
    let body = []
    // ------------------------------------
    let respuesta = await Get(ruta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {

        //=====================================================
        body [index]= [
            `${respuesta[index]['nombre_parque']}`,
            `${respuesta[index]['correo']}`,
            `${respuesta[index]['provincia']}`,
            `${respuesta[index]['circunscripcion']}`,
            `${respuesta[index]['estado']}`,
            `<div style="text-align: -webkit-center;"><img src="/IMG/pen-solid.svg" onclick="view_more(${respuesta[index]['id']})"></div>`
        ]
    }
    miTabla.rows.add(body).draw();
}



/*
    ||----------------------------------------------
    || LABORATORIO DE PRUEBAS
    ||----------------------------------------------
*/




async function checked_red(elemento,id){ // FALTAN PEQUEÑOS MENSAJES DEBAJO DE LOS INPUT
    let red = document.querySelector('[data-red_text='+elemento.dataset['depende_red']+']');
    let mensaje_err = null
    //console.log(id)
    //console.log(elemento)
    if (elemento.dataset['registro'] == 'documento') { //VALIDAR DOCUMENTO
        let depende = elemento.dataset['depende']
        let dependencia = document.querySelector('[data-tipo_documento='+depende+']')
        let doc_existente = null
        if (dependencia.options[dependencia.selectedIndex].text == 'cedula') {
            let respuesta = await validacion_cedula_RD(elemento.value)
            if (respuesta == true) {
                doc_existente = await Info_valid('tbl_usuario','documento',id,elemento.value)
                if (doc_existente == true) {
                    elemento.parentElement.classList.remove('estado_red')
                    if (red != null) {
                        red.classList.remove('error_text_show')
                    }
                }else{
                    elemento.parentElement.classList.add('estado_red')
                    if (red != null) {
                        mensaje_err = 'Documento registrado'
                        red.lastElementChild.innerText = mensaje_err
                        red.classList.add('error_text_show')
                    }
                }
            }else if(elemento.value == ''){
                elemento.parentElement.classList.remove('estado_red')
                if (red != null) {
                    red.classList.remove('error_text_show')
                }
            }else{
                elemento.parentElement.classList.add('estado_red')
                if (red != null) {
                    mensaje_err = 'Documento invalido'
                    red.lastElementChild.innerText = mensaje_err
                    red.classList.add('error_text_show')
                }
            }
            //  CONFRIMACION DE ESTADOS
            if (respuesta == true && doc_existente == true) {
                return true
            }else{
                return false
            }
        } else if (dependencia.options[dependencia.selectedIndex].text == 'pasaporte') {
            elemento.parentElement.classList.remove('estado_red')
            if (red != null) {
                red.classList.remove('error_text_show')
            }
            return true
        }else{
            elemento.parentElement.classList.remove('estado_red')
            if (red != null) {
                red.classList.remove('error_text_show')
            }
            return true
        }
    } else if (elemento.dataset['registro'] == 'correo'){ //VALIDAR CORREO PERSONAL
        let respuesta = await validar_correo_electronico(elemento.value)
        if (respuesta == true){
            doc_existente = await Info_valid('tbl_parques','correo',id,elemento.value)
            if (doc_existente == true) {
                elemento.classList.remove('estado_red')
                if (red != null) {
                    red.classList.remove('error_text_show')
                }
            }else{
                elemento.classList.add('estado_red')
                if (red != null) {
                    mensaje_err = 'Correo registrado'
                    red.lastElementChild.innerText = mensaje_err
                    red.classList.add('error_text_show')
                }
            }
        }else if(elemento.value == ''){
            elemento.classList.remove('estado_red')
            if (red != null) {
                red.classList.remove('error_text_show')
            }
        }else{
            elemento.classList.add('estado_red')
            if (red != null) {
                mensaje_err = 'Correo invalido'
                red.lastElementChild.innerText = mensaje_err
                red.classList.add('error_text_show')
            }
        }
        //  CONFRIMACION DE ESTADOS
        if (respuesta == true && doc_existente == true) {
            return true
        }else{
            return false
        }
        //==================================
    }else if (elemento.dataset['registro'] == 'celular') { //VALIDAR CELULAR PERSONAL
        let respuesta = await validar_celular(elemento)
        if (respuesta == true){
            //elemento.classList.remove('estado_red')
            doc_existente = await Info_valid('tbl_telefonos_por_parque','telefono',id,elemento.value)
            //console.log(id)
            if (doc_existente == true) {
                elemento.classList.remove('estado_red')
                if (red != null) {
                    red.classList.remove('error_text_show')
                }
            }else{
                elemento.classList.add('estado_red')
                if (red != null) {
                    mensaje_err = 'Celular registrado'
                    red.lastElementChild.innerText = mensaje_err
                    red.classList.add('error_text_show')
                }
            }
        }else if(elemento.value == ''){
            elemento.classList.remove('estado_red')
            if (red != null) {
                red.classList.remove('error_text_show')
            }
        }else{
            elemento.classList.add('estado_red')
            if (red != null) {
                mensaje_err = 'Celular invalido'
                red.lastElementChild.innerText = mensaje_err
                red.classList.add('error_text_show')
            }        
        }
        //  CONFRIMACION DE ESTADOS
        if (respuesta == true && doc_existente == true) {
            return true
        }else{
            return false
        }
        //==================================
    }else if (elemento.dataset['registro'] == 'usuario') { //VALIDAR USUARIO PERSONAL
        //let respuesta = await validar_celular(elemento)
        let respuesta = true
        //console.log("Validando usuario")
        if (respuesta == true){
            //elemento.classList.remove('estado_red')
            doc_existente = await Info_valid('tbl_usuario','usuario',id,elemento.value)
            if (doc_existente == true) {
                elemento.classList.remove('estado_red')
                if (red != null) {
                    red.classList.remove('error_text_show')
                }
            }else{
                elemento.classList.add('estado_red')
                if (red != null) {
                    mensaje_err = 'Usuario registrado'
                    red.lastElementChild.innerText = mensaje_err
                    red.classList.add('error_text_show')
                }
            }
        }else if(elemento.value == ''){
            elemento.classList.remove('estado_red')
            if (red != null) {
                red.classList.remove('error_text_show')
            }
        }else{
            elemento.classList.add('estado_red')
            if (red != null) {
                mensaje_err = 'Usuario invalido'
                red.lastElementChild.innerText = mensaje_err
                red.classList.add('error_text_show')
            }
        }
        // CONFRIMACION DE ESTADOS
        if (respuesta == true && doc_existente == true) {
            return true
        }else{
            return false
        }
        //==================================
    }else{
        //console.log("Mantenimiento desconocido")
    }
}

function reset_text_red(){
    let error_mens = document.querySelectorAll('.error_text_show')
    let red = document.querySelectorAll('.estado_red')
    error_mens.forEach(element => {
        element.classList.remove('error_text_show')
    });
    red.forEach(element => {
        element.classList.remove('estado_red')
    });
}

/*
    ||================================
    || VALIDACION DE INFORMACION EXISTENTE
    ||================================
*/
/*
    1- documento{
        origenes{
            1. tbl_solicitantes - documento
            2. tbl_usuario - documento
        }
    }
    2- celular {
        origenes{
            1. tbl_solicitantes - celular
            2. tbl_usuarios - telefono
            3. tbl_telefonos_por_parque - telefono
        }
    }
    3- correo{
        origenes{
            1. tbl_parques - correo
            2. tbl_usuario - correo
            3. tbl_solicitantes - correo
        }
    }
    4- usuario{
        origenes{
            2. tbl_usuario - usuario
        }
    }
*/

async function Info_valid(origen,tipo,id,info){
    let ruta = '/validar_info_existente'
    let body = {
        'origen': origen,
        'tipo':tipo,
        'id':id,
        'info':info
    }
    //1. True - Permitir registro (No existen iguales)
    //2. False - No permitir (Existencias registradas)
    let respuesta = await Post(ruta,body)
    //console.log(respuesta)
    if (respuesta['existe'] == false) {
        //console.log("Permitir registro")
        return true
    }else if(respuesta['existe'] == true){
        //console.log("Verifiaciones adicionales")
        if (respuesta['patch'] == true) {
            //console.log("Permitir actualizacion")
            return true
        }else if (respuesta['patch'] == false){
            //console.log("No permitir actualizacion")
            //+++++++++++++++++++++++++++++++++
            if (origen == 'tbl_telefonos_por_parque') {
                //console.log(origen)
                //console.log(respuesta)
                //console.log('Validacion adicional')
                if (respuesta['respuesta'][0]['info_existente']['id_parque'] == id) {
                    return true
                }else{
                    return false
                }
            }else{
                return false
            }
            //+++++++++++++++++++++++++++++++++
            //return false
        }else{
            //console.log("Respuesta desconocida")
            return false
        }
    }else{
        //console.log("Respuesta desconocida")
        return false
    }
}