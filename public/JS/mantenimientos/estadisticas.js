let fecha_inicial = null
let fecha_final = null

let colores = [
    'rgba(54, 162, 235, 0.6)', // AZUL
    'rgba(130,189,224,0.6)', // AZUL CLARO
    'rgba(213,101,153,0.6)', // ROSA 
    'rgba(221,113,15,0.6)', // NARANJA
    'rgba(247,227,0,0.6)',
    'rgba(0,137,62,0.6)',
]
let color_border = [
    '#004F8D', // AZUL
    '#82BDE0', // AZUL CLARO
    '#D56599', // ROSA
    '#DD710F', // NARANJA
    '#F7E300', // AMARILLO
    '#00893E' //VERDE
]


async function actividad_parque(){
    //estadisticas_reservaciones_fecha_2
    let ruta = '/estadisticas_reservaciones_por_mes'
    let respuesta = await Get(ruta)
    return respuesta
}



async function reservaciones_rango(inicio,fin){
    let ruta = '/estadisticas_reservaciones_fecha'
    let body = {
        'startdate':inicio,
        'enddate':fin
    }
    let respuesta = await Post(ruta,body)
    return respuesta
}


// bar - doughnut - line
async function chart_config(tipo, estados){
    let datos
    if (tipo == 'doughnut') {
        datos = await chart_data_doughnut(estados);
    }else if(tipo == 'line'){
        datos = await chart_data_linear(estados);
    }else{
        datos = await chart_data(estados);
    }
    var configuracion = {
        type: tipo,
        data: datos,
        
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
        
    };
    return configuracion
}



async function chart_data(estados){
    var datos = {
        labels:[],
        datasets: [
            {
                label: estados[0],
                data: estados[1],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
        ]
    };
    return datos
}


async function chart_data_doughnut(estados){
    let header = null
    if (estados[0] == 'Eventos') {
        header = await evento_disponibles()
    }else{
        header = await parques_disponibles()
    }
    var datos = {
        labels:header.map(element => element[1]),
        datasets: [
            {
                label: estados[0],
                data: estados[1],
                //backgroundColor: 'rgba(54, 162, 235, 0.2)',
                //borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: colores.slice(0, estados[1].length),
                borderColor: color_border.slice(0, estados[1].length),
                borderWidth: 1
            },
        ]
    };
    return datos
}






async function chart_data_linear(estados){
    var datos = {
        datasets: [
            {
                label: estados[0],
                data: estados[1],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
        ]
    };
    return datos
}


async function status_count(){
    let reservaciones = await reservaciones_rango(fecha_inicial,fecha_final)
    let contador = {
        'Espera': 0,
        'Pendientes':0,
        'Confirmadas':0,
        'Rechazadas':0,
        'Realizadas':0,
        'Vencidas':0,
    }
    reservaciones.forEach(element => {
        if (element['estado'] == 'espera') {
            contador['Espera']++
        }else if (element['estado'] == 'pendiente'){
            contador['Pendientes']++
        }else if (element['estado'] == 'confirmada'){
            contador['Confirmadas']++
        }else if (element['estado'] == 'rechazada'){
            contador['Rechazadas']++
        }else if (element['estado'] == 'realizada'){
            contador['Realizadas']++
        }else if (element['estado'] == 'vencida'){
            contador['Vencidas']++
        }
    });
    return contador
}




/*
    ||=====================================================
    || EVENTOS FLEXIBLES
    ||=====================================================
*/

async function evento_disponibles() {
    let ruta = '/mantenimientos_eventos_all';
    let respuesta = await Get(ruta);
    //console.log(respuesta)
    let tipo_evento = [];
    respuesta['eventos'].forEach(element => {
        tipo_evento.push([element['id'],element['tipo']]);
    });
    return tipo_evento
}

async function evento_count() {
    let eventos = await evento_disponibles()
    let body_eventos = {};
    for (let index = 0; index < eventos.length; index++) {
        body_eventos[eventos[index][1]] = 0;
    }
    return (eventos,body_eventos)
}


async function event_contador(){
    let reservaciones = await reservaciones_rango(fecha_inicial,fecha_final)
    let ID_eventos = await evento_disponibles()
    let eventos_count = await evento_count()
    reservaciones.forEach(element => {
        ID_eventos.forEach(elements => {
            if (element['id_evento'] == elements[0]) {
                eventos_count[elements[1]]++
            }
        });
    });
    return eventos_count
}


//-------------------------------------------------------


async function parques_disponibles() {
    let ruta = '/estadisticas_parques_all';
    let respuesta = await Get(ruta);
    let tipo_evento = [];
    respuesta.forEach(element => {
        tipo_evento.push([element['id'],element['nombre_parque']]);
    });
    return tipo_evento
}
async function parques_count() {
    let parques = await parques_disponibles()
    let body_parques = {};
    for (let index = 0; index < parques.length; index++) {
        body_parques[parques[index][1]] = 0;
    }
    return (parques,body_parques)
}
async function parques_contador(){
    let reservaciones = await reservaciones_rango(fecha_inicial,fecha_final)
    let ID_parques = await parques_disponibles()
    let parque_count = await parques_count()
    reservaciones.forEach(element => {
        ID_parques.forEach(elements => {
            if (element['id_parque'] == elements[0]) {
                parque_count[elements[1]]++
            }
        });
    });
    return parque_count
}


/*
    ||=====================================================
    || EVENTOS FLEXIBLES - END
    ||=====================================================
*/



/*
    ||=====================================================
    || DISPLAY CHART - START
    ||=====================================================
*/



async function chart_view(){
    let estados = await status_count()
    let packed = ['Reservaciones',estados]
    let configuracion = await chart_config('bar', packed);
    var ctx = document.getElementById('grafico_main').getContext('2d');
    var grafico_main = new Chart(ctx, configuracion);
}

async function chart_view_2(){
    let estados = await event_contador()
    estados = Object.values(estados);
    let packed = ['Eventos',estados]
    let configuracion = await chart_config('doughnut', packed);
    var ctx = document.getElementById('grafico_secundary_1').getContext('2d');
    var grafico_secundary_1 = new Chart(ctx, configuracion);
}

async function chart_view_3(){
    let estados = await actividad_parque()
    let packed = ['Parques',estados]
    let configuracion = await chart_config('line', packed);
    var ctx = document.getElementById('grafico_secundary_2').getContext('2d');
    var grafico_secundary_2 = new Chart(ctx, configuracion);
}

async function chart_view_4(){
    let estados = await parques_contador()
    estados = Object.values(estados);
    let packed = ['Parque popular',estados]
    let configuracion = await chart_config('doughnut', packed);
    var ctx = document.getElementById('grafico_secundary_3').getContext('2d');
    var grafico_secundary_3 = new Chart(ctx, configuracion);
}



/*
    ||=====================================================
    || DISPLAY CHART - END
    ||=====================================================
*/



/*
    ||=====================================================
    || CANVAS MANAGER - START
    ||=====================================================
*/


function limpiar_canvas(select){
    let canvas = document.getElementById(select);
    let graficoExistente = Chart.getChart(canvas);
    if (graficoExistente) {
        graficoExistente.destroy();
    }
}



/*
    ||=====================================================
    || CANVAS MANAGER - END
    ||=====================================================
*/



/*
    ||=====================================================
    || SELECT CONTROL - START
    ||=====================================================
*/


function desplegar_meses(){
    const selectMeses = document.getElementById("meses");
    const fechaActual = new Date();
    const añoActual = fechaActual.getFullYear();
    const mesActual = fechaActual.getMonth() + 1;
    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril",
        "Mayo", "Junio", "Julio", "Agosto",
        "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    for (let i = 0; i < mesActual; i++) {
        const option = document.createElement("option");
        option.value = i + 1; 
        option.text = `${nombresMeses[i]}  (${añoActual})`;
        selectMeses.appendChild(option);
    }
    for (let i = mesActual; i < 12; i++) {
        const option = document.createElement("option");
        option.value = i + 1;
        option.text = `${nombresMeses[i]} ${añoActual}`;
        option.disabled = true;
        selectMeses.appendChild(option);
    }
    selectMeses.selectedIndex = mesActual - 1;
}
desplegar_meses()




async function selector_fecha(){
    let input = document.querySelector('#meses').value
    document.querySelector("#meses").disabled = true
    //-----------------------------
    try {
        let fechaActual = new Date();
        let añoActual = fechaActual.getFullYear();
        //let mesActual = fechaActual.getMonth() + 1;
        let mesActual = input
        let fechaInicial = `${añoActual}-${mesActual.toString().padStart(2, '0')}-01`;
        let ultimoDiaDelMes = new Date(añoActual, mesActual, 0);
        let añoFinal = ultimoDiaDelMes.getFullYear();
        let mesFinal = ultimoDiaDelMes.getMonth() + 1;
        let diaFinal = ultimoDiaDelMes.getDate();
        let fechaFinal = `${añoFinal}-${mesFinal.toString().padStart(2, '0')}-${diaFinal.toString().padStart(2, '0')}`;
        //console.log(`Fecha inicial: ${fechaInicial}`);
        //console.log(`Fecha final: ${fechaFinal}`);
        fecha_inicial = fechaInicial
        fecha_final = fechaFinal
        //console.log(fecha_inicial)
        //console.log(fecha_final)
        //----------------------------------------
        limpiar_canvas('grafico_main')
        limpiar_canvas('grafico_secundary_1')
        //limpiar_canvas('grafico_secundary_2')
        limpiar_canvas('grafico_secundary_3')
        //----------------------------------------
        chart_view()
        chart_view_2()
        //chart_view_3()
        await chart_view_4()
    } catch (error) {
        console.log(error)
        console.log("Error inesperado")
        document.querySelector("#meses").disabled = false
        //selector_fecha()
        /*
        limpiar_canvas('grafico_main')
        limpiar_canvas('grafico_secundary_1')
        limpiar_canvas('grafico_secundary_2')
        limpiar_canvas('grafico_secundary_3')
        selector_fecha()
        chart_view_3()
        */
    }
    document.querySelector("#meses").disabled = false
}



async function select_fecha_start(){
    try {
        await selector_fecha()
        chart_view_3()
    } catch (error) {
        console.log("Error inesperado 2")
    }
}
select_fecha_start()

// grafico_main - RESERVACIONES
// grafico_secundary_1 - EVENTOS
// grafico_secundary_2 - ACTIVIDAD ANUAL
// grafico_secundary_3 - POPULARIDAD DE LOS PARQUES




/*
    ||=====================================================
    || CAMPO DE PRUEBAS - START
    ||=====================================================
*/


