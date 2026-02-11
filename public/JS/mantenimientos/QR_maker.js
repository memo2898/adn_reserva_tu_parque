function QRMaker(ruta){
    //var ruta="https://adn.gob.do"; //Editar la ruta por defecto al momento de subir a la servidor

    
    const qrCode = new QRCodeStyling({
    //width:600,
    //height:600,
    width:200,
    height:200,
    //width: -webkit-fill-available,
    //height: -webkit-fill-available,
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
    //let qrCodeBase64 = btoa(qrCode);
    //return qrCodeBase64;
    //canvas = document.querySelector("#QRdisplay").childNodes[3]
    //canvas = document.querySelector("#QRdisplay > canvas").toDataURL()
    //return canvas;
    //=======================================

    //FUNCIONAL
    //qrCode.append(document.querySelector("#QR_pruebas"));
    // PRUEBAS PARA MAYOR FLEXIBILIDAD
    return qrCode
}






async function QR_mostrar(){ // EJEMPLO DE COMO PLASMAR EL QR EN LA PANTALLA
    let ruta = 'https://adn.gob.do' //ENLACE A DONDE APUNTARA EL QR
    let QR_canvas = await QRMaker(ruta) //CREANDO EL QR DE FORMA INTERNA A LA FUNCION
    let lienzo = document.querySelector('#QR_pruebas') // CLASE O ID EN DONDE SE DIBUJARA EL QR
    QR_canvas.append(lienzo) // DIBUJANDO QR EN PANTALLA

    return
    //document.querySelector("#QR_pruebas > canvas").toDataURL() //EXTRAER BASE 64
    let img = document.querySelector('.qr_img') //DIBUJAR EN UNA ETIQUETA IMG
    img.src = document.querySelector("#QR_pruebas > canvas").toDataURL() // DIBUJAR EN LA ETIQUETA IMG POR MEDIO DEL BASE64

}