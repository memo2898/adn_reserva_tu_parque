async function Get(ruta){ // ESTRUCTURA - GET
    return new Promise((resolve, reject) => {
        axios.get(ruta)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}

async function Post(url,body){ // ESTRUCTURA - POST
    return new Promise((resolve, reject) => {
        axios.post(url,body)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}


async function Patch(url,body){ // ESTRUCTURA - PATCH
    return new Promise((resolve, reject) => {
        axios.patch(url,body)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}

async function Delete(ruta){ // ESTRUCTURA - GET
    return new Promise((resolve, reject) => {
        axios.delete(ruta)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}



/*
    ||==========================================================
    ||GESTION DE SESIONES
    ||==========================================================
*/


/*
async function Crear(){
    let ruta = '/make_sesion'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}
*/

async function visualizar(){
    let ruta = '/view_sesion'
    let respuesta = await Get(ruta)
    //console.log(respuesta)
    return respuesta['usuario']
}

/*
async function eliminar(){
    let ruta = '/eliminar_sesion'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}

async function Sesion_actual(){
    let ruta = '/session_live'
    let respuesta = await Get(ruta)
    console.log(respuesta)
}
*/