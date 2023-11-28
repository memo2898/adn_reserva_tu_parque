console.log("Quick valid - conectado")


/*
    ||===========================
    || VALIDACIONES ESTANDAR - FORMULARIOS
    ||===========================
*/


/*
    ||----Solo permitir entrada de numeros
        Respuestas{
            1. True - Cedula valido
            2. False - Cedula invalido
            3. Invalido - Cedula no valida para revision
        }
    ||----Solo permitir numeros [END]
*/
async function soloNumeros(evt) { //SOLO PERMITIR NUMEROS POR FUNCION
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        if (evt.preventDefault) {
            evt.preventDefault();
        } 
        else {
            evt.returnValue = false;
        }
    }
}


/*
    ||----Validar cedula dominicana
        Respuestas{
            1. True - Cedula valido
            2. False - Cedula invalido
            3. Invalido - Cedula no valida para revision
        }
    ||----Validar estructura [END]
*/
async function validacion_cedula_RD(Document){
    let ced = Document
    let Validacion = null
    //-----------------------
    var c = ced.replace(/-/g,'');  
    var cedula = c.substr(0, c.length - 1);  
    var verificador = c.substr(c.length - 1, 1);  
    var suma = 0;
    if(ced.length < 11) {
        return ('invalido')
        }  
    for (i=0; i < cedula.length; i++) {  
        mod = "";  
            if((i % 2) == 0){mod = 1} else {mod = 2}  
            res = cedula.substr(i,1) * mod;  
            if (res > 9) {  
                res = res.toString();  
                uno = res.substr(0,1);  
                dos = res.substr(1,1);  
                res = eval(uno) + eval(dos);  
            }  
            suma += eval(res);  
    }  
    el_numero = (10 - (suma % 10)) % 10;  
    if (el_numero == verificador && cedula.substr(0,3) != "000") {  
        Validacion = true;
        return Validacion
    }  
    else{  
        Validacion = false
        return Validacion
    }  
}


/*
    ||----Validar estructura para el correo electronico
        1. True - Correo valido
        2. False - Correo invalido
    ||----Validar estructura [END]
*/
async function validar_correo_electronico(correo){
    var patronCorreo = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (patronCorreo.test(correo)) {
        return true
    }else{
        return false
    }
}


/*
    ||----Librerias necesarias por HTML
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/css/intlTelInput.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/intlTelInput.min.js"></script>
    ||----Librerias [END]

    ||----Ejemplo de ejecucion por medio de JS insertado directamente en HTML
        <script>
            libreria_celulares('phone') // EJEMPLO DE FUNCIONALIDAD
        </script>
    ||----Ejemplo de ejecucion [END]
*/
async function libreria_celulares(id) {
    const phoneInputField = document.querySelector("#"+id);
    const phoneInput = window.intlTelInput(phoneInputField, {
        initialCountry: "do",
        preferredCountries: ["do","us"],
        utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
    });
    //return phoneInput
}


async function validar_celular(elemento) { //CON LA LIBRERIA
    //console.log(elemento)
    if (elemento['id'] == 'phone') {
        //console.log("1ro")
        if (phoneInput.isValidNumber()) {
            return true
        } else {
            return false
        }
    }else if (elemento['id'] == 'phone_2') {
        //console.log("2do")
        if (phoneInput_2.isValidNumber()) {
            return true
        } else {
            return false
        }
    }else{
        //console.log("Desconocido")
        return false
    }
}

/*
    ||===========================
    || VALIDACIONES ESTANDAR - LABORATORIO
    ||===========================
*/





/*
    ||===========================
    || DATASET PERSONALIZADOS
    ||===========================
*/

/*
document.querySelectorAll('[data-validar=documento_RD]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        console.log(this)
        console.log(this.dataset)
    });
});
*/


/*
    ||----Solo permitir entrada de numeros por medio del dataset
    ||----Solo permitir numeros [END]
*/
document.querySelectorAll('[data-validar=solonum]').forEach(function(elemento) {
    elemento.addEventListener('input', function() {
        var inputValue = this.value;
        this.value = inputValue.replace(/[^0-9]/g, '');
    });
});



/*
    ||===========================
    || PRUEBAS DE DATASET
    ||===========================
*/
//console.log(this)
//console.log(this.dataset)



/*
document.querySelectorAll('[data-validar=documento_RD]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        console.log(this)
    });
    //soloNumeros(this)
});
*/


/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', function(evt) {
        var inputValue = this.value;
        var lastChar = inputValue.slice(-1);
        if (isNaN(lastChar) || lastChar < '0' || lastChar > '9') {
            this.value = inputValue.slice(0, -1);
        }
    });
    elemento.addEventListener('paste', function(evt) {
        var clipboardData = evt.clipboardData || window.clipboardData;
        var pastedText = clipboardData.getData('text');
        if (/[^\d]/.test(pastedText)) {
            evt.preventDefault();
        }
    });
});
*/



/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        if (this.dataset.validar == 'documento_rd') {
            let p = await Validacion_cedula_RD(this.value)
            console.log(p)
        }else{
            console.log("Indefinido")
        }
        console.log("================")
    });
});
*/
/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        //console.log(this)
        soloNumeros(this)
    });
});
*/


/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function(evt) {
        //const teclaPulsada = evt.data;
        //// Muestra la tecla en la consola
        //console.log('Tecla pulsada:', teclaPulsada);    
        console.log(evt)
        //soloNumeros(evt)
    });
});
*/

/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function() {
        // Crea un evento de teclado
        var keyboardEvent = new KeyboardEvent('keydown', {
            key: '0',  // La tecla que desees simular, en este caso '0'
            code: 'Digit0', // El código de tecla asociado a '0'
            keyCode: 48,  // El código de tecla para '0' en la tabla ASCII
            which: 48,   // El código de tecla para '0' en la tabla ASCII
        });
        // Muestra el evento en la consola
        console.log('Keyboard Event:', keyboardEvent);
        // Desencadena el evento en el elemento
        this.dispatchEvent(keyboardEvent);
    });
});
*/
/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function(event) {
        var inputValue = this.value;
        var lastChar = inputValue.slice(-1);
        var keyboardEvent = new KeyboardEvent('keydown', {
            key: lastChar,
            code: 'Key' + lastChar,
            keyCode: lastChar.charCodeAt(0),
            which: lastChar.charCodeAt(0)
        });
        console.log(keyboardEvent)
    });
});
*/


/*
document.querySelectorAll('[data-validar]').forEach(function(elemento) {
    elemento.addEventListener('input', async function(event) {
        var inputValue = this.value;
        var lastChar = inputValue.slice(-1);
        var keyboardEvent = new KeyboardEvent('keydown', {
            key: lastChar,
            code: 'Key' + lastChar,
            keyCode: lastChar.charCodeAt(0),
            which: lastChar.charCodeAt(0)
        });
        evt = keyboardEvent
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (evt.preventDefault) {
                evt.preventDefault();
                console.log("1")
            } 
            else {
                evt.returnValue = false;
                console.log("2")
            }
        }
    });
});
*/




/*
const input = document.querySelectorAll('.input_registro')[0]
input.addEventListener('input', function() {
    // Accede al atributo personalizado "data-accion"
    const accion = input.dataset['accion'];
    // Verifica el valor del atributo personalizado
    if (accion === 'ejecutar') {
      // Ejecuta la función deseada cuando se activa el input
        miFuncionPersonalizada();
    }
});
*/

/*
document.querySelectorAll('.input_registro')[0].addEventListener('input', function() {
    let accion = this.dataset.accion;
    if (accion === 'ejecutar') {
        miFuncionPersonalizada();
    }
});
*/



/*
// VERSION CORTA
document.querySelectorAll('[data-accion]')[0].addEventListener('input', function() {
    console.log(this)
});
*/


/*
document.querySelectorAll('[data-accion]')[0].addEventListener('input', function() {
    console.log(this)
    let accion = this.dataset.accion;
    if (accion === 'ejecutar') {
        miFuncionPersonalizada();
    }
});
*/

/*
function miFuncionPersonalizada() {
    console.log('Acciones personalizadas');
}
*/

/*
document.querySelectorAll('[data-accion]').forEach(function(elemento) {
    elemento.addEventListener('input', function() {
        const accion = elemento.dataset.accion;
        const etiqueta = elemento.tagName;
        console.log(`Elemento con data-accion "${accion}" en una etiqueta "${etiqueta}"`);
    });
});
*/

//-----------------
/*
document.querySelectorAll('[data-accion=ejecutar]').forEach(function(elemento) {
    elemento.addEventListener('input', function() {
        console.log(this)
    });
});
*/
//document.querySelectorAll('[data-accion=ejecutar]')








/*
    ||========================================================
    || INTERMEDIARIO LOCAL - EJEMPLO PRACTICO
    ||========================================================
*/


/*
    let input = document.querySelectorAll(".input_data")
    for (const element of input) {
        if (element.value.trim() != '') {
            if (element.dataset['registro'] == 'documento') {
                estado.push(await checked_red(element));
            } else if (element.dataset['registro'] == 'correo') {
                estado.push(await checked_red(element));
            } else if (element.dataset['registro'] == 'celular') {
                estado.push(await checked_red(element));
            } else {
                estado.push(true);
                element.classList.remove('estado_red');
            }
        } else {
            if (element.dataset['registro'] == 'documento') {
                element.parentElement.classList.add('estado_red');
            } else {
                estado.push(false);
                element.classList.add('estado_red');
            }
        }
    }
*/




/*
async function checked_red(elemento){
    if (elemento.dataset['registro'] == 'documento') { //VALIDAR DOCUMENTO
        let respuesta = await validacion_cedula_RD(elemento.value)
        if (respuesta == true) {
            elemento.parentElement.classList.remove('estado_red')
        }else if(elemento.value == ''){
            elemento.parentElement.classList.remove('estado_red')
        }else{
            elemento.parentElement.classList.add('estado_red')
        }
    } else if (elemento.dataset['registro'] == 'correo'){ //VALIDAR CORREO PERSONAL
        let respuesta = await validar_correo_electronico(elemento.value)
        if (respuesta == true){
            elemento.classList.remove('estado_red')
        }else if(elemento.value == ''){
            elemento.classList.remove('estado_red')
        }else{
            elemento.classList.add('estado_red')
        }
    }else if (elemento.dataset['registro'] == 'celular') { //VALIDAR CELULAR PERSONAL
        let respuesta = await validar_celular()
        if (respuesta == true){
            elemento.classList.remove('estado_red')
        }else if(elemento.value == ''){
            elemento.classList.remove('estado_red')
        }else{
            elemento.classList.add('estado_red')
        }
    }else{
        console.log("Mantenimiento desconocido")
    }
}
*/


/*
    ||----CSS 
        .estado_red{
            outline: 1px solid red !important;
        }
    ||----CSS [END]
*/


