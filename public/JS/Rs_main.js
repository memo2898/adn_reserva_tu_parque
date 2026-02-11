let position = 1
let fecha = ""
let eventB = ""
let eventF = ""

let user_status = false
let id_park = null
let id_zona = null
let tipo_evento = null
let motivo_evento = null
let responsables_evento = null
let adultos_evento = null
let niños_evento = null
let descripcion_evento = null
let dia_seleccionado = null
let dia_open = true
let email_status = false
let day = 0

//------------------------------//

let Pop = [false,false,false,false,false]
let All = false
//let last = null

//------------------------------//
//-------------------------------
//PRUEBAS CON LAS PETICIONES LARAVEL
//-------------------------------

function qrmake(id){
    //console.log("Empezando")
    let Q = new QRMaker(id);
    //console.log(Q)
    //console.log("Terminado")
}

function Solicitudes_pruebas(){ //PRUEBAS
    
    axios.get('/Azul')
    .then(response => {
        //console.log(response)
        //console.log(response.data)
        //window.location.href = '/email_view/'+R;
    })
    .catch(error => {
        console.log(error);
    });
}


//--------------------------------------------------------------

async function Reservacion(){ //PARTE FINAL
    let code_r = document.querySelector("#code_r")
    document.querySelector(".botones").style.visibility = 'hidden'
    document.querySelector('.Next').removeAttribute('onclick')
    document.querySelector('.Previous').removeAttribute('onclick')

    document.querySelector(".botones_extra").style.visibility = 'hidden'
    document.querySelector('.next_mirror').removeAttribute('onclick')
    document.querySelector('.preview_mirror').removeAttribute('onclick')

    code_r.innerHTML = ``
    axios.post('/Reservaciones_2_post', {
        id_solicitante: id_solicitante,
        id_parque: id_park,
        id_zona: id_zona,
        id_evento: tipo_evento,
        fecha_evento: fecha,
        hora_inicio: eventB,
        hora_fin: eventF,
        motivo_evento: motivo_evento,
        descripcion_evento: descripcion_evento,
        responsables: responsables_evento,
        cantidad_adultos: adultos_evento,
        cantidad_ninos: niños_evento,
        //codigo_reservacion: 'PRB#'+id_solicitante+id_park+id_zona,
        codigo_reservacion: 'PRB#'+id_solicitante+id_park+"-"+fechaActual,
    })
    .then(response => {
        console.log(response.data);
        /*
        code_r.innerHTML = `${response.data["codigo_reservacion"]}`
        document.querySelectorAll(".Carga_icon")[0].style.display = "none"
        document.querySelectorAll(".QRView")[0].style.display = "block"
        */
        //let QR = QRMaker()
        QRMaker(response.data["id"])
        Enviar_correos(response.data["id"])
        setTimeout(() => {
            code_r.innerHTML = response.data["codigo_reservacion"];
            document.querySelectorAll(".Carga_icon")[0].style.display = "none";
            document.querySelectorAll(".QRView")[0].style.display = "block";
        }, Math.floor(Math.random() * 1001) + 2000); // Entre 2 y 3 segundos (2000 y 3000 milisegundos)
    })
    .catch(error => {
        console.log(error);
    });
}


async function Enviar_correos(id){ //PRUEBAS
    let canvas = document.querySelector("#QRdisplay > canvas").toDataURL()
    
        let url="enviar-correo";
        //let id=20;
        //==============================================
        /*
        let cuerpoGuardar={ //IMAGEN QR
            id: id,
            image: canvas
            
        }
        let respuestaQR= await guardarImagenADN(cuerpoGuardar); //CREACION DEL QR
        console.log(respuestaQR)
        */
        //console.log("Esperando")
        //==============================================

        let cuerpo ={ //CORREO ELECTRONICO
            'Reservacion': id,
            'QR':canvas,
        }
        let respuesta= await enviar_post(url,cuerpo); //ENVIANDO EL CORREO
        console.log(respuesta)
    
}





async function guardarImagenADN(cuerpoGuardar){
    return new Promise((resolve, reject) => {
        const url = 'https://adn.gob.do/guardar_base/recibir_qr.php';
        const options ={
            body:JSON.stringify(cuerpoGuardar),
            method:"POST"
        }
        fetch(url, options)
        .then(response => response.json())
        .then (respuesta =>{

            resolve(respuesta)
        })
    })
}






async function enviar_post(url,cuerpo){
    return new Promise((resolve, reject) => {
        axios.post(url,cuerpo)
        .then(response => {
           // console.log(response)
            resolve(response.data)
        })
        .catch(error => {
            console.log(error);
            reject(error)
        });
    })
}

//--------------------------------------------------------------

let R_horario = null
async function horarios_existentes(){ //PRUEBAS
    //return new ((resolve,reject)=>{
        axios.get('/Reservaciones_dia/'+fecha+'/'+id_park)
        .then(response => {
            if (response.data == 404) {
                R_horario = null
            }else{
                R_horario = response.data
            }
        })
        .catch(error => {
            R_horario = null
            reject (error)
        });
    //})
}



function recolor_gris(){
    //console.clear()

    //---------------------------------------------
    packed.forEach(element => {
        element['id']
        document.querySelector("#zn_"+element["id"]).classList
        if (document.querySelector("#zn_"+element["id"]).classList[1] == "Z_grey" || document.querySelector("#zn_"+element["id"]).classList[2] == "Z_grey") {
            document.querySelector("#zn_"+element["id"]).classList.remove("Z_grey")
        }
    });
    //---------------------------------------------
    if (R_horario == null) {
        return
    }
    else{
        R_horario.forEach(element => {
            //console.log("=======================")
            //console.log("ID - " + element["id"])
            //console.log("ID Zona - " + element["id_zona"])
            //console.log("Inicio - " + element["hora_inicio"])
            //console.log("Fin - " + element["hora_fin"])
            //---------------------------------------------
            if (eventB < element["hora_inicio"] && eventF < element["hora_inicio"]) {
                document.querySelector("#zn_"+element["id_zona"]).classList.remove("Z_grey")
            }else if(eventB > element["hora_fin"] && eventF > element["hora_fin"]){
                document.querySelector("#zn_"+element["id_zona"]).classList.remove("Z_grey")
            }
            else{
                document.querySelector("#zn_"+element["id_zona"]).classList.add("Z_grey")
            }
        });
    }
}


function Dia_disponibles(){ //PRUEBAS
    axios.get('/Reservaciones_doc_where/'+fecha+"/"+id_solicitante)
    .then(response => {
        if (response.data == 404) {
            dia_open = true
        }
        else{
            document.querySelector("#dateselector").classList.add("Input_red")
            Show_flotante('P3 Informacion personal', 'Ya ha realizado una solicitud para el dia seleccionado')
            dia_open = false
        }
    })
    .catch(error => {
        dia_open = true
        console.log(error);
    });
}



let packed = null
async function Buscador_packed(ID){ //FUNCIONAL
    let zona = document.querySelector(".DisplayZone")
    zona.innerHTML = ``
    let P_zonas = null
    await Busqueda_zona_img(ID)
    .then((data) => {
        P_zonas = data
        packed = data
    })
    .catch(error => {
        console.error("Error al cargar zonas:", error)
        P_zonas = []
    });

    if (P_zonas && Array.isArray(P_zonas) && P_zonas.length > 0) {
        P_zonas.forEach(element => {
            zona.innerHTML += `
            <div class="Zonas_card">
                <div class="zone_map" onclick='Formdata_4(${element['id']})' id="zn_${element.id}">
                    <img src="${element['imagen']}" class="Z_img" onerror="this.src='/IMG/parque_silueta.png'">
                    <div class="Z_locate">
                        <img src="/IMG/location-dot-solid.svg" class="Z_svg">
                        <p class="Z_direct">${element['direccion']}</p>
                    </div>
                    <p class="Z_mesg">${element['nombre']}</p>
                    <div class='Z_horario' id='ZNH_${element['id']}'>
                        <p>---</p>
                        <p>-</p>
                        <p>---</p>
                    </div>
                </div>
            </div>
            `
        })
    } else {
        zona.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <h3>No hay zonas disponibles para este parque</h3>
            </div>
        `
    }

}

async function Busqueda_zona_img(ID){ //FUNCIONAL
    return new Promise((resolve, reject) => {
        axios.get('Reservaciones_zonas_img/'+ ID)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}


/*
async function P_horario(){ //PROBANDO HORARIOS FLEXIBLES
    let apertura = null
    let cierre = null
    packed.forEach(element => {
        element['horarios'].forEach(elements => {
            //console.log(elements['hora_apertura'])
            //console.log(elements['hora_cierre'])
            if (elements['dia_semana'] == dia_seleccionado) {
                //apertura = await R_convertir_12h(elements['hora_apertura'])
                document.querySelector("#ZNH_"+element['id']).innerHTML = `
                    <div class='Z_header'>
                        <h3>Desde - Hasta</h3>
                    </div>
                    <div class='Z_center'>
                        <p>${elements['hora_apertura']}</p>
                        <p style='padding-left: .4rem;padding-right: .4rem;'>-</p>
                        <p>${elements['hora_cierre']}</p>
                    </div>
                `
            }
        });
    });
}
*/

async function P_horario(){ //PROBANDO HORARIOS FLEXIBLES
    let apertura = null
    let cierre = null
    packed.forEach(async (element) => {
        for (const elements of element['horarios']) {
            if (elements['dia_semana'] == dia_seleccionado) {
                apertura = await R_convertir_12h(elements['hora_apertura']);
                cierre = await R_convertir_12h(elements['hora_cierre']);
                document.querySelector("#ZNH_" + element['id']).innerHTML = `
                    <div class='Z_header'>
                        <h3>Desde - Hasta</h3>
                    </div>
                    <div class='Z_center'>
                        <p>${apertura}</p>
                        <p style='padding-left: .4rem;padding-right: .4rem;'>-</p>
                        <p>${cierre}</p>
                    </div>
                `;
            }
        }
    });
}


function recolor_horarios(){
    packed.forEach(element => {
        element['horarios'].forEach(elements => {
            if (elements['dia_semana'] == dia_seleccionado) {
                if (eventB >= elements['hora_apertura'] && eventB <= elements['hora_cierre']) {
                    document.querySelector("#ZNH_"+element['id']).classList.remove('Z_red')
                    //----------------
                    if (eventF >= elements['hora_apertura'] && eventF <= elements['hora_cierre']) {
                        document.querySelector("#ZNH_"+element['id']).classList.remove('Z_red')
                    }
                    else{
                        document.querySelector("#ZNH_"+element['id']).classList.add('Z_red')
                    }
                }
                else{
                    document.querySelector("#ZNH_"+element['id']).classList.add('Z_red')
                }
            }

            
        });
    });

}


function User_post() {
    let AutoForm = document.querySelectorAll(".AlignInfo")
    let C_tipo = parseInt(AutoForm[0].value); // Usar el ID directamente

    Doc_user
    let data = {
        id_tipo_doc: C_tipo,
        //documento: AutoForm[1].value,
        documento: Doc_user,
        nombres: AutoForm[2].value.trim(),
        apellidos: AutoForm[3].value.trim(),
        correo: AutoForm[4].value,
        celular: AutoForm[5].value,
    };

    axios.post('/Reservaciones_user', {
        data: data
    })
    .then(response => {
        id_solicitante = response.data['id']
        Reservacion()
    })
    .catch(error => {
        console.log(error);
    });
}


async function Confirmacion_documentos(Document,Type){
    // Type ya viene como ID (1=Cédula, 2=Pasaporte, etc.)
    return new Promise((resolve, reject) => {
        axios.get('/Reservaciones_solicitantes/'+Type+'/'+Document)
        .then(response => {
            resolve (response.data)
            //resolve({ data: response.data, message: 'Interno' });
        })
        .catch(error => {
            //reject (error)
            reject (error['response']['status'])
        });
    });
}


//-------------------------------
//PRUEBAS CON LAS PETICIONES LARAVEL
//-------------------------------


function MapaBuscador(){
    console.log("Buscando...")
}

function Reset(){
    fecha = ""
    eventB = ""
    eventF = ""
}


function btn_section(){
    seccion = document.querySelectorAll(".btn_section")[0]
    //console.log("Trigger: " + seccion.value)
}

//==============================DATA MANEGER=========================================



//------------------------------------STATUS CONFIRMED--------------------------------------

async function eventos_disponibles(idr_evento){
    let select = document.querySelector('#Event_type')
    select.innerHTML = "";
    let ruta = '/reservaciones_eventos/'+idr_evento
    let respuesta
    await axios.get(ruta)
    .then(response => {
        respuesta = response.data
    })
    .catch(error => {
        console.error('Error al cargar tipos de eventos:', error);
        respuesta = [];
    });

    if (respuesta && Array.isArray(respuesta) && respuesta.length > 0) {
        respuesta.forEach(element => {
            let option = document.createElement('option');
            option.value = element['id'];
            option.text = element['tipo'];
            select.appendChild(option);
        });
        select.options[0].selected = true;
    } else {
        console.warn('No se encontraron tipos de eventos para el parque:', idr_evento);
        let option = document.createElement('option');
        option.value = '';
        option.text = 'No hay tipos de eventos disponibles';
        select.appendChild(option);
    }
}

//=================MODERADOR DEL 1ER FORMULARIO
function ParkSelector(ID, Nombre){ 
    let ruta = '/Reservaciones_parque_espera/'+ID
    axios.get(ruta)
    .then(response => {
        //console.log(response.data)
        day = response.data
    })
    .catch(error=>{
        console.log(error)
    });
    eventos_disponibles(ID)
    //===============================================================
    //let ParkID = document.querySelectorAll(".Mapseccion")
    let grup_maps = document.querySelectorAll(".tag_center")
    let Park_details = document.querySelector("#park_"+ID)
    id_park = ID // INFO RESERVACION
    Reset_form3()
    Block_fecha()
    ocultar_detalles()
    Park_details.style.display='block'
    let btn_identy = document.querySelectorAll("#PK_"+ID)[0]
    if (btn_identy.classList[1] == undefined) {
        Parkcleaner()
        btn_identy.classList.add("card_active")
        Pop[0]=true
        Pop[3]=false
        Buscador_packed(ID)
    }
    else{
        Pop[0]=false
        Pop[3]=false
        Parkcleaner()
        Park_add_cleaner()
    }
    ModeradorPOP()
    function ocultar_detalles(){
        grup_maps.forEach(element => {
            element.style.display='none'
        });
    }
    let TBH = document.querySelectorAll('.H_body')
    if (TBH[0].style.display == 'none') {
        TBH.forEach(element => {
            element.style.display = ''
        });
    }
}

function Parkcleaner(){
    let Mapcard = document.querySelectorAll(".card_map")
    Mapcard.forEach(element => {
        element.classList.remove("card_active")
    });
}

function Park_add_cleaner(){
    let info = document.querySelectorAll(".tag_center")
    info.forEach(element => {
        element.style.display='none'
    });
}


                //MODERADOR DEL 1ER FORMULARIO(END)


                //MODERADOR DEL 2DO FORMULARIO
function DocumentSelect(){ //TIPO DE DOCUMENTO
    let DocumentoType = document.querySelector("#DocumentType").value
    let AutoForm = document.querySelectorAll(".AlignInfo")
    Formclean(AutoForm)

    AutoForm[1].value = ""
    AutoForm[2].readOnly = false
    AutoForm[3].readOnly = false
    AutoForm[4].readOnly = false
    AutoForm[5].readOnly = false
    if (AutoForm[1].value != '') {
        SearchDocument(1)
    }
    else{}
    Reset_form3()
}

let id_solicitante = null
let cedula_status = false
let Doc_user = null

async function SearchDocument(Point){//
    
    let Document = document.querySelectorAll(".AlignInfo")[1].value
    let Type = document.querySelectorAll(".AlignInfo")[0].value
    let AutoForm = document.querySelectorAll(".AlignInfo")
    let step = false
    step = false
    cedula_status = false
    email_status = false
    user_status = false
    Formclean(AutoForm)
    remove_red(Point)
    
    if (Document.length == 13) {
        Document = Document.split('-')
        Document = Document[0] + Document[1] + Document[2]
        Doc_user = Document
    }
    else{
        Doc_user = Document
    }

    mostrar_loader()

    if (Type == "1") { // 1 = Cédula
        await Validador_RD(Document)
        .then((data) => {
            step = true
            cedula_status = true
            //email_status = true
        })
        .catch(error => {
            console.log("Error: "+error)
            if (AutoForm[1].value != "") {
                Show_flotante('P2 Informacion personal', 'Documento invalido')
                AutoForm[1].classList.add("Input_red")
            }
            else{
                AutoForm[1].classList.remove("Input_red")
            }
            //Show_flotante('P2 Informacion personal', 'Documento invalido')
            step = false
            cedula_status = false
            email_status = false
        });
    }
    else{
        cedula_status = true
        email_status = true
    }

    //
    if (step == true) {
        await Confirmacion_documentos(Document, Type)
        .then((data) => {
            id_solicitante = data[0]['id']
            AutoForm[2].value = data[0]['nombres']
            AutoForm[3].value = data[0]['apellidos']
            AutoForm[4].value = data[0]['correo']
            AutoForm[5].value = data[0]['celular']
            //---------------------------------
            AutoForm[2].readOnly = true
            AutoForm[3].readOnly = true
            AutoForm[4].readOnly = true
            AutoForm[5].readOnly = true
            //---------------------------------
            email_status = true
            user_p = true
            Form2_Status(Point)
            campos_faltentes()
            user_status = true
            step = true
        })
        .catch(error => {
            step = false
            user_status = false
            ocultar_loader()
        });
        //===================================
        if (user_status == false && Type=="1") { // 1 = Cédula
            await Confirmacion_padron(Document)
            .then((data) => {
                if (data[0]['response'] == true) {
                    AutoForm[2].value = data[0]['nombres']
                    AutoForm[3].value = data[0]['apellidos']    
                    Form2_Status(Point)
                    user_status = false
                    AutoForm[2].readOnly = true
                    AutoForm[3].readOnly = true
                    AutoForm[4].classList.add('Input_blue')
                    AutoForm[5].classList.add('Input_blue')
                    document.querySelectorAll(".Agrup_P")[0].style.visibility = 'hidden'
                    document.querySelectorAll(".Agrup_P")[1].style.visibility = 'hidden'
                    document.querySelectorAll(".Agrup_P")[2].style.visibility = 'hidden'
                    document.querySelectorAll(".Agrup_P")[3].style.visibility = 'hidden'
                }
                else{
                    user_status = false
                }
                //console.log(data);
                ocultar_loader()
            })
            .catch(error => {
                console.log(error)
                user_status = false
                ocultar_loader()
            });
        }
    }
    ocultar_loader()
}



function Formclean(AutoForm){
    document.querySelectorAll(".AlignInfo")[4].classList.remove("Input_blue")
    document.querySelectorAll(".AlignInfo")[5].classList.remove("Input_blue")
    let Mens = document.querySelectorAll(".Agrup_P")
    AutoForm[2].readOnly = false
    AutoForm[3].readOnly = false
    AutoForm[4].readOnly = false
    AutoForm[5].readOnly = false

    AutoForm[2].value = ""
    AutoForm[3].value = ""
    AutoForm[4].value = ""
    AutoForm[5].value = ""

    AutoForm[2].classList.remove("Input_red")
    AutoForm[3].classList.remove("Input_red")
    AutoForm[4].classList.remove("Input_red")
    AutoForm[5].classList.remove("Input_red")
    Mens[0].style.visibility = "hidden"
    Mens[1].style.visibility = "hidden"
    Mens[2].style.visibility = "hidden"
    Mens[3].style.visibility = "hidden"
    id_solicitante = null
    //Pop[1]= "Inconcluso"
    Pop[1]= false
    user_p = false
    Reset_form3()
    ModeradorPOP()
}

function remove_red(Point){
    let Form = document.querySelectorAll(".AlignInfo")
    let Mens = document.querySelectorAll(".Agrup_P")
    if (Form[Point].classList[1] == "Input_red" || Form[Point].classList[2] == "Input_red" ) {
        //Form[Point].classList.remove("Input_red")
        if (Point == 4) {
            
        }
        else{
            Form[Point].classList.remove("Input_red")
        }
        if (Point == 2) {
            Mens[0].style.visibility = 'hidden';
        }else if(Point == 3){
            Mens[1].style.visibility = 'hidden';
        }
        
    }
    else{
    }
}


function Reset_form3(){
    let Event = document.querySelectorAll(".InputAlign")
    Event.forEach(element => {
        //element.value = ""
        //console.log(element.id)
        if (element.id != 'Event_type') {
            element.value = ""
        }
        if (element.classList[1] == "Input_red" || element.classList[2] == "Input_red") {
            element.classList.remove("Input_red")
        }
    });
    //Event[3][0].selected = true

    fecha = ""
    eventB = ""
    eventF = ""
    //------------------------
    tipo_evento = ""
    motivo_evento = ""
    responsables_evento = ""
    adultos_evento = ""
    niños_evento = ""
    descripcion_evento = ""
    //------------------------
    R_horario = null
    //------------------------
    T_valid = false
    F_confirm = false
    dia_open = false
    Pop[2]=false

}

function Form2_Status(Point){
    let verificar = document.querySelectorAll(".AlignInfo")
    //console.log(Point)
    //console.log("Usuario - " + user_p)
    //console.log("Email - " + email_status)
    //console.log("Cedula - " + cedula_status)
    if (Point == undefined) {
        
    }
    else{
        remove_red(Point)
        //campos_faltentes()
    }
    //=================================
    if (verificar[0].value != "" && verificar[1].value != "" && verificar[2].value.trim() != "" && verificar[3].value.trim() != "" && verificar[4].value.trim() != "" && verificar[5].value != "") {
        if (user_p == true ) {
            if (cedula_status == true && email_status == true) {
                Pop[1]=true
            }
            else{
                Pop[1]=false
            }
        }
        else{
            Pop[1]=false
        }
        //Pop[1]=true
        ModeradorPOP()
    }
    else{
        //document.querySelectorAll(".Pop")[1].style.backgroundColor="white" //POP MANAGER
        Pop[1]=false
        ModeradorPOP()
    }
}

                //MODERADOR DEL 2DO FORMULARIO(END)
                //MODERADOR DEL 3ER FORMULARIO

//==========================================
//
//==========================================

function Formdata_3(Point){
    let Event = document.querySelectorAll(".EventInfo")
    let P_mens = document.querySelectorAll(".InputAlign_P")
    const trimmedInput = Event[5].value.trim();
    const maxLenght = trimmedInput.replace(/\s/g, '').length;
    if (maxLenght>15) {
        Event[5].classList.remove("Input_red")
        document.querySelector(".error_mens").style.display = 'none'
    }

    let patron = /^[+]?\d+$/;
    if (Point == null || Point == undefined || Point == "") {}
    else{
        if (Event[Point].classList[2] == "Input_red" || Event[Point].classList[3] == "Input_red" ||  Event[Point].classList[4] == "Input_red") {
            Event[Point].classList.remove("Input_red")
            if (Point == 1) {
                P_mens[3].style.visibility = 'hidden'
            }else if (Point == 3) {
                P_mens[4].style.visibility = 'hidden'
            }else if (Point == 4 ) {
                P_mens[5].style.visibility = 'hidden'
            }
        }
        else{}
    }


    tipo_evento = Event[0].value
    motivo_evento = Event[1].value.trim()
    responsables_evento = Event[2].value.trim()
    adultos_evento = Event[3].value
    niños_evento = Event[4].value
    descripcion_evento = Event[5].value.trim()



    if (Event[0].value.trim() != "" && Event[1].value.trim() != "" && Event[3].value != "" &&  Event[5].value.trim() != "") {
        if (fecha != "" && eventB != "" && eventF != "" && T_valid == true && F_confirm == true && maxLenght>15 && dia_open == true) { //REVISION DEL TIMERS
            //console.log("Empezando comparaciones")
            if (patron.test(adultos_evento) && adultos_evento>0) {
                Pop[2]=true
            }
            else{
                if (adultos_evento<=0) {
                }
                Event[3].classList.add("Input_red")
                Pop[2]=false
            }
            //===================
            if (patron.test(niños_evento) && niños_evento>=0 || niños_evento == '') {
            }
            else{
                Event[4].classList.add("Input_red")
                Pop[2]=false
            }
        }
        else{
            Pop[2]=false
        }
    }
    else{
        Pop[2]=false
    }

    ModeradorPOP()
}








function remove_red_2(Point){ //SIN NINGUNA FUNCIONALIDAD POR AHORA
    //console.log(Point)
    let Form = document.querySelectorAll(".AlignInfo")
    if (Form[Point].classList[1] == "Input_red") {
        Form[Point].classList.remove("Input_red")
    }
    else{
    }
}

function validador_number(){
    let Event = document.querySelectorAll(".EventInfo")
    let patron = /^[+]?\d+$/;

    adultos_evento = Event[3].value
    //niños_evento = Event[4].value

    if (patron.test(adultos_evento)) {
        var numeroEntero = parseInt(adultos_evento, 10);
    } else {}
}


function PTime(select){ //SIN FUNCIONALIDAD
    let Estado = null


    switch (select) {
        case 1:
            eventB= document.querySelector("#Beginning").value
            break;
        case 2:
            eventF = document.querySelector("#End").value
            break;
        default:
            break;
    }
    
}


async function datesave(select){
    let fechaEvent = document.querySelector("#dateselector").value
    let P_mens = document.querySelectorAll(".InputAlign_P")
    //console.log("Seleccionado: "+select)

    let fecha_status = document.querySelectorAll(".InputAlign")

    if (select == undefined) {
    }
    else{
        if (fecha_status[select].classList[1] == "Input_red") {
            fecha_status[select].classList.remove("Input_red")
            if (select == 0) {
                P_mens[0].style.visibility = 'hidden'
            }else if (select == 1) {
                P_mens[1].style.visibility = 'hidden'
            }else if (select == 2) {
                P_mens[2].style.visibility = 'hidden'
            }
        }
        else{}
    }


    let Estado = null


    switch (select) {
        case 0:
            fecha = document.querySelector("#dateselector").value
            eventB = ''
            eventF = ''
            if (user_status == true) {
                //console.log("Usuario registrado")
                dia_open = true
                await Dia_disponibles()
            }else{
                dia_open = true
                //console.log("Usuario no registrado")
            }
            validacion_timers()
            await horarios_existentes()
            await obtenerFecha()
            await data_validator()
            P_horario()
            
            break;
        case 1:
            //eventB= document.querySelector("#Beginning").value
            eventB= document.querySelector("#hora-select-desde").value
            //console.log(eventB)
            break;
        case 2:
            
            //eventF = document.querySelector("#End").value
            eventF = document.querySelector("#hora-select-hasta").value
            //console.log(eventF)
            break;
        default:
            break;
    }

    recolor_horarios()
    if (eventB != "" && eventF != "") {
        recolor_gris()
    }
    //recolor_gris()

    if (fecha != "" && eventB != "" && eventF != "") {
        //validacion_timers()
        /*
        if (eventB < eventF) {
            validacion_timers()
        }
        else{
            Show_flotante('P3 Info. evento' , 'Los horarios seleccionados no son validos')
            document.querySelectorAll(".InputAlign")[1].classList.add('Input_red')
            document.querySelectorAll(".InputAlign")[2].classList.add('Input_red')
            T_valid = false
        }
        */
    }
    else{
        //Pop[2]="Inconcluso"
        Pop[2]=false
        ModeradorPOP()
    }
    Formdata_3()

}

let hora_apertura = null
let hora_cierre = null

async function data_validator(){
    let horarios = null
    await Extracion_horarios()
    .then((data) => {
        horarios = data
    })
    .catch(error => {
        console.log("Error: "+error)
    });


    horarios.forEach(element => {
        if (element['dia_semana'] == dia_seleccionado) {
            hora_apertura = element['hora_apertura']
            hora_cierre = element['hora_cierre']
        }
    });
}


let T_valid = false

function validacion_timers(){
    let verificar = document.querySelectorAll(".AlignInfo")
    if (Confirm24()) {
        T_valid = true
        document.querySelectorAll(".InputAlign")[1].classList.remove('Input_red')
        document.querySelectorAll(".InputAlign")[2].classList.remove('Input_red')  
        document.querySelectorAll(".InputAlign")[1].disabled = false
    }
    else{
        T_valid = false
        Show_flotante('P3 Info. evento' , 'El parque seleccionado tiene un tiempo de respuesta de '+day+' dias')
        document.querySelectorAll(".InputAlign")[0].classList.add('Input_red')
        document.querySelectorAll(".InputAlign")[1].disabled = true
    }
    /*
    if (eventB >= hora_apertura && eventB <= hora_cierre) {
        if (eventF >= hora_apertura && eventF <= hora_cierre) {
            //console.log("Hora de finalizacion valida")
            if (Confirm24()) {
                T_valid = true
                document.querySelectorAll(".InputAlign")[1].classList.remove('Input_red')
                document.querySelectorAll(".InputAlign")[2].classList.remove('Input_red')    
            }
            else{
                T_valid = false
                Show_flotante('P3 Info. evento' , 'La fecha seleccionado se encuentra dentro del tiempo de espera de '+day+' dias')
                document.querySelectorAll(".InputAlign")[0].classList.add('Input_red')
            }
        }
        else{
            //console.log("Hora de finalizacion invalida")
            Show_flotante('P3 Info. evento' , 'Fuera del horario establecido')
            document.querySelectorAll(".InputAlign")[1].classList.remove('Input_red')
            document.querySelectorAll(".InputAlign")[2].classList.add('Input_red')
            T_valid = false
        }
    }
    else{
        //console.log("Hora de inicio invalida")
        Show_flotante('P3 Info. evento' , 'Fuera del horario establecido')
        document.querySelectorAll(".InputAlign")[1].classList.add('Input_red')
        document.querySelectorAll(".InputAlign")[2].classList.remove('Input_red')
        T_valid = false
    }
    */
}

function Confirm24(){
    //day = 5
    if(fecha > getFutureDate(day)){
        //console.log("Superior, pasar sin problemas")
        return true
    }else if(fecha == getFutureDate(day)){
        //console.log("Necesita revision")
        if (eventB > Hora_actual()) {
            //console.log("Permitir")
            return true
        }
        else{
            //console.log("No permitir")
            //console.log("El horario que ha seleccionado se encuentra dentro del tiempo de espera de " + (day*24) + " horas")
            return false
        }
    }
    else if (fecha <= getFutureDate(day)){
        //console.log("Bruh")
        return false
    }
}


function mostrar_loader(){
    //document.querySelector('.loader-container').style.display = 'flex'
    document.querySelector('.loader-container').style.visibility = 'initial'
}
function ocultar_loader(){
    //document.querySelector('.loader-container').style.display = 'none'
    document.querySelector('.loader-container').style.visibility = 'hidden'
}
// 

function Block_fecha(){
    let days = 1
    espera = getFutureDate(days)
    document.getElementById("dateselector").setAttribute("min", espera);
}

function Hora_actual() { //SE REQUIERE PARA LA CONFIRMACION DE 24H
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();

    // Asegurarse de que las horas y los minutos tengan dos dígitos
    hours = (hours < 10 ? "0" : "") + hours;
    minutes = (minutes < 10 ? "0" : "") + minutes;

    var currentTimeString = hours + ":" + minutes;
    return currentTimeString;
}


function getFutureDate(days) {//SE REQUIERE PARA LA CONFIRMACION DE 24H
    var today = new Date();
    var futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000); // Agrega el número de días en milisegundos

    var year = futureDate.getFullYear();
    var month = (futureDate.getMonth() + 1).toString().padStart(2, "0"); // Sumar 1 al mes porque los meses en JavaScript comienzan desde 0
    var day = futureDate.getDate().toString().padStart(2, "0");

    var futureDateString = year + "-" + month + "-" + day;
    return futureDateString;
}



function Min_hour() {
    var beginningTime = document.getElementById("hora-select-desde").value;
    var endTime = document.getElementById("hora-select-hasta").value;

    if (beginningTime && endTime) {
    var beginningHour = parseInt(beginningTime.split(":")[0]);
    var beginningMinute = parseInt(beginningTime.split(":")[1]);
    var endHour = parseInt(endTime.split(":")[0]);
    var endMinute = parseInt(endTime.split(":")[1]);

    var beginningTotalMinutes = beginningHour * 60 + beginningMinute;
    var endTotalMinutes = endHour * 60 + endMinute;

    if (endTotalMinutes - beginningTotalMinutes < 60) {
        return false
    } else {
        return true
    }
    }
}









function Extracion_horarios(){ 
    return new Promise((resolve, reject) => {
        axios.get('/Reservaciones_parque_horarios/'+id_park)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}



                //MODERADOR DEL 3ER FORMULARIO (END)


                //MODERADOR DEL 4TO FORMULARIO (END)


function Formdata_4(Zona){
    let Card_zone = document.querySelector('#zn_'+Zona)
    id_zona = Zona
    if(document.querySelector("#ZNH_"+Zona).classList[1] == "Z_red" || document.querySelector("#ZNH_"+Zona).classList[2] == "Z_red"){
        Show_flotante('P4 Seleccionar zona' , 'Fuera de margen')
        Zone_cleaner()
        Pop[3]=false
    }
    else if(document.querySelector("#zn_"+Zona).classList[1] == "Z_grey" || document.querySelector("#zn_"+Zona).classList[2] == "Z_grey"){
        Show_flotante('P4 Seleccionar zona' , 'Zona ocupada')
        Zone_cleaner()
        Pop[3]=false
    }
    else{
        if (Card_zone.classList[1] == undefined) {
            Zone_cleaner()
            Card_zone.classList.add("zone_active")
            Pop[3]=true
        }
        else{
            Zone_cleaner()
            Card_zone.classList.remove("zone_active")
            Pop[3]=false
        }
    
    }
    
    ModeradorPOP()
}


function Zone_cleaner(){
    let cardzone = document.querySelectorAll(".zone_map")

    cardzone.forEach(element => {
        element.classList.remove("zone_active")
    });

}


                //MODERADOR DEL 4TO FORMULARIO (END)


//==============================DATA MANEGER=========================================


//=================================ESTRUCTURA Y DISEÑO========================================

function FormOpcion(Act){
    return
    function OK(){
        OcultarForms()
        position = Act
        document.querySelector(".Form"+position).style.display="block"
        FormActual()
        Iluminar()
    }
    //OK()
    
    console.log("============================")
    console.log("Formulario: "+Act)
    console.log("Autorizacion: "+Pop[Act-2])

    if (Act == 5 && Pop[4] == true){
        console.log("ACCESO CONFIRMADO")
        console.log(Pop)
        /*
        if (Pop[0] == true && Pop[1] == true && Pop[2] == true && Pop[3] == true) {
            console.log("TODOS CONFIRMADOS")
            OK()
        }
        else{
            console.log("Faltan estados")
        }
        */
        OK()
    }
    else if (Pop[Act-2] == true || Pop[Act-2] == "Inconcluso") {
        console.log("Autorizar")
        OK()
    }
    else if (Act == 1){
        console.log("Volviendo al inicio")
        OK()
    }
    else{
        console.log("No autorizar")
        console.log(Pop)
    }
    console.log("============================")


    //console.log("Autorizacion Anterior: "+Pop[Act-2])

    /*
    OcultarForms()
    position = Act
    document.querySelector(".Form"+position).style.display="block"
    FormActual()
    Iluminar()
    */
}


function OcultarForms(){
    document.querySelector(".Form1").style.display="none"
    document.querySelector(".Form2").style.display="none"
    document.querySelector(".Form3").style.display="none"
    document.querySelector(".Form4").style.display="none"
    document.querySelector(".Form5").style.display="none"

}


function Iluminar(){
    let Ops = document.querySelectorAll(".FormStatus")
    let a =1
    Ops.forEach(element => {
        
        if (position >= a) {
            element.classList.add("StatusLight")
            document.querySelectorAll(".FormStatus2")[a-1].classList.add("StatusLight")
        }
        else{
            element.classList.remove("StatusLight")
            document.querySelectorAll(".FormStatus2")[a-1].classList.remove("StatusLight")
        }
        a++
    });
}


function ModeradorPOP(){
    let Mod = document.querySelectorAll(".Pop")
    let c = 0
    if (Pop[0] == true && Pop[1] == true && Pop[2] == true && Pop[3] == true) {
        //console.log("Acceso final concedido")
        Pop[4] = true
    }
    else{
        Pop[4] = false
    }
    
}
//
//==========================BOTONES================================


function Date_Anterior(){
    document.querySelector(".eventTimer").style.display="block"
    document.querySelector(".eventText").style.display="none"
}
function Date_Siguiente(){
    document.querySelector(".eventTimer").style.display="none"
    document.querySelector(".eventText").style.display="block"
}


function Previous(){ //CON ANIMACION
    if (document.querySelector(".Form"+(position-1)) != null) {
        document.querySelector(".Form"+position).classList.add("NextAnimation")
        setTimeout(start, 200);
        setTimeout(END, 230);
    }
    else{
    }
    //
    function start(){
        position--
        if (position == 0) {
            position=1
            return
        }
        if (position == 6) {
            position=5
            return
        }
        else{
        }
        
        OcultarForms()
        document.querySelector(".Form"+position).style.display="block"
        FormActual()
        Iluminar()
        //document.querySelector(".Form"+position).classList.remove("NextAnimation")
    }
    function END() {
        document.querySelector(".Form"+position).classList.remove("PreviousAnimation")
    }
}


async function Next(){ //CON ANIMACION
    Hide_flotante()
    let Event = document.querySelectorAll(".EventInfo")
    let patron = /^[+]?\d+$/;

    let Mens_float = null
    if (position == 2) {
        //console.log("====================================")
        await validarCorreoElectronico()
        .then((data) => {
            //console.log("Termino")
        })
        .catch(error => {
            //console.log("Error: "+error)
        });
        //console.log("====================================")
    
        //console.log("Validar correo")
        await process();
        //console.log("Validar numero")
        await campos_faltentes();
        //console.log("Señalizo los campos faltantes")
        Form2_Status()
        //console.log(user_p)
        //console.log(email_status)
        //console.log("Siguio")
    }    
    if (position == 3) {
        campos_faltentes_2()
        if (patron.test(Event[3].value)) {}
        else{
            Event[3].classList.add("Input_red")
        }
    }
    
    if (Pop[position-1] == true /*|| Pop[position-1]=="Inconcluso"*/) {
        if (document.querySelector(".Form"+(position+1)) != null) {
            document.querySelector(".Form"+position).classList.add("PreviousAnimation")
            setTimeout(start, 200);
            setTimeout(END, 230);
            position++
        }
        else{}    
        
    }
    else if (Pop[position-1] == false) {
        //Show_flotante('P'+position+' Seleccion de parque' , 'Formulario incompleto')
        switch (position) {
            case 1:
                Mens_float = 'P'+position + " Seleccion de parque" 
                Show_flotante(Mens_float , 'Formulario incompleto')
                break;
            case 2:
                
                Mens_float = 'P'+position + " Informacion personal" 
                Show_flotante(Mens_float , 'Complete los formularios requeridos')
                break;
            case 3:
                Mens_float = 'P'+position + " Informacion evento" 
                if (T_valid == false) {
                    validacion_timers()
                }else{
                    Show_flotante(Mens_float , 'Complete los formularios requeridos')
                }
                //Show_flotante(Mens_float , 'Complete los formularios requeridos')
                break;
            case 4:
                
                Mens_float = 'P'+position + " Seleccionar zona" 
                Show_flotante(Mens_float , 'Formulario incompleto')
                
                break;
            default:
                break;
        }
        //Show_flotante(Mens_float , 'Formulario incompleto')
    }
    function start(){
        //position++
        if (position == 0) {
            position=1
            return
        }
        if (position == 6) {
            position=5
            return
        }
        else{}
        if (position == 5) {
            //console.log("Enviar post")
            if (user_status == false && id_solicitante == null) {
                //console.log("Registrar usuario y solicitud")
                User_post()
            }
            else{
                //console.log("Registrar solo solicitud")
                Reservacion()
            }
            //User_post()
            //Reservacion()
        }
    

        OcultarForms()
        document.querySelector(".Form"+position).style.display="block"
        FormActual()
        Iluminar()
    }
    function END() {
        document.querySelector(".Form"+position).classList.remove("NextAnimation")
    }
}

function mirror_preview(){
    document.querySelector('.Previous').click()
}

function mirror_next(){
    document.querySelector('.Next').click()
}




function FormActual(){
    let EstadoP = document.querySelector('#subTitulo');
    EstadoP.innerHTML = `Paso N.${position}`;
    let Desc = document.querySelector('#Desc');
    Desc.innerHTML = ``;
    
    switch (position) {
        case 1:
            Desc.innerHTML = `Seleccione el parque de su preferencia`;
            document.querySelector('.botones_extra').style.visibility = 'hidden'
            break;
        case 2:
            Desc.innerHTML = `Información personal `;
            document.querySelector('.botones_extra').style.visibility = 'hidden'
            break;
        case 3:
            document.querySelector('.botones_extra').style.visibility = 'initial'
            Desc.innerHTML = `Información del evento`;
            break;
        case 4:
            document.querySelector('.botones_extra').style.visibility = 'initial'
            Desc.innerHTML = `Seleccione la zona`;
            break;
        case 5:
            document.querySelector('.botones_extra').style.visibility = 'hidden'
            document.querySelector('#Desc').style.display = 'none'
            document.querySelector('#subTitulo').style.display = 'none'
            Desc.innerHTML = `Código QR`;
            break;

        default:
            break;
    }


}



//==========================WINDOWS LISTENER================================

document.addEventListener("keydown", (e) => { //LISTENER DEL ENTER
    
    if (e.key == "Enter"){
        if (e.key == "Enter" && document.activeElement.name == "Doc_buscador") {
        SearchDocument(1)
        }
    }
});


let user_p = false
document.addEventListener("keydown", (e) => { //LISTENER DEL ENTER
    
    if (e.key == "Enter"){
        if (e.key == "Enter" && document.activeElement.name == "phone") {
        process()
        }
    }
});


document.addEventListener("keydown", (e) => { //LISTENER DEL ENTER
    
    if (e.key == "Enter"){
        if (e.key == "Enter" && document.activeElement.name == "email") {
            validarCorreoElectronico()
        }
    }
});



//==============================VALIDADOR DE CEDULA DOMINICANA ==============

let Validacion = null

function Validador_RD(Document){
    
    return new Promise((resolve, reject) => {
        valida_cedula(Document)

        function valida_cedula(ced) {  
            var c = ced.replace(/-/g,'');  
            var cedula = c.substr(0, c.length - 1);  
            var verificador = c.substr(c.length - 1, 1);  
            var suma = 0;  
            var cedulaValida = 0;
            if(ced.length < 11) {
                Validacion = false
                reject (Validacion)
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
                resolve (Validacion)
            }  
            else{  
                Validacion = false
                reject (Validacion)
            }  
        }
    })
}


async function Confirmacion_padron(Document){
    return new Promise((resolve, reject) => {
        axios.get('/ADN_Padron/'+ Document)
        .then(response => {
            resolve (response.data)
        })
        .catch(error => {
            reject (error)
        });
    })
}


//
//=================================================================
//



function obtenerFecha() {
    var fechaSeleccionada = document.getElementById("dateselector").value;
    var fechaPartes = fechaSeleccionada.split("-");
    var anio = parseInt(fechaPartes[0]);
    var mes = parseInt(fechaPartes[1]) - 1;
    var dia = parseInt(fechaPartes[2]);
    var fecha = new Date(anio, mes, dia);
    var nombreDia = fecha.toLocaleDateString(undefined, { weekday: 'long' });
    dia_seleccionado = nombreDia
    comparacion_fechas()
}

function obtenerFechaActual() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    let mes = fecha.getMonth() + 1;
    let dia = fecha.getDate();

    // Asegurarse de que el mes y el día tengan dos dígitos
    mes = mes < 10 ? '0' + mes : mes;
    dia = dia < 10 ? '0' + dia : dia;

    return `${año}-${mes}-${dia}`;
}
const fechaActual = obtenerFechaActual();


let F_confirm = false
function comparacion_fechas(){
    //console.log("Select - " + fecha)
    //console.log("Actual - " + fechaActual)
    if(fecha < fechaActual){
        //console.log("Fecha introducida es menor a la actual")
        document.querySelector("#dateselector").classList.add("Input_red")
        F_confirm = false
    }
    else if(fecha > fechaActual){
        //console.log("Fecha introducida es mayor a la actual")
        F_confirm = true
    }
    else if(fecha == fechaActual){
        //console.log("Fecha introducida es igual a la actual")
        F_confirm = true
    }
    else{
        
    }

}

function soloNumeros(evt) {
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




function SoloFN(evt) {
    if (document.querySelectorAll(".AlignInfo")[0].value == "1") { // 1 = Cédula
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
    else{
        evt = (evt) ? evt : window.event;
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if (
            (charCode > 47 && charCode < 58) || // Números del 0 al 9
            (charCode > 64 && charCode < 91) || // Letras mayúsculas
            (charCode > 96 && charCode < 123) // Letras minúsculas
        ) {
            return true;
        } else {
            if (evt.preventDefault) {
                evt.preventDefault();
            } else {
                evt.returnValue = false;
            }
        }
    }
}






function agregarGuion() { //FUNCIONAR PERO NECESITO ALGUNAS PRUEBAS ADICIONALES

    let Document = document.querySelectorAll(".AlignInfo")[1].value
    var valor = Document.replace(/-/g, "");;

    if (document.querySelectorAll(".AlignInfo")[0].value == "1") { // 1 = Cédula
        if (valor.length > 2 && valor.indexOf('-') === -1) {
            valor = valor.slice(0, 3) + '-' + valor.slice(3);
        }
        if (valor.length > 10 && valor.lastIndexOf('-') !== 11) {
            valor = valor.slice(0, 11) + '-' + valor.slice(11);
        }
        document.querySelectorAll(".AlignInfo")[1].value = valor;
    }
}


function agregarGuion2(){
    let Document = document.querySelectorAll(".AlignInfo")[1].value
    let Doc = [null]
    let Valor = ""

    //console.log(Document)
    Document = Document.replace(/-/g, "");
    //console.log(Document)
    if (Document.length > 2){
        //console.log("Paso 1")
        Doc[0] = Document.slice(0,3)
        Valor += Doc[0] + "-"
    }
    
    if (Document.length > 10) {
        //console.log("Paso 2")
        Doc[1] = Document.slice(3,10)
        Valor += Doc[1] + "-"
    }
    if (Document.length == 11) {
        //console.log("Paso 3")
        Doc[2] = Document.slice(10)
        Valor += Doc[2]   
    }
    
    //console.log("Documento formateado - " + Valor)
    document.querySelectorAll(".AlignInfo")[1].value = Valor;
}





async function validarCorreoElectronico() { // FUNCIONAL PERO DEBO PREGUNTAR
    return new Promise((resolve, reject) => {
    

        let correo = document.querySelectorAll(".AlignInfo")[4].value
        var patronCorreo = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // Comprobar si el correo cumple con el formato
        if (patronCorreo.test(correo)) {
            //console.log("Correo valido")
            document.querySelectorAll(".Agrup_P")[2].style.visibility = 'hidden'
            if (user_status == false) {
                //resolve (email_existencia(correo))
                axios.get('/Reservaciones_email/'+correo)
                .then(response => {
                    //console.log(response.data)
                    if (response.data == 404) {
                        email_status = true
                        document.querySelectorAll(".AlignInfo")[4].classList.remove("Input_red")
                        //console.log("No existe otro")
                        //console.log(email_status)
                        resolve (email_status)
                        //Form2_Status()
                    }
                    else{
                        email_status = false
                        //console.log("Existe otro")
                        document.querySelectorAll(".AlignInfo")[4].classList.add("Input_red")
                        Show_flotante('P3 Informacion personal', 'Este correo ya fue sido registrado')
                        reject (email_status)
                    }
                })
                .catch(error => {
                    //console.log(error);
                    //console.log("error")
                    email_status = false
                    //console.log("2.Existe otro")
                    document.querySelectorAll(".AlignInfo")[4].classList.add("Input_red")
                    Show_flotante('P3 Informacion personal', 'Este correo ya ha sido registrado')
                    reject (email_status)
                });
                //
            
                
            }else{
                //console.log("True")
                email_status = true
                reject (email_status)
            }
            
            //email_status = true
            //return true; // El correo es válido
        } else {
            //console.log("Correo invalido")
            document.querySelectorAll(".Agrup_P")[2].style.visibility = 'initial'
            email_status = false
            reject (email_status)
            //return false; // El correo es inválido
        }
    })
}

async function email_existencia(correo){ //PRUEBAS
    //console.log("Entrando")
    axios.get('/Reservaciones_email/'+correo)
    .then(response => {
        //console.log(response.data)
        if (response.data == 404) {
            email_status = true
            document.querySelectorAll(".AlignInfo")[4].classList.remove("Input_red")
            //console.log("No existe otro")
            //console.log(email_status)
            //Form2_Status()
        }
        else{
            email_status = false
            //console.log("Existe otro")
            document.querySelectorAll(".AlignInfo")[4].classList.add("Input_red")
            Show_flotante('P3 Informacion personal', 'Este correo ya fue sido registrado')
        }
    })
    .catch(error => {
        //console.log(error);
        //console.log("error")
        email_status = false
        //console.log("2.Existe otro")
        document.querySelectorAll(".AlignInfo")[4].classList.add("Input_red")
        Show_flotante('P3 Informacion personal', 'Este correo ya ha sido registrado')
    });
}



function fix(){
    //document.querySelector('.iti').style.marginRight = '4.6%'
    //document.querySelector('.iti').style.marginRight = '10%'
    document.querySelector('#phone').style.paddingRight = '0'
    document.querySelector('#phone').style.paddingLeft = '1cm'
    document.querySelector('#phone').style.marginLeft = '0'
    //document.querySelector('#phone').style.width = '87%'
    //document.querySelector('.iti__country-list').style.width = '6cm'
    //document.querySelector('.iti__country-list').style.whiteSpace = 'normal'
}


//padding-right: 0;
//padding-left: 1cm;
//margin-left: 0;




function process() {
    const phoneNumber = phoneInput.getNumber();
    if (phoneInput.isValidNumber()) {
        document.querySelectorAll(".Agrup_P")[3].style.visibility = 'hidden'
        user_p = true
    } else {
        document.querySelectorAll(".Agrup_P")[3].style.visibility = 'initial'
        user_p = false
        Pop[1]=false
    }
}




/*
document.querySelector('#buscador_parque').addEventListener('input',function(){
    console.log("Input detectado")
    //console.log(this)
});
*/
/*
document.querySelector('#buscador_parque').addEventListener('input', function(event) {
    console.log("Input detectado");
    
    // Acceder al valor actual del input
    var valorInput = event.target.value;
    console.log("Valor del input:", valorInput);

    // Puedes realizar más acciones aquí según tus necesidades

    // Ejemplo: Enviar el valor del input a una función
    // miFuncionPersonalizada(valorInput);
});
*/

function input_interno(){
    let input = document.querySelector('#buscador_parque')
    let card_map = document.querySelectorAll('.card_map')
    //console.log(input.value)
    card_map.forEach(element => {
        console.log(element.children[2].textContent)
    });
}



function filtro_pruebas(valor){
    let label = ['1','1a','1s','2','3']
    //let valor = 1
    let busqueda = new RegExp(`${valor}.*`, "i");
    let filtro = label.filter(label=> busqueda.test(label))
    //let filtro = label.filter(label=> busqueda.test(label['id']))
    console.log(filtro)
    if (filtro) {
        console.log("Coincidencia encontrada")
    }else{
        console.log("Sin coincidencias")
    }
}


/*
function parque_filtro(valor){
    let objeto = document.querySelectorAll('.card_map')
    let busqueda = new RegExp(`${valor}.*`, "i");
    let filtro = objeto.filter(objeto=> busqueda.test(objeto.children[2].textContent))
    console.log(filtro)
}
*/

/*
function parque_filtro(valor) {
    let objetos = document.querySelectorAll('.card_map');
    let arrayDeObjetos = Array.from(objetos);
    let busqueda = new RegExp(`${valor}.*`, "i");
    let filtro = arrayDeObjetos.filter(objeto => busqueda.test(objeto.children[2].textContent));
    console.log(filtro)
    console.log(filtro[0].children[2].textContent)
}
*/
//let filtro


/*
    ||==============================
    || FILTROS 
    ||==============================
*/

function parque_filtro() {
    let valor = document.querySelector('#buscador_parque').value
    let off = document.querySelectorAll('.no_content')[0]
    //console.log(valor)
    if (valor != '' && valor != undefined && valor != null) {
        let objetos = document.querySelectorAll('.card_map');
        let arrayDeObjetos = Array.from(objetos);
        let busqueda = new RegExp(`${valor}.*`, "i");
        let NR = true
        Parkcleaner()
        Park_add_cleaner()
        Pop[0]=false
        Pop[3]=false
        arrayDeObjetos.forEach(objeto => {
            let nombreParque = objeto.querySelector('.M_mes_2');
            if (nombreParque && busqueda.test(nombreParque.textContent)) {
                objeto.parentNode.classList.remove('card_map_hidden')
                //console.log('Mostrar - '+nombreParque.textContent)
                NR = false
            } else {
                objeto.parentNode.classList.add('card_map_hidden')
                //console.log('Ocultar - '+nombreParque.textContent)
            }
        });
        if (NR == false) {
            off.classList.add('no_hidden_parque')
        }else{
            off.classList.remove('no_hidden_parque')
        }
    }else{
        //console.log('Nulo')
        let hidden = document.querySelectorAll('.card_map_hidden')
        off.classList.add('no_hidden_parque')
        hidden.forEach(element => {
            element.classList.remove('card_map_hidden')
        });
    }
}

function zona_filtro() {
    let valor = document.querySelector('#buscador_zona').value
    let off = document.querySelectorAll('.no_content')[1]
    let NR = true
    console.log(valor)
    if (valor != '' && valor != undefined && valor != null) {
        let objetos = document.querySelectorAll('.zone_map');
        let arrayDeObjetos = Array.from(objetos);
        let busqueda = new RegExp(`${valor}.*`, "i");
        Zone_cleaner()
        Pop[3]=false
        arrayDeObjetos.forEach(objeto => {
            let nombreZona = objeto.querySelector('.Z_mesg');
            if (nombreZona && busqueda.test(nombreZona.textContent)) {
                objeto.parentNode.classList.remove('card_zona_hidden')
                //console.log('Mostrar - '+nombreZona.textContent)
                NR = false
            } else {
                objeto.parentNode.classList.add('card_zona_hidden')
                //console.log('Ocultar - '+nombreZona.textContent)
            }
        });
        if (NR == false) {
            off.classList.add('no_hidden_parque_2')
        }else{
            off.classList.remove('no_hidden_parque_2')
        }
    }else{
        //console.log('Nulo')
        let hidden = document.querySelectorAll('.card_zona_hidden')
        off.classList.add('no_hidden_parque_2')
        hidden.forEach(element => {
            element.classList.remove('card_zona_hidden')
        });
    }
}

/*
    ||==============================
    || FILTROS - END
    ||==============================
*/



async function reload(){
    /*console.log("Recargar pagina")*/
    location.reload();
}

