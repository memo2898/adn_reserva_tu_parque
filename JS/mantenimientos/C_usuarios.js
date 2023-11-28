/*
async function Try(){
    let ruta = '/user_token/1'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}

async function Try_2(){
    let ruta = '/redirect_json'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}
*/

let default_img = '/IMG/user.png'




revision()
async function revision(){
    let input = document.querySelectorAll('.data_input')
    let input_header = document.querySelectorAll('.data_header')
    let ruta = '/user_packed/'+local_sesion['id']
    let respuesta = await Get(ruta)
    let password = await descrypt(respuesta['password'])
    //===========================================
    if (respuesta['imagen'] != 'default' && respuesta['imagen'] != null) {
        document.querySelectorAll('.view_img')[0].src = respuesta['imagen']
    }else{
        document.querySelectorAll('.view_img')[0].src = default_img
    }
    input_header[0].innerText = respuesta['rol']
    input_header[1].innerText = respuesta['nombre_parque']

    input[0].value = respuesta['nombre']
    input[1].value = respuesta['apellido']
    input[3].value = respuesta['documento']
    input[4].value = respuesta['correo']
    input[5].value = respuesta['celular']
    input[6].value = respuesta['usuario']
    //input[7].value = respuesta['password']
    input[7].value = password;
    for (let index = 0; index < input[2].options.length; index++) {
        if (input[2].options[index].value == respuesta['id_documento']) {
            input[2].options[index].selected = true
        }
    }
}


async function guardar_cambios(){
    let input = document.querySelectorAll('.data_input')
    let ruta = '/configuraciones_usuario/'+local_sesion['id']
    let password = await encrypt(input[7].value)
    let body = {
        'nombre':input[0].value,
        'apellido':input[1].value,
        'tipo_doc':input[2].value,
        'documento':input[3].value,
        'correo':input[4].value,
        'celular':input[5].value,
        'usuario':input[6].value,
        //'password':input[7].value,
        'password':password,
        'imagen':File_img,
    }
    let respuesta = await Patch(ruta,body)
    console.log(respuesta)
}



let File_img = null
document.querySelector('#file_upload_1').addEventListener('change', function(event) {
    let file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const previewImage = document.querySelectorAll('.view_img')[0];
            previewImage.src = reader.result;
            File_img = reader.result
            previewImage.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});





