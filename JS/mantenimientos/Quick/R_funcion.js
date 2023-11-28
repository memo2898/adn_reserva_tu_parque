console.log("Funciones rapidas conectada")

//import { ruta } from "./Crypto.js";
//console.log(ruta)

/*
import { ex_function } from "./Crypto.js";
(async () => {
    const { R1, R2, R3 } = await ex_function();
    const result1 = R1();
    const result2 = R2();
    const result3 = R3();
    console.log(result1, result2, result3);
})();
*/


/*
    ||=================================
    || CONVERSION DE 24 A 12H
    ||=================================
*/

async function R_convertir_12h(horario) {
    let [horas, minutos] = horario.split(':');
    let horaNum = parseInt(horas, 10);
    let periodo = horaNum >= 12 ? 'PM' : 'AM';
    let hora12 = horaNum % 12 || 12;
    let hora12Str = `${hora12}:${minutos} ${periodo}`;
    return hora12Str;
}




/*
    ||=================================
    || CADENA ALEATORIA
    ||=================================
*/

async function Randomizar(longitud) {
    var caracteres = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var codigoAleatorio = '';
    for (var i = 0; i < longitud; i++) {
    var indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    codigoAleatorio += caracteres.charAt(indiceAleatorio);
    }
    return codigoAleatorio;
}

// 40242151062



/*
    ||=================================
    || ENCRIPTACION
    ||=================================
*/


async function encrypt(value){
    let ruta = '/key'
    let key = await Get(ruta)
    let ciphertext = CryptoJS.AES.encrypt(value, key).toString();
    return (ciphertext)
}


async function descrypt(value){
    let ruta = '/key'
    let key = await Get(ruta)
    let bytes  = CryptoJS.AES.decrypt(value, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return (originalText)
}

