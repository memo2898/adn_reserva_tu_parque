/*
window.addEventListener('resize',function(){
    console.log(window.outerWidth)
    if (window.outerWidth <= 500) {
        if (document.querySelector('.menu-side-bar').classList['1'] == undefined) {
            document.querySelector('.menu-side-bar').classList.add('menu-side-bar_off')
        }
    }else{
        if (document.querySelector('.menu-side-bar').classList['1'] != undefined) {
            document.querySelector('.menu-side-bar').classList.remove('menu-side-bar_off')
        }
    }
})
*/
//document.querySelector('.menu-side-bar').classList.add('menu-side-bar_off') // OCULTAR BARRA LATERAL
//document.querySelector('.menu-side-bar').classList.remove('menu-side-bar_off') // MUESTRA BARRA LATERAL

/*
function bar_display(){
    let svg = document.querySelector('.menu-side-bar')
    svg.classList.add('menu-side-bar_modal')
}
function bar_hide(){
    let svg = document.querySelector('.menu-side-bar')
    svg.classList.remove('menu-side-bar_modal')
}
*/

//menu-side-bar
/*
document.addEventListener("click", function(event) {
    const toastContainer = document.querySelector(".menu-side-bar");
    const isClickedInsideToast = toastContainer.contains(event.target);
    if (!isClickedInsideToast) {
        console.log('Bruh')
        document.querySelector('.menu-side-bar').classList.remove('menu-side-bar_modal')
    }
});*/