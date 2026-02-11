


function campos_faltentes(){
    let verificar = document.querySelectorAll(".AlignInfo")
    let Mens = document.querySelectorAll(".Agrup_P")

    if (verificar[1].value == "") { //REVISION 2do FORMULARIO - DOCUMENTO
        verificar[1].classList.add("Input_red")
    }else if(cedula_status == false && verificar[0].value == "cedula"){
        verificar[1].classList.add("Input_red")
    }
    else{
        verificar[1].classList.remove("Input_red")
    }
    //--------------------------------------------------
    if (verificar[2].value.trim() == "") { //REVISION 3er FORMULARIO - NOMBRE
        verificar[2].classList.add("Input_red")
        Mens[0].style.visibility = "initial"
    }else{
        verificar[2].classList.remove("Input_red")
        Mens[0].style.visibility = "hidden"
    }
    //--------------------------------------------------
    if (verificar[3].value.trim() == "") { //REVISION 4to FORMULARIO - APELLIDO
        verificar[3].classList.add("Input_red")
        Mens[1].style.visibility = "initial"
    }else{
        verificar[3].classList.remove("Input_red")
        Mens[1].style.visibility = "hidden"
    }
    //--------------------------------------------------
    if (verificar[4].value.trim() == "") { //REVISION 5to FORMULARIO - CORREO
        verificar[4].classList.add("Input_red")
        Mens[2].innerText = 'formato invalido'
        Mens[2].style.visibility = "initial"
    }else if(email_status == false){
        verificar[4].classList.add("Input_red")
        Mens[2].innerText = 'correo existente'
        Mens[2].style.visibility = "initial"
        //Mens[2].style.display = "block"
        //console.log(email_status)
        //console.log("...")
    }else{
        verificar[4].classList.remove("Input_red")
        Mens[2].style.visibility = "hidden"
    }
    //--------------------------------------------------
    if (verificar[5].value.trim() == "") { //REVISION 5to FORMULARIO - CELULAR
        verificar[5].classList.add("Input_red")
        Mens[3].style.visibility = "initial"
    }else if(user_p == false){
        verificar[5].classList.add("Input_red")
        Mens[3].style.visibility = "initial"
    }else{
        verificar[5].classList.remove("Input_red")
        Mens[3].style.visibility = "hidden"
    }
}



//campos_faltentes()

/*
function campos_faltentes_2(){
    //console.log("Entrando 2")
    let Event = document.querySelectorAll(".InputAlign")
    Event.forEach(element => {
        if (element.value.trim() != "") {
            //console.log("Lleno")
            element.classList.remove("Input_red")
        }
        else{
            //console.log("Faltente")
            element.classList.add("Input_red")
        }
    });
}
*/

function campos_faltentes_2(){
    let Event = document.querySelectorAll(".InputAlign")
    let P_mens = document.querySelectorAll(".InputAlign_P")
    const trimmedInput = Event[8].value.trim();
    const maxLenght = trimmedInput.replace(/\s/g, '').length;


    //console.log("===============================")
    if (Event[0].value == '' ) { //REVISION DEL 1er FORMULARIO
        //console.log("Fecha rojo")
        //console.log("Vacia")
        Event[0].classList.add("Input_red")
        P_mens[0].style.visibility = 'initial'
    }else if(F_confirm == false){
        //console.log("Fecha rojo")
        //console.log("Fecha inferior a la actual")
        Event[0].classList.add("Input_red")
        P_mens[0].style.visibility = 'initial'
    }else if(dia_open == false){
        //console.log("Fecha rojo")
        //console.log("Solicitud existente")
        Event[0].classList.add("Input_red")
        P_mens[0].style.visibility = 'initial'
    }
    else{
        //console.log("Limpiar rojo")
        Event[0].classList.remove("Input_red")
        P_mens[0].style.visibility = 'hidden'
    }
    //------------------------------------------
    //console.log("===============================")
    if (Event[1].value == '') {// REVISION DEL 2do FORMULARIO
        //console.log("1er timer Rojo")
        //console.log("Vacio")
        Event[1].classList.add("Input_red")
        P_mens[1].style.visibility = 'initial'
    }else{
        //console.log("Limpiar rojo")
        Event[1].classList.remove("Input_red")
        P_mens[1].style.visibility = 'hidden'
        //validacion_timers()
    }
    //------------------------------------------
    //console.log("===============================")
    if (Event[2].value == '') {// REVISION DEL 3er FORMULARIO
        //console.log("2do timer Rojo")
        //console.log("Vacio")
        Event[2].classList.add("Input_red")
        P_mens[2].style.visibility = 'initial'
    }else{
        //console.log("Limpiar rojo")
        Event[2].classList.remove("Input_red")
        P_mens[2].style.visibility = 'hidden'
        //validacion_timers()
    }
    //------------------------------------------
    if (eventB > eventF) {// RECOLOR DE AMBOS TIMERS 
        //console.log("Timers invertidos")
        Event[1].classList.add("Input_red")
        Event[2].classList.add("Input_red")
        T_valid = false
    }
    /*
    else if(Min_hour() == false){
        Event[1].classList.add("Input_red")
        Event[2].classList.add("Input_red")
        //Show_flotante('P3 Info. evento' , 'La duracion minima para un evento es de una hora')
    }
    else if(Confirm24() == false){
        Event[1].classList.add("Input_red")
    }
    */
    //------------------------------------------
    //console.log("===============================")
    if (Event[3].value == '') {// REVISION DEL 4to FORMULARIO
        //console.log("Evento rojo")
        //console.log("Vacio")
        Event[3].classList.add("Input_red")
    }else{
        //console.log("Limpiar rojo")
        Event[3].classList.remove("Input_red")
    }
    //------------------------------------------
    //console.log("===============================")
    if (Event[4].value.trim() == '') {// REVISION DEL 5to FORMULARIO
        //console.log("Motivo rojo")
        //console.log("Vacio")
        Event[4].classList.add("Input_red")
        P_mens[3].style.visibility = 'initial'
        //Event[4].placeholder = "Requerido"
    }else{
        //console.log("Limpiar rojo")
        Event[4].classList.remove("Input_red")
        P_mens[3].style.visibility = 'hidden'
        //Event[4].placeholder = ""
    }
    //------------------------------------------
    //console.log("===============================")
    //------------------------------------------
    //console.log("===============================")
    if (Event[6].value == '') {// REVISION DEL 7mo FORMULARIO
        //console.log("Adultos rojo")
        //console.log("Vacio")
        Event[6].classList.add("Input_red")
        P_mens[4].style.visibility = 'initial'
        //Event[6].placeholder = "Requerido"
    }else if (Event[6].value <= 0) {// REVISION DEL 7mo FORMULARIO
        //console.log("Adultos rojo")
        //console.log("Sin adultos participantes")
        Event[6].classList.add("Input_red")
        P_mens[4].style.visibility = 'initial'
        //Event[6].placeholder = "Requerido"
    }else{
        //console.log("Limpiar rojo")
        Event[6].classList.remove("Input_red")
        P_mens[4].style.visibility = 'hidden'
        //Event[6].placeholder = ""
    }
    //------------------------------------------
    //console.log("===============================")
    if (Event[7].value == '') {// REVISION DEL 8vo FORMULARIO
        //Event[7].classList.add("Input_red")
        //P_mens[5].style.visibility = 'initial'
    }else{
        //Event[7].classList.remove("Input_red")
        //P_mens[5].style.visibility = 'hidden'
    }
    //------------------------------------------
    //console.log("===============================")
    if (Event[8].value == '') {// REVISION DEL 9no FORMULARIO
        //console.log("Descripcion rojo")
        //console.log("Vacio")
        Event[8].classList.add("Input_red")
        //Event[8].placeholder = "Requerido"
        //document.querySelector(".error_mens").style.display = 'block'
    }else if(maxLenght<=15){
        //console.log(maxLenght)
        //console.log("Descripcion inferior")
        //console.log("Minimo no alcanzado")
        Event[8].classList.add("Input_red")
        //Event[8].placeholder = ""
        document.querySelector(".error_mens").style.display = 'block'
    }else{
        //console.log("Limpiar rojo")
        Event[8].classList.remove("Input_red")
        //Event[8].placeholder = ""
        document.querySelector(".error_mens").style.display = 'none'
    }



}
//campos_faltentes_2()


function Hide_flotante(){
    document.querySelector('.toast').style.display='none'
}
function Show_flotante(Step, Mensg){
    /*
    if (document.querySelector('.toast').style.display == 'block') {
        console.log("Ocultando")
        document.querySelector('.toast').style.display='none'
    }
    */  
    document.querySelector('.toast').style.display='block'
    document.querySelector('.me-auto').firstChild.nodeValue = Step
    document.querySelector('.toast-body').childNodes[2].textContent = Mensg
}


/*
function tabla_Horario_hidden(){
    let TBH = document.querySelectorAll('.H_body')

    if (TBH[0].style.display == '') {
        //console.log("Ocultar")
        //TBH.style.display = 'none'
        TBH.forEach(element => {
            element.style.display = 'none'
        });
    }
    else{
        //console.log("Mostrar")
        //TBH.style.display = ''
        TBH.forEach(element => {
            element.style.display = ''
        });
    }
}
*/




function QRMaker(id){
    //var ruta="https://adn.gob.do"; //Editar la ruta por defecto al momento de subir a la servidor
    var ruta = `${host_ruta}/${id}` 

    
    const qrCode = new QRCodeStyling({
    //width:600,
    //height:600,
    data: ruta, //Variable que contendrá la ruta del perfil del empleado
    margin:0,
    //image: "https://adn.gob.do/wp-content/uploads/2021/12/Azul.svg",
    image: "/IMG/Azul.svg",
    //image: "http://127.0.0.1:8000/IMG/Azul.svg",
    qrOptions:{
        typeNumber:"0",
        mode:"Byte",
        errorCorrectionLevel:"Q"},


    imageOptions:{
        hideBackgroundDots:true,
        imageSize:0.4,
        margin:4},


    dotsOptions:{
        type:"square",
        color:"#105289",
        gradient:null},

    backgroundOptions:{
        color:"#ffffff"},
   
    dotsOptionsHelper:{
        colorType:{
            single:true,
            gradient:false},
            gradient:{
                linear:true,
                radial:false,
                color1:"#6a1a4c",
                color2:"#6a1a4c",
                rotation:"0"}},

    cornersSquareOptions:{
        type:"",
        color:"#105289"},

    cornersSquareOptionsHelper:{
        colorType:{
            single:true,
            gradient:false},

    gradient:{
        linear:true,
        radial:false,
        color1:"#000000",
        color2:"#000000",
        rotation:"0"}},

    cornersDotOptions:{
        type:"",
        color:"#105289"},

    cornersDotOptionsHelper:{
        colorType:{
            single:true,
            gradient:false},
            gradient:{
                linear:true,
                radial:false,
                color1:"#000000",
                color2:"#000000",
                rotation:"0"}},

    backgroundOptionsHelper:{
        colorType:{
            single:true,
            gradient:false},
            gradient:{
                linear:true,
                radial:false,
                color1:"#ffffff",
                color2:"#ffffff",
                rotation:"0"}}
    });
    //
    qrCode.append(document.querySelector("#QRdisplay"));
}





