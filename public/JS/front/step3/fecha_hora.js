//console.log("run!!!")

//Globales
let fecha_capturada={};
let rangoHorariosParque;
window.addEventListener("load", function(){

  acciones_select_fecha()
 
})
//1. Seleccionar el datapicker y hacer un eventlister
function acciones_select_fecha(){

    if(document.querySelector("#dateselector")){
        let datapicker=document.querySelector("#dateselector");
        
        datapicker.addEventListener("input", async function(){
          //1.2. Capturar la fecha y evalucar a que dia de la semana corresponde
            fecha_capturada=capturar_fecha();
            //console.log(fecha_capturada);
            //console.log(id_park) //Var en otra hoja

            let body={
              id_park:id_park,
              dia_semana:fecha_capturada.dia
            }
            let url=`/obtener_fecha_dia_parque`;
  	      //1.3. Hacer fecth a Api para llamar el rango de horas de ese dia
              let horarios_dia_parque= await Post(url,body);
              //console.log(horarios_dia_parque)
              let hora_apertura=horarios_dia_parque[0].hora_apertura
              let hora_cierre=horarios_dia_parque[0].hora_cierre
          //1.4. Determinar rango de horas entre desde y hasta para imprimir    
           rangoHorariosParque=obtenerHorasEnRango(hora_apertura, hora_cierre)
          //console.log(rangoHorariosParque)

          //1.5. Imprimir horarios en el front
          imprimirHorarios(rangoHorariosParque)
        
            
        })

    }
  
} 

function capturar_fecha(){

  // Obtener el valor seleccionado del elemento de selector de fecha
  var selectedDate = document.querySelector("#dateselector").value;

  // Crear un objeto de fecha a partir del valor seleccionado
  var date = new Date(selectedDate);

  // Obtener el día siguiente
  date.setDate(date.getDate() + 1);

  // Obtener la zona horaria de República Dominicana (UTC-4)
  var timeZone = "America/Santo_Domingo";

  // Opciones para el formato de fecha
  var options = {
  weekday: 'long' // Obtener el día de la semana en formato largo (ejemplo: "martes")
  };

  // Obtener el día de la semana del día siguiente en la zona horaria de República Dominicana
  var dayOfWeek = date.toLocaleDateString('es-DO', options);

  // Imprimir el día de la semana del día siguiente
    let fecha_construida={
      fecha:date,
      dia:dayOfWeek
    }
  return fecha_construida;
  
}

function obtenerHorasEnRango(horaInicio, horaFin) {
  let cont_horas=[];
  var horas = {};
  
  // Convertir las horas de inicio y fin en objetos de fecha
  var horaInicioObjeto = new Date('1970-01-01T' + horaInicio);
  var horaFinObjeto = new Date('1970-01-01T' + horaFin);

  // Obtener la hora de inicio
  var horaActual = new Date(horaInicioObjeto);
  
  var contador = 1;
  while (horaActual <= horaFinObjeto) {
    var hora24 = horaActual.toTimeString().substr(0, 8);
    var hora12 = horaActual.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    
    var item = {
      valor24horas: hora24,
      valor12horas: hora12
    };

    horas['hora_' + contador] = item;
    cont_horas.push(item)
    // Incrementar 30 minutos
    horaActual.setMinutes(horaActual.getMinutes() + 30);
    contador++;
  }



  return cont_horas;
}

function  imprimirHorarios(rangoHorariosParque){
  let htmlHorarios=`<option value="" disabled="disabled" selected>-- Seleccione un horario --</option>`;
  let htmlhorario=``;

 // console.log(rangoHorariosParque)
  //console.log(rangoHorariosParque.length)

  let select_desde=document.querySelector("#hora-select-desde");
  let select_hasta=document.querySelector("#hora-select-hasta");

  rangoHorariosParque.forEach(horario => {
     htmlhorario=`<option value="${horario.valor24horas}" >${horario.valor12horas}</option>`;
     htmlHorarios+=htmlhorario
  });
  

//1.4. Imprimir en los input select los horarios desde/hasta
select_desde.innerHTML=htmlHorarios
select_hasta.innerHTML = '<option> -- Seleccione un horario -- </option>'
select_hasta.setAttribute("disabled", "disabled");
//select_hasta.innerHTML=htmlHorarios
accionar_desde_por_hasta(select_hasta,select_desde)
 
}


function accionar_desde_por_hasta(select_hasta,select_desde){
  //Crear un listener input al input select desde que englobe:
  select_desde.addEventListener("input" ,function (){
    //.Quitar el disabled
    select_hasta.removeAttribute("disabled")
    //2. tomaar los valores del input_desde y solo imprimir los valores que esten 2 posiciones por delante de en el inpunt_hasta
    let indexSelected=select_desde.selectedIndex-1;
    //console.log(indexSelected)
    //-------------------------------------------------------------------------------
    let htmlHorarios=`<option value="" disabled="disabled" selected>-- Seleccione un horario --</option>`;
    let htmlhorario=``;
/*
    rangoHorariosParque.forEach(horario, index => {
      if(index >=indexSelected &&  index >= rangoHorariosParque.length){
        htmlhorario=`<option value="${horario.valor24horas}" >${horario.valor12horas}</option>`;
        htmlHorarios+=htmlhorario
      }
      select_hasta.innerHTML=htmlHorarios
   });*/

   for (let i = 0; i < rangoHorariosParque.length; i++) {
      if(i >= indexSelected+2){
        htmlhorario=`<option value="${rangoHorariosParque[i].valor24horas}" >${rangoHorariosParque[i].valor12horas}</option>`;
        htmlHorarios+=htmlhorario
      }
      select_hasta.innerHTML=htmlHorarios
   }
   
    //-------------------------------------------------------------------------------

  });
   
  }

///2. Agregar dependecia al input hasta atandolo siempre a ser mayor o al menos una hora de diferenca al input desde. (Listener a ambos input)


