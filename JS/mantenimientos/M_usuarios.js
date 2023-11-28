//let user = 'Admin'
let default_img = '/IMG/user.png'
let packed = null
check = false

/*const cryptojs = requiere('./crypto.js');*/

//const password = 'tu_contraseña';
//const salt = 'tu_sal'; // Recupera la sal desde tu base de datos
//const encryptedPassword = 'tu_contraseña_encriptada'; // Recupera la contraseña encriptada desde tu base de datos

//const key = deriveKey(password, salt);

/*
    ||================================
    || PROBANDO ENCRIPTADO
    ||================================
*/


function Try_3(value){
    let ciphertext = CryptoJS.AES.encrypt(value, 'secret key 123').toString();
    console.log('Encriptado - '+ciphertext)
    let bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    console.log("Bytes - " + bytes)
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    console.log(originalText);
}


async function encriptar_text(value){
    let respuesta = await encrypt(value)
    console.log(respuesta)
}


async function desencriptar_text(value){
    let respuesta = await descrypt(value)
    console.log(respuesta)
}


async function Key(){
    let ruta = '/key'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}


/*
    ||================================
    || PROBANDO ENCRIPTADO - END
    ||================================
*/


async function view_more(id){
    document.querySelector(".btn_confirmar_modal").setAttribute("onclick", "guardar_edicion('"+id+"')");
    document.querySelector(".btn_confirmar_eliminacion").setAttribute("onclick", "eliminar('"+id+"')");
    document.querySelector(".btn_reset_confirmacion").setAttribute("onclick", "restablecer_password('"+id+"')");
    document.querySelector('[data-depende_red=red_B3]').setAttribute('data-identify',+id)
    document.querySelector('[data-depende_red=red_B4]').setAttribute('data-identify',+id)
    document.querySelector('[data-depende_red=red_B5]').setAttribute('data-identify',+id)
    document.querySelector('[data-depende_red=red_B6]').setAttribute('data-identify',+id)
    let input = document.querySelectorAll(".input_data_user");
    let img = document.querySelectorAll('.view_img')[0]
    let extra = document.querySelectorAll(".input_data_user_extra");
    let ruta = '/mantenimientos_usuarios_preciso/'+id
    //--------------------------------
    //console.log(id)
    //--------------------------------
    let respuesta = await Get(ruta);
    //console.log(respuesta)
    packed = null
    packed = respuesta
    //console.log(respuesta['usuario']['imagen'])
    if ( respuesta['usuario']['imagen'] != 'default' && respuesta['usuario']['imagen'] != null) {
        img.src = respuesta['usuario']['imagen']
    }
    else{
        img.src = default_img
    }
    extra[0].innerText = respuesta['usuario']['nombre'] //nombre HEADER
    extra[1].innerText = respuesta['permisos']['posicion'] //nombre HEADER
    extra[2].innerText = respuesta['usuario']['estado'] //nombre HEADER
    //-----------------------------
    input[0].value = respuesta['usuario']['nombre'] //nombre
    input[1].value = respuesta['usuario']['apellido'] //apellido
    input[3].value = respuesta['usuario']['documento'] //documento
    input[4].value = respuesta['usuario']['telefono'] //celular
    input[5].value = respuesta['usuario']['correo'] //correo
    input[6].value = respuesta['usuario']['usuario'] //nombre de usuario
    //input[7].value = respuesta['usuario']['password'] //contraseña
    //======================================================================
    for (let index = 0; index < input[2].options.length; index++) { //FOR PARQUES
        if (respuesta['usuario']['id_tipo_doc'] == input[2].options[index].value) {
            input[2].options[index].selected = true
        }
    }
    //======================================================================
    for (let index = 0; index < input[8].options.length; index++) { //FOR PARQUES
        if (respuesta['parque']['id'] == input[8].options[index].value) {
            input[8].options[index].selected = true
        }
    }
    //======================================================================
    for (let index = 0; index < input[9].options.length; index++) { // FOR ROL
        if (respuesta['permisos']['id'] == input[9].options[index].value) {
            input[9].options[index].selected = true
        }
    }
    //======================================================================
    if (input[10].options[0].value == respuesta['usuario']['estado']) { // Seleccion de validacion
        input[10].options[0].selected = true
    }else{
        input[10].options[1].selected = true
    }
    document.querySelector(".section_main").style.display = 'none'
    document.querySelector(".section_more").style.display = 'block'
}
//



//===================================
// RESETEOS - INICIO
//===================================


async function reset_edit(){
    let input = document.querySelectorAll(".input_data_user");
    let img = document.querySelectorAll('.view_img')[0]
    let extra = document.querySelectorAll(".input_data_user_extra");
    input.forEach(element => {
        if (element.id == 'rest_pass') {}
        else{
            element.value = ''
        }
    });
    input[2].options[0].selected = true
    input[8].options[0].selected = true
    input[9].options[0].selected = true
    input[10].options[0].selected = true
    img.src = default_img
    extra.forEach(element => {
        element.innerText = '***'
    });
    File_img = null
    //+++++++++++++++++++
    let error_mens = document.querySelectorAll('.error_text_show')
    let red = document.querySelectorAll('.estado_red')
    error_mens.forEach(element => {
        element.classList.remove('error_text_show')
    });
    red.forEach(element => {
        element.classList.remove('estado_red')
    });
}

function reset_modal_edit(){
    let input = document.querySelectorAll(".input_data")
    let img = document.querySelectorAll('.view_img')[1];
    File_img_2 = null
    input.forEach(element => {
        element.value = ''
    });
    input[2].options[0].selected = true
    //---------------------------------
    input[7].options[0].selected = true
    input[8].options[0].selected = true
    img.src = default_img
    //++++++++++++++++
    let error_mens = document.querySelectorAll('.error_text_show')
    let red = document.querySelectorAll('.estado_red')
    error_mens.forEach(element => {
        element.classList.remove('error_text_show')
    });
    red.forEach(element => {
        element.classList.remove('estado_red')
    });
}


function reset_input(){
    //console.log("Reseteando")
    let input = document.querySelectorAll(".input_data_user")
    let img = document.querySelectorAll('.view_img')[0]
    let extra = document.querySelectorAll(".input_data_user_extra");
    //---------------------------------------------
    if ( packed['usuario']['imagen'] != 'default' && packed['usuario']['imagen'] != null) {
        img.src = packed['usuario']['imagen']
    }
    else{
        img.src = default_img
    }
    extra[0].innerText = packed['usuario']['nombre'] //nombre HEADER
    extra[1].innerText = packed['permisos']['posicion'] //nombre HEADER
    extra[2].innerText = packed['usuario']['estado'] //nombre HEADER
    //-----------------------------
    input[0].value = packed['usuario']['nombre'] //nombre
    input[1].value = packed['usuario']['apellido'] //apellido
    input[3].value = packed['usuario']['documento'] //documento
    input[4].value = packed['usuario']['telefono'] //celular
    input[5].value = packed['usuario']['correo'] //correo
    input[6].value = packed['usuario']['usuario'] //nombre de usuario
    //input[7].value = packed['usuario']['password'] //contraseña
    //======================================================================
    for (let index = 0; index < input[2].options.length; index++) { //FOR PARQUES
        if (packed['usuario']['id_tipo_doc'] == input[2].options[index].value) {
            input[2].options[index].selected = true
        }
    }
    //======================================================================
    for (let index = 0; index < input[8].options.length; index++) { //FOR PARQUES
        if (packed['parque']['id'] == input[8].options[index].value) {
            input[8].options[index].selected = true
        }
    }
    //======================================================================
    for (let index = 0; index < input[9].options.length; index++) { // FOR ROL
        if (packed['permisos']['id'] == input[9].options[index].value) {
            input[9].options[index].selected = true
        }
    }
    //======================================================================
    if (input[10].options[0].value == packed['usuario']['estado']) { // Seleccion de validacion
        input[10].options[0].selected = true
    }else{
        input[10].options[1].selected = true
    }
    //---------------------------------------------
}

//===================================
// RESETEOS - FIN
//===================================




//===================================
// ACCIONES
//===================================
async function habilitar_edicion(){
    manage_btn_actions('open')
}

function manage_input(estado){
    let campos = document.querySelectorAll(".input_data_user");
    campos.forEach(element => {
        element.disabled = estado
    });
}


async function manage_btn_actions(estado){
    if (estado == 'open') { // HABILITAR EDICION
        document.querySelector(".btn_edit").style.display = 'none'
        document.querySelector(".btn_guardar").style.display = 'block'
        document.querySelector(".upload_label_1").style.visibility = 'visible'
        document.querySelector("#file_upload_1").disabled = false
        document.querySelector('#rest_pass').classList.add('active_reset')
        manage_input(false)
    } else if(estado == 'close'){ // ELIMINAR EDICION
        document.querySelector(".btn_guardar").style.display = 'none'
        document.querySelector(".btn_edit").style.display = 'block'
        document.querySelector(".upload_label_1").style.visibility = 'hidden'
        document.querySelector("#file_upload_1").disabled = true
        document.querySelector('#rest_pass').classList.remove('active_reset')
        manage_input(true)
    }
}

//--------------------------------
async function guardar_edicion(id){
    let campos = document.querySelectorAll(".input_data_user");
    let token = await visualizar()
    let estado = []
    check = false
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
        //console.log("Acceso")
        for (const element of campos) {
            //+++++++++++++++++++++++++++++++
            let red = document.querySelector('[data-red_text='+element.dataset['depende_red']+']');
            let mensaje_err = null
            //+++++++++++++++++++++++++++++++
            if (element.value.trim() != '') {
                if (element.dataset['registro'] == 'documento') {
                    estado.push(await checked_red(element,id));
                } else if (element.dataset['registro'] == 'correo') {
                    estado.push(await checked_red(element,id));
                } else if (element.dataset['registro'] == 'celular') {
                    estado.push(await checked_red(element,id));
                } else if (element.dataset['registro'] == 'usuario') {
                    estado.push(await checked_red(element, id));
                } else {
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
                        red.classList.add('error_text_show')
                        red.lastElementChild.innerText = mensaje_err
                    }
                    
                }else {
                    estado.push(false);
                    element.classList.add('estado_red');
                    
                    if (red != null) {
                        red.classList.add('error_text_show')
                        red.lastElementChild.innerText = mensaje_err
                    }
                    
                }
            }
        }
        //console.log(estado)
        let end = estado.every((valor) => valor === true);
        if (end) {
            //console.log("Accion")
            ready()
        }else{
            show_modal('Formulario invalido', 'Informacion invalida')
            document.querySelector(".modal_confirmacion").style.display = 'none'
        }
    }else{
        show_modal('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        document.querySelector(".modal_confirmacion").style.display = 'none'
    }
    //==================================
    async function ready(){
        let ruta = '/mantenimientos_usuarios/'+id
        //cerrar_confirmacion()
        document.querySelector(".modal_confirmacion").style.display = 'none'
        manage_btn_actions('close')
        let body = {
            'nombre': campos[0].value,
            'apellido': campos[1].value,
            'id_tipo_doc': campos[2].value,
            'documento': campos[3].value,
            'telefono': campos[4].value,
            'correo': campos[5].value,
            //--------------------------------
            'imagen': File_img,
            //--------------------------------
            'usuario': campos[6].value,
            //'password': campos[7].value,
            'id_parque': campos[8].value,
            'id_user_type': campos[9].value,
            'estado': campos[10].value,
            //--------------------------------
            'responsable': token['usuario'],
        }
        //console.log(body)
        //--------------------------------
        let respuesta = await Patch(ruta,body)
        //console.log(respuesta)
        //-------------------------------------------
        view_more(id)
        Actualizar_tabla()
    }
}

async function restablecer_password(id){
    let token = await visualizar()
    check = false
    if (token['permisos'] == 'administrador'){
        ready()
    }else{
        show_modal('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
        show_reset('none')
    }
    async function ready(){
        //console.log("Reseteando - "+id)
        let ruta = '/correo-reset'
        let password = 'ADN-'+await Randomizar(6)
        //----------------------------------
        //console.log("Contraseña - " + password)
        password = await encrypt(password);
        //console.log('Contraseña encrypt - ' + password)
        //----------------------------------
        let body = {
            'id':id,
            'password': password,
        }
        let respuesta = await Post(ruta,body)
        console.log(respuesta)
        if (respuesta['estado'] == true) {
            show_modal('Usuario actualizado', 'La contraseña del usuario a sido reseteada exitosamente')
        }else{
            show_modal('Error inesperado', 'No se ha podido completar esta accion')
        }
        show_reset('none')
    }
}

function show_reset(estado){
    document.querySelector('.confirmar_reset').style.display = estado
}
/*
function agregar_tabla(){
    var nuevaFila = [
        'Nuevo Usuario',   // Usuario
        'Nuevo Rol',       // Rol
        'Nuevo Parque',    // Parque
        'Nuevo Estado',    // Estado
        '<img src="/IMG/pen-solid.svg" onclick="view_more()">'
    ];

    var miTabla = $('#myTable').DataTable();
    miTabla.row.add(nuevaFila).draw();
}
*/


async function Actualizar_tabla(){
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimientos_usuarios_js'
    let body = []
    //console.log("Actualizando")
    // ------------------------------------
    let respuesta = await Get(ruta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {
        //console.log(respuesta[index])
        /*
        if (respuesta[index]['permisos'] == 'administrador') {
            console.log("No mostrar")
        }
        body [index]= [
            respuesta[index]['usuario'], respuesta[index]['posicion'], respuesta[index]['parque'], respuesta[index]['estado'], '<img src="/IMG/pen-solid.svg" onclick="view_more('+respuesta[index]['id']+')">'
        ]
        */
        if (respuesta[index]['permisos'] == 'administrador') {
            //console.log("No mostrar")
        }else{
            body.push([
                respuesta[index]['usuario'], respuesta[index]['posicion'], respuesta[index]['parque'], respuesta[index]['estado'], '<img src="/IMG/pen-solid.svg" onclick="view_more('+respuesta[index]['id']+')">'
            ])
        }
    }
    miTabla.rows.add(body).draw();
    //console.log("Actualizado tabla")
}

//let input = document.querySelectorAll(".input_data")
//input[2].options[input[2].selectedIndex]
//input[2].options[input[2].selectedIndex].value
//input[2].options[input[2].selectedIndex].text
//let doc = null
async function guardar(){ // REGISTRO DE USUARIO
    let input = document.querySelectorAll(".input_data")
    let token = await visualizar()
    let estado = []
    check = false
    if (token['permisos'] == 'administrador' || token['permisos'] == 'gestionar'){
        for (const element of input) {
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
                    estado.push(true);
                    /*
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
                    */
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
                    /*
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
                    */
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
        }
    }else{
        show_modal('Accion denegada', 'Su usuario no cuenta con los permisos necesarios')
    }
    //==================================
    async function ready(){
        let ruta = '/mantenimientos_usuarios'
        //+++++++++++++++++++++++++
        let password = 'ADN-'+await Randomizar(6)
        password = await encrypt(password);
        //+++++++++++++++++++++++++
        let body = {
            'nombre':input[0].value,
            'apellido':input[1].value,
            'id_tipo_doc':input[2].value,
            'documento':input[3].value,
            'correo':input[4].value,
            'telefono':input[5].value,
            'usuario':input[6].value,
            //'password':input[7].value,
            'password':password,
            'id_parque':input[7].value,
            'id_user_tipo':input[8].value,
            'imagen':File_img_2,
            'responsable':token['usuario']
        }
        let respuesta = await Post(ruta,body);
        //console.log(respuesta)
        await Actualizar_tabla()
        show_modal('Usuario registrado', 'El nuevo usuario a sido registrado con exito')
        reset_modal_edit()
        closeModal()
    }
}


async function eliminar(id){
    let ruta = "/mantenimientos_usuarios/"+id
    check = false
    //----------------------------------------------
    //console.log("eliminando")
    //console.log(id)
    // ----------------- Necesito discutir la eliminacion
    let respuesta = await Delete(ruta)
    //console.log(respuesta)
    if (respuesta['status'] == 201) {
        await Actualizar_tabla()
        retrocede()
        document.querySelector(".modal_confirmacion").style.display = 'none'
    }
    else{
        //console.log("Error inesperado")
    }

}




//========================================================
function agregar(){ // ABRIR MODAL DE REGISTRO
    document.getElementById("myModal").style.display = "block";
}
function closeModal(){ // ABRIR MODAL DE REGISTRO 
    document.getElementById("myModal").style.display = "none";
    reset_modal_edit()
    remove_border()
}
function remove_border(){ // LIMPIAR OUTLINE
    let input = document.querySelectorAll(".input_data")
    input.forEach(element => {
        if (element.dataset['registro'] == 'documento') {
            element.parentElement.classList.remove('estado_red')
        }else{
            element.classList.remove('estado_red')
        }
    });
}
//========================================================
function abrir_confirmacion(origen){ // ABRIR CONFIRMACION
    document.querySelector(".section_confirmar_save").style.display = 'none'
    document.querySelector(".section_confirmar_delete").style.display = 'none'
    //----------------------------------------------
    //console.log(origen)
    //----------------------------------------------
    if (origen == 'guardar') {
        document.querySelector(".section_confirmar_save").style.display = 'block'
        document.querySelector(".modal_confirmacion").style.display = 'block'
    }else if(origen == 'eliminar'){
        document.querySelector(".section_confirmar_delete").style.display = 'block'
        document.querySelector(".modal_confirmacion").style.display = 'block'
    }else{
        //console.log("¿...?")
    }
}
function cerrar_confirmacion(){ // CERRAR CONFIRMACION
    //console.log("Cerrar confirmacion")
    document.querySelector(".modal_confirmacion").style.display = 'none'
    manage_btn_actions('close')
    reset_input()
}


//========================================================
async function retrocede(){ // VOLVER A LA PAGINA PRINCIPAL
    document.querySelector(".section_more").style.display = 'none'
    document.querySelector(".section_main").style.display = 'block'
    document.querySelector(".btn_confirmar_modal").removeAttribute("onclick");
    document.querySelector(".btn_reset_confirmacion").removeAttribute("onclick");
    document.querySelector(".btn_confirmar_eliminacion").removeAttribute("onclick");
    //++++++++++++++++++++++++
    document.querySelector('[data-depende_red=red_B3]').removeAttribute('data-identify')
    document.querySelector('[data-depende_red=red_B4]').removeAttribute('data-identify')
    document.querySelector('[data-depende_red=red_B5]').removeAttribute('data-identify')
    document.querySelector('[data-depende_red=red_B6]').removeAttribute('data-identify')
    reset_edit()
    manage_btn_actions('close')
}


/*
    ||======================================
    || TOAST CONTROLLER
    ||======================================
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


//===================================
// EVENLISTENERS
//===================================


window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.getElementById("myModal");
    if (event.target == modal) {
        document.getElementById("myModal").style.display = "none";
    }
});


window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".modal_confirmacion");
    if (event.target == modal) {
        document.querySelector(".modal_confirmacion").style.display = 'none'
    }
});

window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var modal = document.querySelector(".confirmar_reset");
    if (event.target == modal) {
        document.querySelector(".confirmar_reset").style.display = 'none'
    }
});


let File_img = null
document.querySelector('#file_upload_1').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const previewImage = document.querySelectorAll('.view_img')[0];
            previewImage.src = reader.result;
            File_img = reader.result
            //console.log(File_img)
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});


let File_img_2 = null
document.querySelector('#file_upload_2').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const previewImage = document.querySelectorAll('.view_img')[1];
            previewImage.src = reader.result;
            File_img_2 = reader.result
            //console.log(File_img_2)
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});





//===================================
// VALIDADORES
//===================================

/*
async function fix_registro(){
    let input = document.querySelectorAll(".input_data")
    input.forEach(element => {
        console.log(element.value)
        if (element.value.trim() == '') {
            console.log('Vacio')
        }else{
            console.log('Contenido')
        }
        console.log("========")
    });
}
*/

//===================================
// LISTENER - DATASET
//===================================

/*
document.querySelectorAll('.input_data').forEach(function(elemento) {
    elemento.addEventListener('input', function() {
        //console.log(this)
        console.log(this.value)
    });
});
*/


/*
document.querySelectorAll('[data-registro]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        if (this.dataset['registro'] == 'documento') {
            let respuesta = await validacion_cedula_RD(this.value)
            console.log(respuesta)
        }
    });
});
*/


document.querySelectorAll('[data-tipo_documento]').forEach(function(elemento) {
    elemento.addEventListener('change', function() {
        let depende = document.querySelector('[data-depende='+elemento.dataset['tipo_documento']+']')
        //console.log("Cambio en el select")
        //console.log(elemento)
        //console.log(depende)
        elemento.parentElement.classList.remove('estado_red')
        depende.value = ''
    });
});


document.querySelectorAll('[data-registro]').forEach(function(elemento) {
    elemento.addEventListener('change', function() {
        //console.log(this)
        //console.log(this.dataset['identify'])
        if (this.dataset['identify'] != undefined) {
            checked_red(this, this.dataset['identify'])
        }else{
            checked_red(this, null)
        }
    });
});


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
            doc_existente = await Info_valid('tbl_usuario','correo',id,elemento.value)
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
            doc_existente = await Info_valid('tbl_usuario','telefono',id,elemento.value)
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
            return false
        }else{
            //console.log("Respuesta desconocida")
            return false
        }
    }else{
        //console.log("Respuesta desconocida")
        return false
    }
}