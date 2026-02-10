function onKeyDownHandler(event) { //1. DETECTAR ENTRE LOS INPUTS
    var codigo = event.which || event.keyCode;
    if(codigo === 13){
        Acceso()
    }
}


async function Acceso(){ // 2. CONFIRMACION DE USUARIO
    input_user=document.querySelector("#usuario").value;
    input_pass=document.querySelector("#password").value;
    let mensaje_error = document.querySelector("#mensaje-error")
    mensaje_error.innerText = ''
    if (validar_campos() == true) {
        let url = "/Reservaciones_cuenta"
        body = {
            'usuario': input_user,
            'password': input_pass,
        }
        let respuesta = await post(url,body) //2.1 BUSQUEDA DE USUARIO
        if (respuesta['estado'] == 'activo') {
            let pass = await descrypt(respuesta['password'])
            if (pass == input_pass) {
                ready()
            }else{
                add_red()
                mensaje_error.innerText = 'Algun dato erroneo'
            }
        }else{
            add_red()
            mensaje_error.innerText = 'Algun dato erroneo'
        }
        async function ready(){
            let ruta = '/reservaciones_sesion'
            respuesta = null
            respuesta = await post(ruta,body)
            if (respuesta == true) {
                window.location.href = "/inicio";
            }else{
                add_red()
                mensaje_error.innerText = 'Algun dato erroneo'    
            }
        }
    }else{
        add_red()
        mensaje_error.innerText = 'Algun dato erroneo'
    }
}



function validar_campos(){ //2.extension VALIDACION PREVIA DE CAMPOS
    if(input_user == "" || input_pass == ""){ //CONFIRMAR LOS CAMPOS
        add_red()
        return false;
    }
    else{
        remove_all_red();
        return true;
    }
}



//=========================================================================
// PETICIONES
//=========================================================================


async function post(url,body){ //ELEMENTO - POST FLEXIBLE
    document.querySelector("#mensaje-error").innerText=""
    return new Promise((resolve, reject) => {
        axios.post(url,body)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            MODerror(error['response'], 'post')
        });
    })
}


//=========================================================================
// MODERADOR DE ERRORES
//=========================================================================


function MODerror(error, origen){ //ELEMENTO - MODERADOR DE ERRORES
    let mensaje_error = document.querySelector("#mensaje-error")
    //console.log("Origen - " + origen) //DETECTAR ORIGEN DEL ERROR
    //console.log("Razon del error - " + error['data']['error']) //MENSAJE DEL ERROR
    //console.log("Razon del error - " + error['status']) //CODIGO DEL ERROR
    if (error['status'] == 404) { //PROCESADOR DE ERRORES
        mensaje_error.innerText = 'Algun dato erroneo'
        add_red()
    }else{
        mensaje_error.innerText = 'Algun dato erroneo'
        add_red()
    }
}


//=========================================================================
// CONTROL DE ESTILOS
//=========================================================================


function add_red(){ //ELEMENTO - ESTILO
    document.querySelector('#usuario').classList.add("input_red")
    document.querySelector('#password').classList.add("input_red")
}
/*
function remove_red(input){ //ELEMENTO - ESTILO
    document.querySelector(input).classList.remove("input_red")
}
*/
function remove_all_red(){ //ELEMENTO - ESTILO
    document.querySelector("#usuario").classList.remove("input_red")
    document.querySelector("#password").classList.remove("input_red")
}


