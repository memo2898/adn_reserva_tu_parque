//=======================

let Seccion = 0

//=======================



function Pruebas(){
    console.log("Activando")
    ModalAbrir()
}
//document.querySelectorAll(".GT_users")[0].classList.remove("GT_users-active")
function Seccion_status(estado){
    let ventana = document.querySelectorAll(".GT_users")
    console.log("Seccion actual: " + estado)

    /*Limpiar_Ventanas()
    ventana[estado].classList.add("GT_users-active")*/

}

function Limpiar_Ventanas(){
    let ventana = document.querySelectorAll(".GT_users")
    ventana.forEach(element => {
        element.classList.remove("GT_users-active")
    });
}


//========================================VENTANA Y OPCIONES MODALES=====================================

function ModalAbrir(){ //ABRIR LA VENTANA
    //let Mensaje = "Probando"
    var ModalS = document.getElementById("Modal_solicitud"); //ABRIR VENTANA MODAL
    ModalS.style.display = "block";
    /*let MOD_Error = document.getElementById("M_Mensaje");
    MOD_Error.innerHTML=`
        <p>${Mensaje}</p>
    `*/
}

function ModalCerrar(){ //CERRAR LA VENTANA MODAL POR BOTON
    var span = document.getElementsByClassName("cerrar")[0];
    var ModalS = document.getElementById("Modal_solicitud");
    ModalS.style.display = "none";
}

window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
    var ModalS = document.getElementById("Modal_solicitud");
    if (event.target == ModalS) {
        ModalS.style.display = "none";
    }
});


//========================================VENTANA Y OPCIONES MODALES=====================================

