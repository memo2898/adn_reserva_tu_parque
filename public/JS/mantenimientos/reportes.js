let inicio = null
let fin = null




/*
    ||=======================================
    || DESPLAZAMIENTO POR LAS OPCIONES
    ||=======================================
*/

async function report_select(reporte){
    //console.log("Seleccionado - " + reporte)
    if (reporte == 'reservaciones') {
        //--------------------
        document.querySelector('.contenido').style.display = 'none'
        document.querySelector('.cuerpo_secundario').style.display = 'block'
        //--------------------
        //console.log("Inicializando")
        await Inicializar_tabla(reporte)
        document.querySelector('.contenido').style.display = 'none'
        document.querySelector('.cuerpo_secundario').style.display = 'block'
    }else{
        console.log("Desconocido")
    }
}

async function retroceder(){
    //console.log("Retroceder")
    document.querySelector('.cuerpo_secundario').style.display = 'none'
    document.querySelector('.contenido').style.display = 'block'
    //---------------------
    await limpiar_select()
    selector_fecha('init')
    document.querySelector("#myTable > thead > tr > th:nth-child(2)").click()
}



async function limpiar_select(){
    document.querySelector('#input_desde').innerHTML = ''
    document.querySelector('#input_hasta').innerHTML = ''
    /*
    let select = document.querySelector('.input_select')
    for (let index = 0; index < select['options'].length; index++) {
        console.log(select['options'][index])
        console.log(index)
        select['options'][index].remove()
    }
    */
    document.querySelector('.input_select').innerHTML = ''
}


// 


/*
    ||=======================================
    || LABORATORIO 
    ||=======================================
*/
function get_report(){
    //console.log("Get")
}



function realizar_reporte(){
    //console.log("Reporte")
    pdf_try_3()
}


/*
async function Try(){
    let ruta = '/reportes_prueba'
    let body = {
        'startdate':inicio,
        'enddate':fin
    }
    let respuesta = await Post(ruta,body)
    //console.log(respuesta)
    return respuesta
}
*/


let packed = null
async function Inicializar_tabla(reporte){
    let datatable = $('#myTable').DataTable();
    let ruta = '/reportes_desplegar'
    let body = {
        'startdate':inicio,
        'enddate':fin
    }
    //--------------------------------------------------------
    let headerCells = $('#myTable thead th');
    let tableheader = ['Parque','Codigo','Fecha evento','Participantes','Estado']
    headerCells.each(function(index) {
        $(this).text(tableheader[index]);
    });
    //--------------------------------------------------------
    let select = document.querySelector('.input_select')
    let option = null
    //formatear_select(select)
    //--------------------------------------------------------
    let respuesta = await Post(ruta,body)
    //console.log(respuesta)
    let contenido = []
    //========================================================
    datatable.clear().draw();
    for (let index = 0; index < respuesta['reservaciones'].length; index++) {
        contenido[index] = [
            respuesta['reservaciones'][index]['id_parque'],
            respuesta['reservaciones'][index]['codigo_reservacion'],
            respuesta['reservaciones'][index]['fecha_evento'],
            (respuesta['reservaciones'][index]['cantidad_participantes_ninos'] + respuesta['reservaciones'][index]['cantidad_participantes_adultos']),
            respuesta['reservaciones'][index]['estado'],
        ]
    }
    if (reporte != undefined) {
        option = document.createElement("option");
        option.value = 'todos'
        option.text = 'Todos'
        select.appendChild(option)
        for (let index = 0; index < respuesta['parques'].length; index++) {
            option = document.createElement("option");
            option.value =  respuesta['parques'][index]['id']
            option.text = respuesta['parques'][index]['nombre_parque']
            select.appendChild(option)
        }
        try {
            document.querySelector("#myTable > thead > tr > th:nth-child(3)").click()
        } catch (error) {
            //console.log("Error inesperado")
        }
    }
    else{
        //---------------
    }
    packed = contenido
    //datatable.rows.add(contenido).draw();
    //console.log(packed)

    //-------------- NUEVA
    //contenido = select_filtre()
    select_filtre()
}




async function alter_table(resolver){
    //console.log("Alterando")
    let datatable = $('#myTable').DataTable();
    datatable.clear().draw();
    datatable.rows.add(resolver).draw();
}


/*
function block_select(){
    let input_init = document.querySelector('#input_desde')
    let input_end = document.querySelector('#input_hasta')
    console.log("Actividad")
    for (let index = input_init.value; index < input_init['options'].length; index++) {
        if (index < input_end.value) {
            input_init['options'][index].disabled = false
        }else{
            input_init['options'][index].disabled = true
        }
    }
    //=====================================================
    for (let index = 0; index < input_end.value; index++) {
        if (index < (input_init.value-1)) {
            input_end['options'][index].disabled = true
        }else{
            input_end['options'][index].disabled = false
        }
    }
}
*/



function flex_select(origen){
    console.log("origen")
    let input_init = document.querySelector('#input_desde')
    let input_end = document.querySelector('#input_hasta')
    console.log('1er input - ' + input_init.value)
    console.log("2do input - " + input_end.value)
    if (origen == 'desde') {
        if (input_init.value > input_end.value) {
            console.log("Init mayor")
            input_end['options'][input_init.value-1].selected = true
            selector_fecha(origen)
        }else{
            console.log('Init inferior')
            selector_fecha(origen)
        }
    }else if(origen == 'hasta'){
        if (input_end.value < input_init.value) {
            console.log("3")
            input_init['options'][input_end.value-1].selected = true
            selector_fecha(origen)
        }else{
            console.log('4')
            selector_fecha(origen)
        }
    }
    else{
        //console.log("Activo")
        //selector_fecha(origen)
    }
    console.log('===========')
    console.log('1er input - ' + input_init.value)
    console.log("2do input - " + input_end.value)
}


/*
function flex_select(origen){
    console.log("origen")
    let input_init = document.querySelector('#input_desde')
    let input_end = document.querySelector('#input_hasta')
    let valor_init = input_init.value;
    let valor_end = input_end.value;
    console.log('1er input - ' + input_init.value)
    console.log("2do input - " + input_end.value)
    if (origen == 'desde') {
        if (valor_init > valor_end) {
            console.log("Init mayor")
            input_end['options'][input_init.value-1].selected = true
            selector_fecha(origen)
        }else{
            console.log('Init inferior')
            selector_fecha(origen)
        }
    }else if(origen == 'hasta'){
        if (valor_end < valor_init) {
            console.log("3")
            input_init['options'][input_end.value-1].selected = true
            selector_fecha(origen)
        }else{
            console.log('4')
            selector_fecha(origen)
        }
    }
    else{
        //console.log("Activo")
        //selector_fecha(origen)
    }
    console.log('===========')
    console.log('1er input - ' + input_init.value)
    console.log("2do input - " + input_end.value)
}
*/

async function select_filtre(origen){
    let filtro = document.querySelector('.input_select')
    let resultado = null

    if (filtro.value == 'todos') {
        resultado = packed
    }else{
        filtro = parseInt(filtro.value);
        resultado = await packed.filter(item => item[0] === filtro);
    }
    if (origen == 'reporte') {
        return resultado
    }else{
        alter_table(resultado)
    }
}

/*
    ||==========================================================
    ||WINDOWS LISTENERS
    ||==========================================================
*/


document.querySelector('#input_desde').addEventListener('change', function() {
    flex_select('desde')
});

document.querySelector('#input_hasta').addEventListener('change', function() {
    flex_select('hasta')
});
// 


async function selector_fecha(origen){
    if(origen == 'init'){
        await desplegar_meses('input_desde')
        await desplegar_meses('input_hasta')
    }
    //console.log('Origen - ' + origen)
    let input_init = document.querySelector('#input_desde').value
    let input_end = document.querySelector('#input_hasta').value
    let fechaActual = new Date();
    let añoActual = fechaActual.getFullYear();
    //let mesActual = fechaActual.getMonth() + 1;
    let mesActual = input_init
    let fechaInicial = `${añoActual}-${mesActual.toString().padStart(2, '0')}-01`;
    let ultimoDiaDelMes = new Date(añoActual, mesActual, 0);
    let añoFinal = ultimoDiaDelMes.getFullYear();
    //let mesFinal = ultimoDiaDelMes.getMonth() + 1;
    let mesFinal =input_end
    let diaFinal = ultimoDiaDelMes.getDate();
    let fechaFinal = `${añoFinal}-${mesFinal.toString().padStart(2, '0')}-${diaFinal.toString().padStart(2, '0')}`;
    //console.log(`Fecha inicial: ${fechaInicial}`);
    //console.log(`Fecha final: ${fechaFinal}`);
    inicio = fechaInicial
    fin = fechaFinal
    if (origen == 'desde' || origen == 'hasta') {
        //console.log("Entro")
        Inicializar_tabla()
    }
    //Inicializar_tabla()
}




/*
    ||=======================================
    || PDF CONVERTER
    ||=======================================
*/

/*
function pdf_try(){
    // Obtiene los datos de la tabla.
    const table = document.getElementById('myTable');
    // Crea un array de contenido para el PDF.
    const pdfContent = [];
    // Convierte los elementos seleccionados en un array y luego agrega el contenido de la tabla al array.
    pdfContent.push({
        table: {
            headerRows: 1,
            body: [
                // Encabezado de la tabla
                Array.from(table.querySelectorAll('thead th')).map(th => th.innerText),
                // Filas de la tabla
                ...Array.from(table.querySelectorAll('tbody tr')).map(tr =>
                    Array.from(tr.querySelectorAll('td')).map(td => td.innerText)
                )
            ]
        }
    });
    // Define las opciones del documento PDF.
    const pdfDoc = {
        content: pdfContent
    };
    console.log(pdfContent)
    console.log(pdfDoc)
    // Genera el PDF y abre un nuevo tab para mostrarlo.
    pdfMake.createPdf(pdfDoc).open(); //ABRIR DIRECTAMENTE OTRA PESTAÑA
    //pdfMake.createPdf(pdfDoc).download();
}





function pdf_try_2() {
    //const table = document.getElementById('myTable');
    const pdfContent = [];
    const content = packed; 
    const headers = ['Parque','Codigo','Adultos participantes','Niños participantes','Estado']
    pdfContent.push({
        table: {
            headerRows: 1,
            widths: Array(content[0].length).fill('*'),
            body: [headers]
        }
    });
    content.forEach(row => {
        pdfContent[0].table.body.push(row);
    });
    const pdfDoc = {
        content: pdfContent
    };
    pdfMake.createPdf(pdfDoc).open(); // Abre el PDF en otra pestaña
    // pdfMake.createPdf(pdfDoc).download(); // Descarga el PDF
}
*/
// 





/*

function pdf_try_3(){
    //---------------------------------------
    const pdfContent = [
        { text: 'Título del Documento', style: 'header' },
        {
            image: base64_logo, 
            width: 500, alignment: 'center'
        },
        'Estructura experimentar de reporte en PDF',
        local_sesion['usuario'],
        {
            text: 'Tabla de Ejemplo',
            style: 'subheader'
        },
        {
            table: {
                headerRows: 1,
                body: [
                    ['Columna 1', 'Columna 2', 'Columna 3', 'Columna 4', 'Columna 5'],
                    ['Dato 1', 'Dato 2', 'Dato 3','Dato 4', 'Dato 5'],
                    ['Dato 6', 'Dato 7', 'Dato 8','Dato 9', 'Dato 10']
                ]
            }
        }
    ];
    //----------------------------------------------
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20] // Margen inferior
        },
        subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5] // Margen inferior
        }
    };
    //----------------------------------------------
    const docDefinition = {
        content: pdfContent,
        styles: styles
    };
    
    // Genera el PDF y ábrelo en una nueva ventana del navegador
    pdfMake.createPdf(docDefinition).open();
}

*/

// 
/*

async function pdf_try_3() {
    //select_filtre('reporte')
    // const content = packed; // ORIGINAL Y FUNCIONAL

    const content = await select_filtre('reporte')
    let headers = ['Parque','Codigo','Fecha evento','Participantes','Estado']
    let tiempo_actual = await actual()
    // ---------------------------------------
    // --
    // ---------------------------------------
    const pdfContent = [
        { text: 'Título del Documento', style: 'header' },
        {
            image: base64_logo,
            width: 500,
            alignment: 'center'
        },
        'Estructura experimentar de reporte en PDF',
        local_sesion['usuario'],
        //tiempo_actual,
        {
            text: 'Tabla de Ejemplo',
            style: 'subheader'
        },
        {
            table: {
                headerRows: 1,
                widths: Array(content[0].length).fill('*'),
                body: [headers]
            },
            style:'table_style'
        }
    ];
    //----------------------------------------------
    content.forEach(row => {
        pdfContent[5].table.body.push(row);
    });
    //----------------------------------------------
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20], // Margen inferior
        },
        subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5] // Margen inferior
        },
        table_style:{
            //color: '#00569C',
        }
    };
    
    //----------------------------------------------
    const docDefinition = {
        content: pdfContent,
        styles: styles
    };
    pdfMake.createPdf(docDefinition).open();
    //select_filtre()
    Inicializar_tabla()
}

*/


// 


async function pdf_try_3() {
    const content = await select_filtre('reporte')
    let maestro = await status_count()
    maestro = Object.values(maestro)
    let headers = ['Parque','Codigo','Fecha evento','Participantes','Estado']
    let tiempo_actual = await actual()
    //let texto = ['bruh1','bruh2','bruh3']
    // ---------------------------------------
    const pdfContent = [
        {
            image: base64_logo,
            width: 500,
            alignment: 'center'
        },
        { text: 'Título del Documento', style: 'header' },
        //'Estructura experimentar de reporte en PDF',
        //local_sesion['usuario'],
        //tiempo_actual,
        // -----------------------------------------
        {
            columns: [
                {
                    width: 'auto',
                    text: 'Reporte emitido por: ' + local_sesion['usuario'],
                },
                {
                    width: '*',
                    text: tiempo_actual,
                    alignment: 'right' 
                }
            ],
            //style:'t1'
        },
        {
            text: [
                {
                    text:'\nMaestro del reporte',
                    style: 'subheader'
                },
            ],
        },
        {
            table: {
                headerRows: 1,
                widths: Array(6).fill('*'),
                body: [
                    ['Espera','Pendiente','Confirmadas','Rechazadas','Realizadas','Vencidas'],
                    //['7','20','12','9','13','5'] // 
                    [maestro[0],maestro[1],maestro[2],maestro[3],maestro[4],maestro[5]]
                    //[maestro]
                ],
                style:'table_edit'
            }
        },
        // -----------------------------------------
        {
            text: 'Detalle del reporte',
            style: 'subheader'
        },
        {
            table: {
                headerRows: 1,
                widths: Array(content[0].length).fill('*'),
                body: [headers]
            },
            style:'table_style'
        }
    ];
    // ----------------------------------------------
    content.forEach(row => {
        //pdfContent[5].table.body.push(row);
        pdfContent[6].table.body.push(row);
    });
    // ----------------------------------------------
    const styles = {
        header: {
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [0, 0, 0, 20], // Margen inferior
        },
        subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 10, 0, 5] // Margen inferior
        },
        t1:{
            color: '#00569C',
            //display:'flex',
        },
        table_edit:{
            with: 'auto'
        }
    };
    
    // ----------------------------------------------
    const docDefinition = {
        content: pdfContent,
        styles: styles
    };
    // ----------------------------------------------
    //console.log(docDefinition)
    //console.log(pdfContent)
    // ----------------------------------------------
    pdfMake.createPdf(docDefinition).open();
    Inicializar_tabla()
}





async function organizar_parque(contenido){
    let Orden_parques = {
        realizada: 1,
        confirmada: 2,
        rechazada: 3,
        pendiente: 4,
        espera:5,
        vencida:6,
    };
    let Array_organizado = contenido.sort((a, b) => Orden_parques[a[a.length - 1]] - Orden_parques[b[b.length - 1]]);
    //console.log(Array_organizado)
    return Array_organizado
}



async function actual(){
    let fechaYHoraActual = new Date();
    let año = fechaYHoraActual.getFullYear();
    let mes = fechaYHoraActual.getMonth() + 1;
    let dia = fechaYHoraActual.getDate();
    let hora = fechaYHoraActual.getHours();
    let minutos = fechaYHoraActual.getMinutes();
    let periodo = hora >= 12 ? 'PM' : 'AM';
    if (hora > 12) {
    hora -= 12;
    }
    hora = hora < 10 ? '0' + hora : hora;
    minutos = minutos < 10 ? '0' + minutos : minutos;
    let formatoFechaHora = dia + '/' + mes + '/' + año + ' ' + hora + ':' + minutos + ' ' + periodo;
    return formatoFechaHora
}








async function status_count(){
    //let reservaciones = await reservaciones_rango(fecha_inicial,fecha_final)
    let reservaciones = await select_filtre('reporte')
    let contador = {
        'Espera': 0,
        'Pendientes':0,
        'Confirmadas':0,
        'Rechazadas':0,
        'Realizadas':0,
        'Vencidas':0,
    }
    reservaciones.forEach(element => {
        if (element[4] == 'espera') {
            contador['Espera']++
        }else if (element[4] == 'pendiente'){
            contador['Pendientes']++
        }else if (element[4] == 'confirmada'){
            contador['Confirmadas']++
        }else if (element[4] == 'rechazada'){
            contador['Rechazadas']++
        }else if (element[4] == 'realizada'){
            contador['Realizadas']++
        }else if (element[4] == 'vencida'){
            contador['Vencidas']++
        }
    });
    return contador
}


/* ------------------------------------------------------------------------------
    ||=======================================
    || CRUD
    ||=======================================
*/




async function Actualizar_tabla(){ // SI ADAPTAR
    let miTabla = $('#myTable').DataTable();
    let ruta = '/mantenimientos_documentos_all'
    let body = []
    let acciones = ``
    let select = ``
    // ------------------------------------
    let respuesta = await Get(ruta)
    // ------------------------------------
    miTabla.clear().draw();
    for (let index = 0; index < respuesta.length; index++) {
        //=====================================================
        if (respuesta[index]['estado'] == 'activo') {
            select = `
            <select class="input_custom data_input_${respuesta[index]['id']}"> 
                <option value="activo" selected >activo</option>
                <option value="inactivo">inactivo</option>
            </select>
            `
        }else{
            select = `
            <select class="input_custom data_input_${respuesta[index]['id']}"> 
                <option value="activo">activo</option>
                <option value="inactivo" selected>inactivo</option>
            </select>
            `
        }
        //=====================================================
        acciones = `
        <div class="btn_section">
            <div class="btn_style btn_guardar data_input_${respuesta[index]['id']}" onclick="Guardar_tipo(${respuesta[index]['id']})">
                Guardar
            </div>
            <div class="btn_style btn_eliminar data_input_${respuesta[index]['id']}" onclick="Eliminar_tipo(${respuesta[index]['id']})">
                Eliminar
            </div>
        </div>
        `
        //=====================================================
        body [index]= [
            '<input type="text" value="'+respuesta[index]['tipo_documento'] +'" class="input_custom data_input_'+respuesta[index]['id'] +'">', 
            select,
            acciones
        ]
    }
    miTabla.rows.add(body).draw();
}



/*
    ||=======================================
    || COMPONENTES ADICIONALES
    ||=======================================
*/


async function desplegar_meses(select){
    const selectMeses = document.getElementById(select);
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
        option.disabled = true; // DESCOMENTAR ESTA LINEA DESPUES
        selectMeses.appendChild(option);
    }
    if (select == 'input_hasta') {
        selectMeses.selectedIndex = mesActual - 1;
    }else if(select == 'input_desde'){
        selectMeses.selectedIndex = 0;
    }
    else{}
}
//desplegar_meses('input_desde')
//desplegar_meses('input_hasta')


selector_fecha('init')

/*
async function selector_fecha(){
    let input = document.querySelector('#input_desde').value
    console.log(input)
    return input
    //document.querySelector("#meses").disabled = true
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
        //------------------------------------------
        inicio = fechaInicial
        fin = fechaFinal
    } catch (error) {
        console.log("Error")
    }
    //document.querySelector("#meses").disabled = false
}
*/







let base64_logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA2IAAABxCAYAAAC3BRA6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACAASURBVHic7J15fFNl9oefc5O2FAoIAiogbuMGorjMz2VQccZlGKUtYFKQQYW21BWldZ9Ro+PGQIuiom1TUMeFJsrqLgLqzOgorkgVcUHBHYGWrUvuPb8/km60tEmatKD3+XxC7/Iu54ab5J73Pe/3CB2GCmOL9sY0ikDeoiahhPkX/dJx9tjY2NjY2Ni0Fc+yr44QyzjVQH+vcBhwINAN2AtQoDz0+hrV1Yi8Y6n5uufMQz7rOKttbOLPuikFyZ93r6g5w+MJdLQtNrsH0uYWXMVnIXIUvsx7QTT8eg+mQNLrCIMBC5iDL+uSyPr2JWJU3IKlJfizv4rMcBsbGxsbmzbiKhkKTEV0ELABlVnQ9T78brOjTWtPPEu+PlhEJwpkAL+LrhVdoypzDZM5N59zoP2bDuRdlD42KWGbI9J65yUkWH33ceA4rNKIhR2VXxyzPvD14VvCLV8NPx7jzV5fu3/PK190107OqGypCgzY4jlDwnNcPMM6kRRIjqYfqnZU4Xl3e1R1G7DM43H2WbfPcRiO01A91hSOUPQgJ9ID4K6tlfc/sSPwJeh2LNmEWN+Q6FiDP3djW/u22fNomyPm8o5H+BtwOMr7dHGcwiMTKsOq6y45A/QCIAsA5Uoc/Ie5We+HVT+j8BDU+V/QPqj8F8O8mtJJ70R5JTY2NjY2NpHh8p6LsAjY+QHzUXxZF3eARe3O7a+sG4xh3gKMoun7EC0W6NOIcfstfzxgVYzajJqPsx9+cNDmnpOlA5zr6y4ebuX0+G9Uz2pKCj3HbcLRrc2+Bb8svIQdnx0bSe/TBxVfcm3t3u2vrl1DlA66KB+YDucIzxn917dY8J/DhqDWYqB/NP0ARVz/ek40FdXjMT75tu8fVfQCVUZLcAa4WS7avIMV1c3eSt8DryO8hhFYzLzrW75em18FbfzSNF6k9oMlbGeHNZrxj3VptZprdm+UO4DMumPCTCyuCqtbV8nhaMJBoHsH62oPSrNXRGy+jY2NjY1NNLh8DoSHaf539CLGFJ/a3ia1J57n13S77dW1MzHM94HziZ0TRrAtcaP6we2vfj3Ds+ynlBi2HRFlkwrTBbmsrPvGCzui/5mbh8m6QI+o6gpbKX/+kBhb1P6oMMSwAm/d/sraXXuCU08bhVr/IXonLCpWuXyJZVkPX1j27X6rFH0FZUJLTlgr7AdkoMzCdH5NWsEy0vIvxOVJjKXNNrsX0X9xji48ArHmAbVDLX9A9UGqAie3WO/iOZ2okRqoPAeorj8hK/BlXYxrzr6t9i30BWsBUDtdn4K75A1cPvtmtbGxsbGJP8bmQ2jpoc+UM9rPmPbF8+ra44ykhHcFrqT+dzgeOEGvNqzt73qWfTUkjv00yzKPx6nKnQCI3PFhOAPNMaZSndyyYXjU9c1N66n6rF8MLeow+mHw+j+WfH1ekzP/PO0qwA90bk+DyrIezmCvTV+oyKPAETFu3gAdBjxKddfPSc+/2nbIfp1E74h1TVyLSgHQte6Y8AC+iUsYW3z0LuttD3hJNK+jS+cAUFV/Qn/G5UtGzMfIKJ7QbN1Rxf1xl7jxZS5Deb3Bmc6o41J+LrOivh4bGxsbG5twsVp56JP2fShsL2579esRBrxB1OvAouIww5J/37Z07bnt2Cf7fNt3EjAwtNs3IXnH1e3Zfy2vb/8dL2w7Mqq6gsWW11LAarskwG5Aioou+MerX18JgGeYk6mnPYRyL7GdkW2RVZMKB6zKfvhVFZlL+8zA7Y8yg5puH5OW/5d26M+mHTFwzz6TDO8TuL2PMKkwIbhf2PJc9qjC/dgWOAV/5nxgXYMzKbiKD8KUV4MLmLX+kz+68AhGFfcHhgE3sj2wkcbTt2ch5b8AZ6H8Cbf3DwyfmQTApMIERj7UB6fcAdyPu2Q0og2dvVfwT1hJn345XDynU4u2ux5MYZjHiXv2mbi9N5Lhvd+eSbOxsbGxsWmZ25Z+lSboPNp55iFEF1Hm3/bq2uinhyJg1WUPpqjqzQ2PqXLDyqzifdqj/525fcOf2WIlRVc58APly6Nz5HZDHIrOnPDYW3NxJr4LRCby1kZWZj08Si0+BPlje/YLgOqhwHOk5/tIn7FXu/cfDqnTzyJ1atfWC9rUYqApy1AqgYvYbDwP5qJWazmdExBZjNs7H+hdd1y5HJHPgF6INQ53yetBdUTAYfwJp6wA6R4sLDur2iTUHRMZCiwjJbkvAJscZ5PgXAKcBtoH9GmQhnPtp+HyLgF5gMrASS3aLp3upE//FWBmA3ehuha/u7rFOjY2NjY2Nr9h7nj1y/8TlbmAswPNSBB4ul3CFKudNyDsvFQixWFYNzdbPs78ZHZlxqZhUdevWb0Zs+LXMUm7qWIbi5d9lMHnxx5NIKHd+i3LLrrKEHlahI51ghQX6NuMKBjUoXbsTFr+XxB5HnE+i8fTbjOUezoGfreJyj+Du3ImyEpKc77A7b2R0XMObVLDXXw5aArBEbF0oOEMlJO6L2m5BDgJSToDl7cnKiOBfYDWF90qBwCCYUzC9Wg/hMtABgMH7aJGX4Q/AWBxPBnerCYlxhSdgmvOYNTwAseAuIEv8GXnt2qPjY2NjY3Nb5R7Xvmiu4VRSuPf+46is2Hhi6eAx6cTS/oiNBuGqErOyqziDple+lf5//FBVbTrvbZR/nzTR7o9jXU/bKSodBkbNm6BTX1g1VCoiq+Dqaisyi68X9F7iUXap1igeiiGvkna9HM62pQ6xPgvyLsIc/B47KVCYWKE/j2gwbHfMaakL8o4HKYXl/f/yPAeVX9azgRuCLN9J7AAQ05E9JQIbXNi6QjEPBI4M/xqMr3R7tjioxn5UB8s4wUIHI4ROLjB2V/FClYbGxsbG5t4US3G7QSTMu8myKFi7rgpXq2bzsAdwK6EOZyGmHfGq++WsBBu3fAXzCiXQ5mbvqFq9Z772LNqzXoemfc623Y0kBfY1g1Wngrb4jdJVZZVNA24Im4dRE9XkEWkT2+XcN06dhV6uGDKZsorhrIg75Fmz6fln4LLF09xnz2S4Kc52XgdmA0EgJ5YuhZhEHAaUIxyJ66SobiKzyc4CxbBiIDcSWnmC4hRG8f7YxiVfgRqcMjZ+CYuQVkOhJ1IEOWaum1TXichYRbQDZGHUXkgdKYGtCDsNm1sbGxsbH5jeJZ9dSAil3a0HTsjorl3vr52v1i3+8mkwsEorUjVy8hVkwqHxrrvcPi4aj+eqDghqrp7snDHWx98ju+Ft6kJNJN/q7oTfDwUNsb8dqBsUuF1CHmxbLOr8C7oEmAF4T0Tt0QiKs8wsuD0GJjWOunTj0ecn5M6fVTdMY/HIC3/R1LzP2C5J0BawWOh/fp0A2kFI4HXqFr3SLvYuQcRDCMMJmHOxFU8C5HnCIYQBhGOBo5GNBVxHI9afsAFmLQsW1sFcjtoMAGG6qbQl1s2Empf+QihN8pGhO7Uqc/ogyDdqKoOhGxYisgLqM4I45q2gyzBXTwZpHYaeXTo3N6h9leihgt/1uow2rOxsbGxsflNIpZMBtpvIU74JAVquBz4eywbtVSngbQ+aq+Sr+hJgmgs+w+H6Rv/yDmdP2EfZ/jj03WYP1C+7Ei6/6ks9oa1zFxU+0RTccHS90a8t6oVp9t0wOrfw6HvvUqv9V9EZaHqGw13V2Y9NEyVu6JqqwUe7NEpd2DhJfXK3yMf2Bur+jTQdIKJ0SMNu03G0vmk//P3LLguumsPG2MIaG9EjgPmAbBqoMC6PgjBZ3asvUD6YEj994bI+6iuA/lPfO3b82i86Naf/S5ubxkNHbF6PmeHriFJfYj0QqlEGA5YwAvAOcCNYK0E4zKQatR6Cn/2VwD4shYD4JrzAWoWg96EP3sp7hI/wsto19lI+dWIHINlPYo/55u6nn1ZUxkze3/UOg2MFZjmQhzGtcB5QA/qZEt1PiLHUJp5Be6SMxqpNjZCnsKfaTthNjY2NjY2u8DjUUP06zG7yaqYJgiMI4aO2MeTCs9ACXPNjf5fWVbhaLw8Hav+w2WblcgdG8/h/j7RdV2zerOav+8ijm7bYmzZrrnlTwdGL3KSlj+MYLLjllGBNcf/m2lPeqLuK8TKrOJ9DLHmEt88eUHmX/ELMB+YT/qMq7CsqxCuZdfhsc3RA8vxDK6Ck/Hn7oiPocCC3BLSC1ayIPftumN+t0l6wYkgQeE708rD6byD7eaq+npT1jKi8CgW52xv0uZvnMaBxmNm7w80l4RyPcKbdLJOhe7z2WGeh6GFiHwKOgJf1nnAOwD4Jr3EwPUjCVhT6pywhvgnrMQ0R+LPXtr4uNvEl52P5biukRNWy9yJ66gJXIIv8y6embQK6I1wC2IdicinqDyLcifC+cEKmoewptmrFnJae2NsbGxsbGx+05z69RAkjAfgjuPAfyz98vBYNKQejyHK9NZLNsCQqWuunBmlpnzbeH7rQJZuPyy6yrJNNj/Xnmng9jxErHtpflIiviyYsplFebchxlHQKF9u6wjHUKUxn8FrwoLctxkx4zjS8otJK7gAVFDNRs0LAHA4zkY1m87O3qTO+ANp+cWkF+TZTljzNHbE5k5YD/IgsLVxMd0bSx/Bl/08frfJ4pztlGYvBGsUvuzngWD4IBzOiMLOfNR/f+ZlrwdgbGEv3N41uL0r6nJ8zcv5HneJnwzvZaDdUd2PDO/9uL2n4Z/wAwAub0/c3ntwlaTWmTH/0p/IKDkmNNN1OGp8Rumkz7D0IgLOi/Fnv8vcrPcB6Ow4H9UXm16yrkTlura/dTY2NjY2Nr9eBDm+o21oDUvluFi0s+q7/cYDkbWlHFxdldRhA7ueDcPZbkUXNWpt/oYdn+4fY4t+HXySXXS6QEaHGrFgylr2STkTKI6onnAl6QX/Fx+jGuCwDgKywPoDLr8R3JZxwZN6TnBf+4B1OJCFarsmY9+T2El6RxRf5hWocSKwCfgQ+CdqvFo3gzWmeBiu4qCMfGn2J8HkyF4fFtWgJ5LsmItTb69rsppewMHAYLZpvdKKWPko9wNnIdwGjECNTxoYcy5wPUaDdWGpJV1RfRX37BLgQMTcisv7Z/xZbzP/ol8aXcojEyoxdC6wHWUVYKL8D+1+Ir5MX1veNBsbGxsbm18/ekDrZToWQ9qu5vjVxXM6iXJ76yWbQfGsyvT2bKsN0fBtoDuzyk+Nqq5gsfX1TnukcEc8UVSsoJBbx78xRTk1LMzNAQojqOUAfWDXS3NiRLX5H9Q6D8uYFUyDZZ2HhERu1Lgdtc4joXo1zsDLqHUeWDfG1Z54MHxmt/ZQpGw+MaN/Yhku71UIsxBZTmfjVgDcxX/BkucQNuDx7IPHY7HcE8BV/B4id4fu28EYDUaonsn5FHfJDLB645/4c93x0uy3cHtfA/YH6YbFg43O060UKmaiDdRqFmVuIcP7MKp/A0DlZQxmAsGZr4vndGK7NRusGvaysthgfEun6v5YSYdg6dsYkkOpO36xszY2NjY2Nr8SNvxSYSZ3Tnwv3PJdkjttEqFdxSssS35qaxvbE2qmAAOirN4DMa8FOuRBs2jzKZzbZRVHJkYuvifmT1QsHUi3M1e1Xvg3Qll28Z+JdGY0rohS7rmCvbodiuofw6qi/J4RM1JZzMK4mfX8dT8Az9XtL7q2wXbuigYly4H1cbMjnjgCXVFjKEEdjLYzYnov6Lp95xDN5h0xALo9CRXTUJ3PFh0IfInpXIPDXI/ybaNkbT2sfDY7bgT9HOQ4TKOqcVuajMhQPB6jUT3hJ1SWIHo0wrpGVRzb+mKxFxiNwyQtfkb4BfgJcHDk+lvqzlWyL6gLxOTnTrnMv+hrMorOQ3UesI7SzA/DerNsbGxsbGx+49z/xMtAJKF/OouFeVfQAUqC0bJ6UmGvgOr1bWpEuHrVpMKHBhU1s749zphq4NnwF+b2fYRofODqNb9o4PgUcfbY2nrh3wTWNbvDZFgjlnsCjJp6EabzY6B7WHUMvRXi5IiNuG8ACZUW865fz4jpvUigCzsSf2DHRpOeKf0IOCtZdNVPjMofQMCsYdH13zFyWh9EkunV9TuKcmp22fZ5/zwUwzEkeA3GGhZM+aBJGdfM3lTVDGty3GAjAfmUZ3O/bXJu5PShmBJc77pvyoJGNqTeuw+YpwGQJM/uUuxkxH0DEDMRtTaTQBfmXfM15xX0w7CGkWTMo9w0SOYoFl77P1Lzj2VR3vukFQxG9Qgc1mtYzjNYOMlH2rZTSez/X/xuM2j2rggWeBfl3zwz8UsAnpmwBiQPofHi1OAFbUU5H+V/iDmu/gJLugJulJ6U9atPiOea3RvldJTXgyGD/KlRm5Z5M7AJrPN3siwduAelEPiwkWN3xNffABtQObMuVLGi8hWgiloxERsbGxsbG5swMCKcZpHLSC1YRvqMIfGxJ/YElFsJ9+F213RSlX/Ewp5oWFG5P/4t0b7lO6T8xUNias+eSlmm9wCQYR1tR7PMu3496G0R1DiWtGknxsUWI/AlpjM4sWEYD2HKWhID/8denQ/AlLVIYD4jipKD285/A6DG45iylh8qjmyxbafjTgQfgg+1ZjdbJhAYWFem4UtZgkPXk5b/EqOm9m9UxzJuqCv305ZLGp0THVx3zqzZe9fXbV6NoRMRx+FYBB03h96Fg6+plj/QyXE+GLeBCsLFwUo6Dof1CZZRjFgn45rRCdF8atYNq2u2xTdE+BrZST5TrCpgCC7vVXXHMorOQ6jBn7UWQ68GuQq3dxru4rF00mdBFgclYeUG3N6luL0liPUhwov4M//NDrMQ5XjcJU/iKsnF7X0Z5WACejRwKhklV+IqGkKG935EuqDdHsTB68CxDG+gWLSqXxawLwFn/VqzFyZXAdtAG8+42djY2NjY2OwatT6OuI5wOmq9T2r+G6Tl5zBqxm6ruvjRxFkHA5Ni0Zagf/0kq7jDxE2m/nImv5iRqJ3XY23+mh1l/Vsv+GvHYf6V1p6LO5LyrQ8B34ddXo3suNihvEnd5IauBt7C0AoCzkrgLdRYSaDKBN4CQqHNUhYqt+ucCalTu6I0FPU4ltRpR7dizafAu6FXbQ61szEdSxhR2Ll5++U2Rj6wa4erOYbPTAL9P5ATEZJR6YzrwRQUA7W+RwIBRNMRKkkrOBk0kfQZewEgsgUIJv2rIg1Lv0K1bpKphdBEQKzHUeNS3MV5aPd7GVSmfCLpKAsR/oa7eCRQg8rxIKNxlfQA3YjI1Si3glwDuhLkc4RRIC+CnkdQIv9dLF2N2xsMCRAWozoRYSxQhvASTslB9DlU/o4YfbB4A6y/wZYBmFVrkMQn6Np5GRnFxSi/Q+VPKKtIMI8FlgDgKs4A9kEl7Dh3GxsbGxub3zxJxjtU63ag+QealhCGAkMxrVmk5q9EeA3V11BeZ/E1G2JuaxQ4nY5pqiTGqDnDEmsaEN46nhiz2Urmno1nMq135NFogrL1jc6afIQIxh4TVRpzVPW83S4ssSHLPZWkTS8GuaX1woBoOi5fTm0IXMxYlFevELMw7+80zuV3crPbC3Kvbr1hRyrB75pqlHKE3ogxHrh2l1UMYyLzp7xZt5+WPxm4D+RwjC05wIxmavVAq28GwrApRMKOvTGMSwg4lASzMwE6UbXjbIS7USOVRONRqq2HwfE/sAaixiqwLkT1bUyuwzIKEDMFSGJR3hjSCupEQFp2xMy9/odUBECmIxW5lPW3QL4POkPyGiJXoBwM/Ai6AKEbuvNgggwGHRzcbvQBPx5pII3b+LM/MPQKCb+ETgqngrwc3E8C2A44UTkZ5B3EmoEYCag1Hbf3RdCDQEYBW+lhzg3nvbaxsbGxsbEB/Lk7SCt4HnTnJQKRYCAcAxyDyGQEJS1/FbAU5VVqEpbzwuSKGFkcNmVZxSepWiNj3OwZH2cXnXNU8aSXYtxuWMzfcjSjUj7k5OS1EdcV60epeHUg3c76bQp3fDqxpGuAmhN2YzcshPE0aHiOGLI31etOBP4bUxPS8t8DtrIw77RGx0dN7Y/pfB7kAxbmXrhTnYeBUzDN0Tx7XfM5fpExwb/6EsK3IJcA4xnmuZHlnkBYti3MvZ+0gjxgACpp7OyIKR8iHIXqZaTe+xCLrl4dVruLrv8O+K7BkYbLncpCf2s/9/+l8Xs+r3Fj18BCnq/da9kRS6zuQk3dNG3f0FX0Q+Tl4GZdyWiT3inwGdC1vv2IaDBKp78HeRJVABM4psHIxo8tLg60sbGxsbGxaYph3YclbXHEdkaAo4CjECaTWBMgbfo7qCzBkGdZkPt2DPvaJSo6nThMfwg6TV2+JRLrWYgwUISbN5zL8/0LSZTwnlsbUv35BitwQorxWxTusIyakwRp+Zl4d2DhlI9JK/iRcJ+7lbOItSMGRxNUQ2yMJUnAYLCa3kDCwSiDMSS52RbPvbsHwtmhsn4sfkC4BNiHbt3OpFYdvVVEIf/fwAUITbOWi3wE+haQA+Z0YERYzaZO7Ys4bwJ24JRSqumCaAZCBch/UHVjsCDo/GklTi2gSk/G4RgMmogYXrDGg5SxILekYdMtx8IGKt3NlGn+i0v4EphOvWfYGpsRPQVf1hEMXL8/IlPCrAfBWNDp7DpW1rHT/gGMfDSyeFAbGxsbG5vfOvOv+TcwP449OEFORrgZ1f+Rlv8l6fl3kT7jwHh1+HF20WjQP8Sp+cFl3Tde2Hqx+PBVzd4Ubz4lytqVRvkLv1HhDjEGdrQJ4SEKLA+7uMGxMTfBSNqHRDm0yfEh27/C0t4kBprm3qpKOB9Le5N0QPNTro7E84FEoIqEwCIqti4DgiHMouMjsk/YGNrq0+z5RLkJ2IhwHmnTzwmrTUOSEV2NUEGNeSxYfTG0M3AC1c6XEbaxIO8ZsAYDR1Bj7odhDEB1MfAGao0jIeEe1DoBl6dROHTLjpjVJM5wV5RTXXMyvqxrqXb8gWAy6JYRZlKa/RYAHo9Faea9QDgjYV/R2TEUX9a1mNZZ7BzU2DxOEmtiOaJnY2NjY2Pz26DGvIxIRALaxkEoN6LW56QXPENqfkwfJFdMKkwQ9O5YttkEkTs+HP9YdMoZMeCBzUP5sqZXVHWt8q/ZUbZ/jC3a/VHVwzvahvDR/4VflGNi3r1ZdRXVeikAqQVjSCu4k1HTD2BVt70wjCnUODOYVJhAWsGdpBcEcwEn1YzCMKZQ9V3zN6aQEfr7Iv4bykOhiM+Gzo6sE74IB4vass3nGPTnbgS9I9RxAarhzYQqqSBDwLEOpzOAylJUlpOyb/30s8hSRJpZqKmrqa4ZC0Yv/Lc2itBr2dHyZxehvB+GcSuYf2nwghdM2IzSutKSSuM31eMxCEdCVniTRyZUAvDMpFU0Nz3alPVYvBpGORsbGxsbG5uGPH/dD6j1ZyDyrMHR40B1FMIK0qbP5i//3DcWjSarXgI0Hc2PLX0TkneELwQQY6rVye0bwhvo3xlB2fZGoom1+6+WiilCv442IWyEryIoPYBhntiGXAo3Abmh7dGgN2EaA6gJ9AC9CeVivichuK2Xh2pdAHoT1DQNqQx+tocBwWTUafkrSMtfAXVprZJBR0dg30mhrS92WaZ86/3AKmAgolmttjlk+1cEatwMqXBxXMXLOPvOY2HeYyzKvQO/2yRxy2QAFuTlsSA3n0XXL2PflLs4bstrJO7/NAuv8WJYSzESL9k5z2LLjtio4v6gPtQYBOx6Ma1wDK7CoBM1tngfhNbkJgG9FFdJJsNnJjG2sBdl/R8GwhmROAmXLxhjOmb2iUBLXnIxyqGofIA/6/Mw2raxsbGxsbHZmUXXfoQ6TgfaO2mxATKBBMcHpE8b1paGPp1Y0hXkbzGyq0VUuX5lVnG06+fbzBs7DuHZrUdFV9na4KhYsodE6sUIq+255NoPNX6JoLRB587RTY/uCiEL5MqgLToLJRM1PsPSn4LbeiedelShZIJeFyqXj5KJGWiaSirB4aZ+SVFf4PjQq35q1gozPDF1+igIrQ0Tdi3St9wTQOWa0F7rTt5yDDonCe8ld+G7/RzwZQqugqAvcl5BP+idyPCZ3fB4DFKn9mXktGBY5Afdu1HzbVdcPgfVgW+ptLbiejCFSYUJtU237IglWElgPYl/YhlSN0XYHL0wHO+Q4b0fU94ivBs6AVEvXTtvx3T8DISX70A5GKl4mwzvLCyr5cV7pnUf/qzPMXRDnaNoY2NjY2NjEzmLrl6NGMcAj3RA7/ugxiuk5kedG8k0AjcRvbhYpHR1GNbN7dRXs9yx8WwqrE5R1a38/GczsDklxhbtvphKt462IWzE2h5R+SSJrSNmSW/QYJuL8paxKG82i67+ESPRgdAbjB743SaL8maz8JqngzYb3RF607lLc7NzGaG/X4BxVqOXEhS2EE5jxLSDmtpipZE+fVLwlX8/Ik+EzvwExlMtXsei3BfRFn2belK67UONvoI4L+C78gOpSribKr2UtIJTceoNVFfdSGL1FXzY7VRw/h3LMZ2ft5+KZS1Azcuo+q4XzoR8EmoupKrqr/y0fVBt0y07YqWTviSxy2YAtJU8IsqhKFcAB4Z1UfVEkzzvKJRLaXk2DBIcQW9VJYVB32+Joh8bm5Zx+Ry4iz24S2bj8sUqH42NjY3N7smCKZtZmDch+KCkb7ZeIaY4ER4KjXpHxOpLHuqHMDkeRu0KVXJWZhUf2Z59NuTnQAr5G8+Iqq4hVY7y5w6yYmzSbosBlR1tQ9iII7JnjWBC4Rj2r3cDtzY9UbM3cA+ilzU9p1nAPVRVNU7wPuK+AdTlG5NSFk5Z0uilxqzaXjEczc2KXY9KYfDFFUAnYAOGjmbBlM2tXothXg1UtVoOwOJ14GIMZ/dQSo4zQAeiPIWhjwbLWIciPIvoUtQaALoCZBSm9gQ5BKkLt6yjlbhRUcw5PXGX3AIajsSjgn4H/AjyA/AzyAbQALUCHsJmLFWgHEMs1KpASAAjGdUklM4YRhKqnUETQbqAf4F9NgAAIABJREFUJAO9Ud0P6B2K5W194Z6lM3F7/4PqIjye38wXik07MWb2/pgVT4CcCgpGxTbgyo42y8bGxibuLJyyBFjCiGl/xDCuAv4MMUuO3BIORJ5g5IzjmD/lk3Ar1ZiOuwSNPDF123AaYt4JROw4xoonK04gvevHHJvUNCKsNbRinexYNYDkQe0djdr+OMLTG9g9sMxuEWVeqOn6c0z7F51Cc85LgrWBKuNqkO+aVtJZKM/hSP62cVuBIaBBDQfDajqDtfjq90kreAa0O7VprkxzEyJLmnbBRpAPwDGb+VfvtJ5VPwBNIrgurJ4F131BasHNiBWUzq9xNO+QJ7ODKnkJ9HMM6Q9MQTkSZ9UbBBIvxdLVWMYqqsw36cyVICamczZO8ytMfiRRDyBgTMFhngCsR8kgtWBfFuW+2PoCPkfCRqzKETSVhF8NvA98gPIxlvkF26u+4oXJ4XmWbcXl7YlDDsa0DsEwhqAcC3o80HAK9mTgE/xZ/2oXm2x+O7i9I7CsOQgOhH+hxmOUTngVWl/zaWNjY/OrYfG1S4GljJjeC0MyQNNBTiO+TlknLGsGQeevVT7OefgYsfSvcbSnBWTkqkmFQwcV5fy7I3q3EP7+87ks7F+Mk0hTm6ls/U9CdfIRxq8/2kP0lziklYsPwgFh6YUH2cTinMhCGVtjwTX3M2LaQaRNH0j51s/qki336LGdH7e8ghiN+zuvoB9qfYZ2fZn5O9myKG8RsGjXnYmykMaq54uu/Qg4KyKbF+b9fZfnFuVOA6a1WN+fu5Gmucxqld6v3el4w5Dkb4DXGuy/F/obZkJngJod14McBijKKyBP4eBl5mY24/G2I/6sjcBGYAVQCgSVF1f1OxaR4UAmwTDJiYwpKmHupFgntLP5reLyOZCKs7EkG7o+h89dHTwxsWPtsrGxsekoFl+zAXgQeBDXgylUVv0J0WEYnBaS0N55MLetnEN6wdksyH25tYJiGdMg7HQ8sUeZrujJspNaWnvxaXUfHis/gYndw1c9r0XMDYnlr3ZYdGX7obJmT/HDsOTICGxdGRcbDMMHnED3rgOA4HTrT+UDwLEKNd8E6pPZOXUGKi5ky+nA63GxJx4YNYo44h5N17ojJkYZlq7CYAy+rNZl6TuSYPjhu8C7uHx3Q/kkxPBQ4/yhw2wa93g3aioH48v6T1R1taLpj9emwPaYzTymlnSlkx6LSBewklFHBaI/sz2wJupRlFGF+yEJyTwz8cuI6g3zOOnbp2uz5568dPPOkp8t4irsToLZ8g/vYT+VRxWy2mOTwVbzluBjRVUXLpgVzBezPVlZMKH1mOTmbDUc+1Mar8+XChc81HIob43Dwp8TXWiGy5fMoLKqmIT/jn+sC+bWpqOvWxxVMR/Vs7GxiQ/+y7cCC0MvGD6zG4k1Q4HTgNOBEwjn+aN1coAWHbFVOQ//GUsjGz2PPSeWZRWOxsvTHWXAjE1/5Owuq+nvjPwnqvKLnwNGd2dsJdB3MwT9VPcUT6xenj0cPoyTFduBbZhS/7tvioXBNpDGv9UqlaDbwBHplGzHsuj672g8uxUXnLi9Fi3Nx6oGzyorcXvjYYNJS9L4UVNBreE4dEULtieiLMGflR57G4BA1TRgEi7vifizwklYXU9N5Q2QOJF6lScLWEH3hOuJJLP6zgzzOOnTbwzIZaC/B3aA/oxKV7B6oQjJDgt38eP4si+KqO30OXvhNNeA9RENR0TCoWf/fgRkNuhp1P9Il4O8wrDbxrKcQEvVGyHO2wk4xgF7h478gjSIAVcMyvrvj9u7EXgHkVKsrn787h2ttr0p4VBwPIxwCvWjvBtJNBcDF4dtYx2OJSiH4fLtG1b/kTL+X52pSnwU9MzQekuA7xHq+xIScHv3B9Yi/Be1HmPgd6+E5VwZ5cMp638Hbm+4w6Yf4ssa0uyZyqpxGInXoxzc4GgZyXo38HiY7dvY2OxOvDC5gmAoTjAcJ3VqVxzO07FIBVKJVslQ9WwmFSZQlFPT7GmPxyj7Tu6KzugYY8jUNVfOXHzo/e20fGMntlsJ3PnL2Ty0jy/iug6qnOaGTythcHQSjHsAAct6x+GI9aRtHBj5wN5YVSeEXV55Iy52LMw7HYD06eNJnX4Mqg+y+NqvgKDU5qTCBH7YcjfILyzMvRC4MC52/ApwAl+DPAOa1yEWqFwHfI4/s4UY0Tgx8qE+OBNeiVv76XP2Qs1xAIhcSH08aXj4sm5imOcW+vRfT/CHajq+rOvbZJOraAiG4ylUDwf9F+K4gtKJ79WdD86QXQbcQzD0MzISA5lBgRVOxlVyOP7M1WHXnZf1NfAnXN7xCI8BoHos/qxIkhcG8WVehct3A1KxGUhE5S58mQWNyox7vBuBqnRU/4bqo0jF3bhLJuPLfKbFtv0Ty4DTcBdPBrkvaKdxBP6JkS+IHVN0ChahL9XyVGrDbGPJvy7cBqTiKjkZ0WCIrsF45mY1TnLumrMvEhiHGteBcQGr+q/AVZSNf9IHLbZfmj0PmIe7eB7ISIQ1qNFUNUmsXihPAbtuz59dBBTh8r6FcCIAnR3H1yVxt7Gx2fNZdP0W4FngWVy+S6lZl46SS6SDd5DC99sHU7/uohFl3/a9GPTYthkbI5SDq6uScoCZHWXCy9uOYMm2wzizy2cR1zUSVnQyak7EsgbEwbKO5+jZl335cfbD3wiye1+gWTUKCXs2uQbDiN8zLoAaqYiejxgLcc3cSk3NPVh8zvfchyF5wFfA3XG1YQ8nGLrly7wGmNEB/X+CZb6EWLnt3vOYkr4kJCwPL/l0lCRYE4Fg2Bo6luEzkyJuY7kngNTKqkrbQrPc3nTEeBPVQ0Bc+LIvauSEASzK3EJNzRyCa3w/iqwDFZBJdbuGXhCdobK1btNJ9NccnF3a9SzaE3+toDTzMXaYxwJ+oC/o07hLwsxpZ2yr267S6BwFNS6v2w4663HE2Nriaf+EH/Bl5xMIDAHeRjgBkf/iKj4+zA6CErmqW/BNXNLkVZo1F5FPUd5vtSVp8P++rcseEi9iY2MTMX63yYK8Z1iYOxThMiKVERc9rLnD66YUJCPqiYGFsUO59aNLZ/XoSBNu+2U42zVy7Q1BkSTf9mBgzq8TIc5OSyxoVhp+V2XljbAk3NuCYd0HMo5E56fUVHZDmYjoCDr1qAIZh3J1XPv/FVC/hsaXmQfSXiM1z4OeC7oEh+MUkIW4i/PIKLmbEYXxl5d1FQ7A0teA+K1A9XgMRC8FqZXj7ElKl7/Erb/WGDP7RNAnCeZYuL7FWZ/5l/6E8h5WhI6Y2zsc6AXyEgDK+KBz1gYqE8MPR4yWxTnb0W4XIYTWtOn9ZBQ1++MeU1xz9kU5v8E9cjauOfvGvd/WmJfzPYYjA9gOkozI01ENIjSH6kIwWp5hs7Gx+Q0iyoK8h0AyI6y2d3OHt2ztnIeyf0xMix09HTWO6zrSgO8C3bl/42lR1U1w/NTZcL7dbBjor4Lm5NN3J0YUpIE0H9bfHJY1O47WBJl/zb9ZmPsk/sk/k+D8DtG/YEkufrfJwtwnQ6qINi3QQMxAFN/EqxEeiHOfAZS5OFiPL3syaApwFMh0LD2HZEdOXHsfPftgxPEa8Lu49lPW78+g/VC9guDULIjVXDK6+OPxGJhWUWh9UBnarXWH26G5dHGuarVcQ1SuAHkc0ZLQkYMY4x0aucENcFbG3xGD0OyZ3hHaSwLjxrj3KVYOykeo81qCw4xOsKKcRYwxcyesRSgO7R1I1y4TYtKuL+sG/BNfa72gjY3Nbkf6tGGMmrFf6wXbwMLcJxFZE3Z5pckg0ZoJs3srsrOk9O6BcPWqSYUdGv5WUnESZdXRjflJ0nMg21ovuAcycL8flgHrO9qOZhnm6YSh90RQYyMVW1teZhFr/Lk7WHDNCyzOe6td+93D2UlVTpTSzMkID8WxTyfCY5iyjPQ5e2EaC4GJqDyLP+u4sJyEaHGVHI7DfJ2grH2ckcsBf1BmX0OjLHIuYwt7tVgtHqzq56oLwVQewu9uXblmbvYbEa3LySg8BOEchNkkOxZTmxzRko5xPqMhMckHGhSwUEbi8sVv5e6kwgSwsjHw4r/oW9DgglrR3ef9Eh5tsOfqMDtsbGw6ntSpfVHDj2m9wYhpB8W1L0vDX1vcTMh+taPmNqBbDC2KJZ1U5R8daYCpBn//+VysKFQCE6QqwZH4bBwE1joe8XgsNK7Pv9HTLeUO4IiwyyszWe6x11bvATQj7y1KaebliBTFue+eJFgTcdZIqNugpx+OkxANGd6jEF0O0i8u7Tfqq/AQ4M+oEZxRkDq1t0RMIyPu/e+MyOgGezsnpIsN6rgc5R1KMz/kkQmVCPNDZzJw+ZJbrLu78K8Lt6FSG47ZHWtz+F96kVLuGA30pMoREucwngidGcLY4vitW4wEs9tHQGjoU09sU1sZ3qNwl1zSdqNsbGzaHY/HwHA+AvQCDkGM/5E2/Zy49SdE8Dtt/dRw79OJsw5HyIq1SbFE0L+WTSo8riNt+LCqH74t0emYOBLe62Y4vu6QnGjxJjG56gEgvuuqIiV9+lhEItBS0F+oSegI3QebKNiF8ooopXoJGSXvobScf6gtiFVFtbWFBMe1UeXZioTgKEc7rb9xXIbIZ/gm/gcyoTT7E1zejxCORmU8waSX7cmpob+V+DO/INa/UcF1fRdhUK/oqMYTYF0MdEO2jAAi18ztCES/Bgk6HU5pPqdZLFCuAGNuXd4xDfgQx0ygE6aMp2mm9vbH7zbJKFmH6hFAl5AYS3Q/vsq5oNFJVNvY2HQs73fNBepzcQm9QZ4ndfoMKvVWXr42drFqadMHAuGvgxGjURij6XBOBU2ImT3xwVBlOvDHjjTinxvP5KzOq9nbEdl/n4FiJfq3sSM3pdnx/D2YQ++fXLEqu2gG6G0dbQsA6fmjUR6lpTRTOyPcFkoZYbMH0IIEpiilFJLhvQxlWHy6F0hICOYicHvj96BuWPdixSR5ZOuMKOyMcnFwvVGDh1bhSeBohBMZXXgEz+R82i72BKldzLwt6gfpluhk/BVIZIfUS68P/GYpZf2+BekXFO3YUxwxCVD7DllGfNT6XEVDgD9gmPWLtv055bi8zyOMAsYzzHMjyz3tsz6uJVTrbfDcJngI4/6Rgxp/nkVAz4BQSgIbG5s9hxEzjgPrzmbOGIjkkSxu0gpuILF/aZsjWkYUdoZtsyMQedpCecUntTuf5Dx8smVpaptsaD/O+Di76Jyjiie91FEGlJuduOuXs8jvsyDiup0cP6VUJ/x3q1UzNCUOpnUoiZ0qp1ZXJo0D4i/atUtUSMu/HuUO6vOVhsNbDNn6IJH/l9p0EK07JyongO7Z60PUmNdufQWdkhTUaJx81jCexLLuAgycjr8Cf28Xe1w+B1TUjg7GyRmVy4G5LMrcUnfI47HI8Jai5CL6Z8YW78NT2T/Gp/8YoiLU+hpGG6TzW0KMKxH5lLnZb0K92j+GPoHKKGAfevc/k3iFkUaCIqFxuMqwkjsHK20HebdhIyiHRbEcwcbGpiM5e1oXDPNJkJb0zvcHfYLqdbeRVjCDRObiz408B2Vqwe+Qrf8CIgiD1uW1A1aKyidW0XQimTnoYASdpi7fEonXkowwWLD1aEZ3/ZBTkiNP16mJL3UiMCSkufbr4dD7J1etynn4Kix5no64n0ZOOwqr4EGQSOUtt2FJVvi/1Ta7A+0zS9QyPwB7EZRV3/MRuRQAw3qLDG/9cbWg9glfGY/Hc0u7fFj8bhO3dzvQGUjB5UsO5deKDWOKT8XiaGA/MryNwyxUUkKX7CQgY4D7YtZv3NAudZvV1d/HvHmXtyfoWJQAGSWfQ8N7pMHnMZhTrOMdMQnlwRO+i6DWj/iypjY64iquADk0hpbZ2NjEm2RjBnB4mKV/B/og1cwgNf9l0CUYjtdIKC/D76lutsYwTye6dT0Zg7+iGoysiAQ1nqzdXJJZPKFv5AmhO5rBS7tuvAy4vyONuHnDuTzf72GSjMiCMJKkyrkjaeEGqRzX/iJkcWZQ4SUvlmUX3qswpV06dPkcVH3zRwzJxmI0UcV8yiQW50amdm3T4bS3IxYAGQdWQUg0Q0FuAWsgyNVANZABXAec3M62tR1XyVDQIUAmln7Y5LzIUcAjwADK9j8dWNYudilfIQwCHDjKTwSWx6xtiyuA58C4t/mgNX0S6I0wnj3CEWMwAMIa5l/6Uytlo0AyQTeCcXGz75dauQjDwUpn3OPdeOKvHRfnPe7xbtRUHhC0izfa1ljiIqQqupXhNjY27U/q9FFAeMntG5OIcB7IeagF1V1N0vLXEhx03YawA4u9guvMOAxwhhPw3AzfkFQRjHbxeIzX1lTf3TPMaPLfOY0VhziNyKeAwmRdwOpXFrDCcgo3K/9g+MwiXphcFS97WmNtTU8Ky//A5B6RZxZJcn7UK+D4Q5VlHhibXJO7Ebq5xw1033QSEtvn0fu3BoaRmr8Pot1BDgQGUb3udER6RPlZAHQaC/OebL2cze5G/B0xoQDVjJDj9TGqS4A8hGkIj1ETeBZHp+cxavYDltHdfI5NxhGInERwSngtsIN4Jl+OFYZegfIVA9c/0uxsl8fzPmX97gy9F+NpL0dM9BWQQQBYMo5YOWKjCvcDGYnqn/FPXNpsGbfXD1wGHE+G9yhKsz6OSd/xIKP4SJSQLLPGPsLa4zEo00sRKaF04pJmy4wpDmDJcJBkairPB+KfkHFXVO8Yjkitqun8Vkq3jP+ib4FvY2CVjY1NvBk+sxtSHSvlZAdwSOgVDJKIRbCXclvdTNv7KRPvoKpPmDU3Y6WczuKc+ISeQ3B2o3rdF8ABYZTuTpJeBfwzbvaEwUOb/8C5XVZxSOKGiOoZKNVJ/mrn9rykX5twxyC/u3r1pMLUgPI6MXwGfac6cFvwMxCjqEfRR1mQdz1cE5v2bNqV+H9qLA5EjT+BXgMyi4RqxZ9dCjyJWM/j6PELzuoAFm9iGaFR9+oHgM9A/obKBUCHjRSFzajC/VBGAbN3GXLo8VggIREDdeF6MLaB1S5v8zmohCKgNgZ9fEhev+0kOC5BWMegb5fvsoxhPVG3rcQ2WbFrzr5klJwduwblstBGNTXEPp/dJ/1GAAdQ04JzNTd7ORB0VoMiJx2HhN4PkU858tvFMWvXVXJ4MEQzBoyZcyAZxWkxacvGxibIC5MrELkGqOloU3bBMhblzgGCTiMR5OUSZsfVCYNQGh4JfxBN5e9xT5TdCtXq5OYN56JROAcpxs9dJfE/P8fBrA7n8KKcDQh/Br7uaFt2QSEJAzLjIsRm0y7E3xETTmbQujUgyaBZBBLfweVdBpyJZSxGyt2Y8hxCGmL9m01GHpL0MkIndgTuRfQwIpGy7SicRg5gENBHWiynzA1tpSCJ6THr31U4AOH2Zs+VZn8Cdcl5k1DH41w8p21r8ly+RJRJKN4W17rNzX4T4cvQ3l/xeGJ3z4l1DaqxuTdccwaj5IT2/sG87PUR1d830HriRJXLgReZl9XKF7rW5p87nTFzDozIjliR4R0DnAZYKJfFdD2j6CNgxCaVhGXehEr88r3Z2PxWWZD3SDBMmsiFN+KKrKfGvKDuwTOp5lbCT02jCIVxM60hDikmfEe2KwGrQ5M8A/yv8gAWbT0qqrqm8+WeIlt/lc7AoKKcbyQYnvhBR9vSAAu4gYV5l8Qt/65Nu9Ae88idWdV/HOhgRJ4C+RxYBvoOUI4YK0G+QngadD0mj4MOQSkl2XEv7Z9zK3JcvmSQHJRXW32A92e+A3wT2otdQi9x3EQwhLN5khInA7Xr1k5im7mcUd5wwiaax9jiAnqjCa1Ikouidc7p/qzqPzzqPhsytrAX6CUI5W1ua0zRKYj5EpAAPId2u7vNbe6Ma/ZA4EyEf7VaVp210u+CFYhmjUbbcBePRSkhuIbzZnyZsQuhdRX/ETgJs2ZTm9saM3t/4CKQtt8DNjY2TVmQ9yqmHA3afCh1+/MDWOfw/HU/AEGlReXyCOq/wvy8z+Jj2k7Mm/I9yMKwywsTGDH993G0KCzu+uUsys3Ix2k7G1WObQkLdn9l5CgZWJTzfXVN4hnACx1tC/ATouexMG9q60VtdnfaQ6yjO0IuSUlDSd5RTVHOvaCCy2808OJr5fFnATBmzkAscwDoYJD2fxCNBJcvESmfCrIvBq2vdHX5DSAkwCCnk1EyjtLMJ3Zdfs6+qBlMLCzag9GzD25SJkF7YunFaEPJ8J3414XbGFt4JqbzcdBzEE7EyWrcxXNQWYhDPsKo2kFlQhcS6A9yHMrJDFx/UZPZENej/aDmVuDz0NqfVpD6USThTlyPftByvQZauIbzQEbP3tKkiGleCXSBFhyxsYW9MEP3uGh/xszeH6Nya7C+oyeW82jEGoMl5wMm6F1o91vCHl0S7VG3/XOnbsAvzZYbUdgZdCogKOtabbfK2lavISqXk1G0gNJJ74RlU0s4zD7U/k9acjCjCsvoZFaiDgeW9ATHSag1EeR0YCPCxZRm+sNuXyQJBVScXDCrR7NlauSm4N8W/t/GP9aFqqpedfHzjs3H4ipuGp6s1hVAIli2I2ZjEy+ezf0W9GxSZ1yO6O1A85/tuCMfoYxmUd7nDQ7OBMIXibBkVszNarE/8yEM4/wwSxsYci/o0I4MM9tgpjBt05+4o9dzEdfdK3HlvtWBbzZjDdgrDqZ1OMc+MmGzoud+kl08WdF/EqnKZ9tR0FIMvYr518ZBTMymI2gv1cRD+NeFDVK3i+Jn1w+7cyesBdbi8h69W2cEySg5G6viHkS6A18Cv8ftfQ1DxjI3s6nc95iiU7AqZiB0DpUH9HbcJRMxGN+kjts7Dcx0hM3AZmAETmtEk3aDi5+/BVa3aO9TORvweP7CJ/uPRfUmYCDIJQiXYClYicE7QtkCPElAb2zihGWUFKI1I9CQq+D2/g/lSvxZbzfbp9s7DSGt/nrpCjVLcZc8ii/zrkZlXd7fhdaznVp/bfoBjuZ+k0I3hsXmZvvNKPZiGiNAt4GaIFOwrClYDb43RQFZC/IQauXjzw5PRSuj5BhUHwAGAcGZnYSaj3F7n8WXlb1T2StRnQy6d6jsU2R451Cadesu2r4QS69rEM4JGHNxF6/Al50Rln07kz5nLxJNHxbHh2zoAlqE0wGBhnki1ULlQ0T+RkLSA2ErNrqL/4LKDShDARCOJpDYfDhT8L+tepdrNFze31FV/SxIH2rfW8t4ttnvgeBtsQkcv8q1CTY2uw+iLOIBRj7wFFbVLcClBCMI2oMAyP0k8jf8ufVRH6nTzkU0kgiLdXTq/2zszWuBxdcuJS2/DBgYZo1TSCtws5DSeJrVGqUVxzEq5SOO69T6uGFDDJSKxKcd3SrbR/G9IxBEKea+TyfOetF0GPeBnNNOXb+Lai6Lrnm9nfqzaScEt/crfFkH7bKEu2Q26IQ29+Ss7smTlwUfrMYW9kId+4M4sGQvDDOAyRYMqWK7+WXdQ1qGdxbKpW3uWxiLchVwUrPnlYX4s2K3XmtPIaPoMNQ4GdgXpBNYm8BYyY7A/+K+mLm9GflQH5yOviBBz8NgO2KUN+sw/9rxeAw+HdAP06xXGbOcFSTt2FD3GY2EkY/ujWF2D7t8glihwRYbmz0XV9EQxHi/hRJT8WXd0G72tCepU/siCZeDTgLilUPKQvVpHPoP5l/bWG3X5UmkOuUjkHBznAH8nYV5d8bWxDBIz78aZUb4FWQ9O8wjePna4OB1Wn6HzI4dnvgTi/oX42xhzHxXbN6RvraTefLTg4ovuTYmxqTlryaY6qB1hNtYkOeJSb9hUJZdNFLRvwPHhVvnos07WFEd1vuqwNKgNP01L0Vro83uTfvlEatJHE568WoSjXMw9VSgd/Ae071QowbRbSgmyc61ZBS/iTq/QM1h7Wbfb5HSSZ8B7RMv39EEc4LZU/kQUu9kXejVduZf9Au7Csu0sfl/9s47PKoy++Ofc+9MGr0rgiJFAde29obY10bTmWAXEkBxRQFdd62xIipgWzWQgFhJIoKoq64IrHXtrgoWEFCwUKRDSDJzz++PmSSTZMq9kwkJ/u7nefLA3Pu+732n3XnPe875Hpc/HvNu+AW4if55d9Kq5ZmoDgnVDqO+IWkK8hWiL4DxNC+NXRm1VVnLaxB1YoSVo2ZBPeeWJMaTYN1FKJTeBtqFDOM64PYGnFRCvivvyIzNRzKi1QeO+1ppb3YtKz3oj6VlH4O+00bOAeYsyX3iNBVjpKqeI0J9xNACIQ0FeQnL8zwvX/NT4i4uuzO7zhATniVNAN0JrENZj2ABm1AFyAJagB6Kip8kdmFcXFxcXFxcdhGL8nYCc4A59M/z0KLVQZjWUcDhqHRH2AvVLkBmRC+LUG7vDkK1BX9GdDHIF1jmu8y7NrHgg1hfhtYJNjHYwEs2xm0I5o7dxKD7z8EyOtjvZEVGpLyPbWE1/QCk3Mn04jF14/HeruamYw3DuVOuwnondQWzVQoQtVcnztL3UnZdB/QtuOJN4M2lVz/csrws/Ry1OAmkv4j2rN02U+Q7Qp//bahsA12J6FKUr0nP/ICSq7bt8ifg0mjsOkOsmgygK0LXRri2i4uLi4uLS6pZlBcAPgv/NSy7W5jW3OsXJd33pfHHpW4iztgAjiQpG4x54+5v7CnYpdcjY7YAz4X/+HZ4YYuglPcUw+ymqh3UoNljzTwvHFh8TWoiUlx2exrDEKvNe0ArILniFS4uLi4uLi4uLi5NjN7Tc7YCn4f/XFzq0PgxvGtX90f18saehouLi4uLi4uLi4uLy66iMQyx7aBzgBWo/I1Ft7nJYC4uLi4uLi5/HPIOy2LC8W3I698UIo9cXFyaKI1xg9iIekYjwaMpyZkLOcC0RpiGi4uLi4uLi0uSKMIDJxyIykkoh6L0RtgXqBaWyLRgYr8y4FfgO5RvgfcxA4u4/n1U3W5bAAAgAElEQVRXydel6TIy38svm7thmr1Q9gJJRzSs/qk/gLkJCQSw2IC2XLa7lT26842V+1oe7S8YByHaG2VfoJVHSps396z1CFpaarXetNNq/SOWfi8YS1T1beu9ff6XlydWwgvYpHF2aoLBdLx0apRru7i4uLi4uNhjyMQuWN7kiskn4ParBu7AMHYaykY1dIUl8l3eSfvubIhrpZSJ/Y8G6xLuwwdUqyFGKzwfIh3oBnRDOAO4Bsuj3HfiZ6j1DIG057nprZSpOi4e135Aplac7bynFnafsuWjVM0j4dVAlo9tNUGgjZN+m6zM8kt+ueC2xSVTNgDc9dbyfYJiHG6nr6nWuptP6V5VFLnb4EljVgblAGczDyO6jpfG35xU3yiUruIioJ+tS8PijK48nKprh1Bh4ORjED0TS/qzZtuRmGZa5QVDJaciZoAFaoT+K9ssBk5aAXwFvI4GXg6XuWhS5M1ffpCIcanAeQrdBAG0xlPbp9n7DOmcAyFxwTYBTd93S0Xn/hvKe/Br2aH8esbBWyf0+3ZeuZU5s8+GvRf4/VKvyL7GMMQ64KEYlW74CryU5D7aCHNwcXFxcXFxSYRl9ET1gYYYWgxzO9BMBVDBUKw73lr5rQoLUd5SQ19rMoZZsc9k+W8+RP4B1kEpGFFQPQzkMDwV9zPxhOdBJnDD29/Ud+Czf7qy+xtdHr3II5bN2mWVM5JDFY6SmivuBmPF2FY+4AanF7t9/V8WLQ7u1YKQsCMWcpIoM+z0DWK+DZxY+Xhi66z+2Rt2nAlJ1v4aMPlr5o2blVTf2ignIIy015TXIUWG2OD7O6LGaKzJlwDdUYm3qRALA+gR/huEeB5n4KQPUX2UPVoUM3VURUrmmgR5eWrICT8OFPQfIEc47e+RMtqmraBt2gp6Np8P0KLManXR0q2nXvR9i7PW3fXWinsCO9Kn5p3bOSmPYN0csTMfTnfQP0CoHkjAQZ+NiN6D6qd4gqn58DpjM7CuEa7r4uLi4uLiEhsD6CvKVQIvGpb8dueClQV5C1cc0qizuq/f6axc8zUizwOpMMJq4wG5BPia+058mvv671GfwVZWtN5j4obTFjnuqBwRNo4anE9G4lW4y2m/34PNNszbeuCfUzWPAz1GpzMzvP9NegDRKfjubZWq+exSBkzszMAH/ollrES5DaF7CkcX4GhEnmHNtmUMeuBq+uftcufP7Qt+PMU44ccvBV5MxgiLRbqxmT+1ms2QzjkdLut2+pTD9iz8beJbi/+al6eOtTdqdsieeg4tsp613Vv4J6buD3I6wghCBlmiuMkAW0pfx6PDeH7UeqcTTgHNMfVA4NNGuLaLi4uLi4uLPVqpkmNY8tkdb6189a6FP9kKP0sZ95zQgYn9ZqG8gdJ7F1zRQPVi1PqGiSdcUZ+BZmw68rDtmuY4B03h3qVX42RDPilaZ7W8AujltN9Va3xfq9AylXOZ0DLt2DRheZLd96Dcm7LwxF1C/zwPAx64BvF8AzKamgXXG4K9UXmYVi0/5dxJRzfwtQC45+2lHe58a+VzojofSC701Cbt05ZyaqdbWlzS7exHDj7nvu/vWLD8YCf9axpiljEM4SCGFnZO2FMooszM4/kRayjOWUhRbgFZZgvQvwFxQgkkjRaZPgLyrK3rxGczsBL0K8BOJfJyhId4Pnctwlf1vLaLi4uLi4tLwyPAWZZlfXjH/BX598xf3a7BrzjhxCMw5SOgQfLjEtAa5HHu6zeXCcc7yp+qREX2GLdm8MdJdN1XzJa2wuOSZfHoDs1F5Can/VaUt1318c69j0r1fLxI2qSWmVtJPiTzWgbc3xCe0tQzaEo3WrV8F5EHIbUGbWL0IAzeY9Cke8jLazDV9rveWn5koML7scIFDXWNaLRJW8lfOt3QY0jnUZ899u78G+32C70QQws74yu8HvRjlJ5YupTsaQVckN8+Zk/VH5g7bFONY08O20nxiEnAOxENrwNmRzzuCPI0wilY+i+7E43C/xC5gEDwWLT8WERuId6XSHkWNbpQlDseX+ERqHrD80qZ8omLi4uLi4tLg2EgMjIggSV3vrX89Aa7yr0njsDQ9wkJbDQeykAM40MmHJ9UyNj8Hfuf+FuwpWNPj4jc+sMNbRos3C4zveIGcC7YNnLNhaugYbx1J6ebB/c0jfeT7O5BjEdBnWdW7UoG3H82an0GmnJj1gEGyj/4vPlcBkxskerB73xrxZUWxnvAPqke2y49mr1p+LtceHfJRw+9lrdQE4ZjGkALgpqLaDsw1gE3gT6FynoCZqwwgCAq39Y56ivcH3/hQ0Cf6oNyDNoyG5GpUcaxs6v1KehnEY83gd5Kce4hFOW8xoujfqXkqm0U5TyIMi/mKAY7MfQusqfPxJA8lPdQ/Tdwj405uLi4uLi4uDQNOirGv+5csOIfKR954oljEM2nsVSl69ILw3iPe493FO4UpvnI37KXJtGvvZZZ1yfRLyE//a19Z0XHOu33YWm3Jcsr2h7TEHOqZEabzD4iIQGQJDiBgVN2qQfGEYMmXY4Yc3GoUNlwyLmI910GP5oy7/adb/14gyKP0QS+u83MtZy1x/i/HNdm/GeT318VN/TTANohej4iPyP0wdTpFI+4EtG5iJTF6GdiGe/VOWoFBKw3EOYDlQop3SjxB7FY5vypyAxaB48h6BkaPqCgq1ArulKMyOcxh7L0c1QPRK1LUT0OjNMwxINKfbxyLi4uLi4uLrseU1XuuX3BykeTSZCPyr39rgN9iGQ04xqWPRDjLSYet7/TjovL9jxlcVnn2GujGIgwbtm4tl2d9ktEeaDidsCZmiNw9drzd9LA70tbQ9rmNvMuTn4EndQkhTsGTh6NMp0mYKDURA9Cy15LhWfszrdW3qTovamYVaowJMDx7SYfeETzvC/iecbCJ+RAVB8GTqTcbIa/4B2U4xFrOLHub2rV1c1XY1vIA8YaYAshj1eoXoNoEla4fsXUURX4CyqlcwWkF5izyS4ooCi3puqi0DlmcGLJiE+BY/EVHo/oKwjLKcp9jKHTjyK4S5Ramwa+GXvgCXSk3FNKhncNz168JWbb86Z3h4o00oPO6puUZbTBG9yLclbw4ojV9Z1yg+KbfiKBsm/IVPvSqqXiJcOzB0FpTXHu24k7RDCgsAVZ0poKvACkVWzZJaI15+X3Zvaoul7shmZoYWcQk1nDV6VsTF9+KzB6AmCYisgGTO+GuJ/lhsRXnAbbWmER+jHxikWw2SpK/M5riwwtPJxgYC0lo35K9TTjkpdn8O1exzFrxDuJG7u4NB1EuUqO/zFTVXNFJPkf8/v6ZaNMTOHUUk07MF/j7lOOcVhzzJO7JnvrB3tPcXq9TAjeCoxw2jEWK8a36G1ZXO603+ytB330ezDryFTNIx5jstKPm7W94qutyoFJdN+DCu+twPhUzytpBkzygT5C09tcCKEcgeGdy8j8vyQrcX/HgpUXqnJnqqeWKg5vU7ifIYH38iBqSGhNC02kK6Z1JHB8wpG9ciMwqsax0KL7FgB8BfchjEDL/hk6qb2dfw4qrUApr0r/El4CySdg1F3gi/UMKvGTTEty3sVf8A3I6w4nEx1fwdmgh4AMwqBt1DaKh5AqzTJEvkKtRWR55vDkMHv1UYYWHEqQ4xB8VO8k7UTJB10SNjJj0z/PQ4euYxAdDYHOBGU7ZrA1FUETf8EPBI0zmD28bhy5GbwazGsJmLamWd3PAkvAywigoMa5Mx9Op0XW1SDdED0zan/V7WB8jeg81qx+gUV59sojZBeejsXBoH6k6sNWjlIE8hElOR/UmYtYb+L1eh0VYPACoSX2NiDxTo6vcH8MvQblNNCuWLoNk5aAl6AJ/oKVCC9SwcO8mPujg5nY45KnmlFW/gX+6edQPHx+wvb+wpNQqxcip0LlBorxARL8iKKRrzi6tqX3oNoCOC+JmVdzQX57guYVoH6QAwADtBS1DJR0rCD4CyqAH0G/Qrk76vfC98/mkHYhwnHhccLI96i1iDLjeeblbE04n8tnZFAavAzVC2DLUcAOTLxACyxAtmzHX/A+Ko9ywKpXyMuzl4sa1LMwzMvwzexHyWU/x217bn4WGcbFIHsgXAMIykrQaQR52dEmyOK9hiAynYue6eLIoB06vSuWdSHKyRj0rDquvA98jXqfSfg8XFzqizD8zoU//gY4FoAAYEK/Q1FmEq2kT9NiXzzlL1Ds64+/xPZGz9pAi35v7djvvVOyvj/OycVEGbZ0bNsHe03ZUA8vUTWWJffh0CtjIcFbfz97l4lKGGAUts3M9P9eWgHhDVMnKGMYcP9M5l3/Zepn55CB9x8FPE39P9cW8A3oV4j8glKB4MWiFcJ+wMHUR/hD9WTWbLsNcKw+edfCFUdbFk+SpKGpCmt+38yK1WtZu2Erm7ds5+i9v2TI0MR9nfDn1k8d+Z//jZh54sHTLqt9ruYXQvVJ0G9sPR+1fsWX34qSUZujni/J3QDh3SVfsQlbImVK3yS0lP1T/GsQKo4m+gbK+cB3IO8h2p60wJK67SXxYq9/ngdP+Vk8N3pjwrZ2KMl9FXiV7IL1KE+E5stS4CYsWY2QAdoKOA6Rc1AdCTKSHcENZE8rpNS4M+HCb1bu58DnZBfsizIOAOU1SnKfTji/kfleNnleBj0D1ZtpY93H1FEV+AraIno3yBV4aB29s3EQyiuI9WnYyxkMP79OIHeEG20G4/yqLqotEO0NjECl7gfptTFlQMjD6Z/2KUi4Hohko7oS6AlyBaIXoFxAhy43MyT/NF4c9WvC51qU82/g3/gLzqGyOr3KK5TkPBS1fausvlhsAXkWrJ9Qqt8H4UKQUNFHkamolIROBEww9kA4BWVw3PmEjM7JoFdgMR+RkbQOvBva9VEhe8ahqJUDjEQZh4e/4iv8ByXDp0A9dnZrs00z8JIO1lyGTj2dWSPjJyQX5ywEFpJdIKg8Aayh76ozbBsTlVyQ354g2QgefDP3Sm5BroK/8FqCejeQicq/Ef07Wv42JVeFlFIveaoZZRVHgnU5yEUgPUFeJVqJilCfqfimflQjlFm4heIRr9makn/6qewIzgTxoNxJoMLPnCtDMtG+6R0gOJiQIthpiJ7Gki5v45t5oa3nL3hRuiMV/8Y3vT8lw2PXPHx51A4glHvrKzgP4SAMbqZoxOO2nkeN6xpXgragvPQiwH7/kKdzItkFr6IRSrSqp1IyYoXjebi4JIty4x0LVi6+9eRuzznql3dYFgbPUm8RCFnMjmZL2dTJw9bWWZRntAbJRNQic/s2WmwspeW6dNJ37I/E2LS1d53jWfHbjeDMA3Dt2iEtvuw2MSAkFg+IwDQITAAGOJpiFJaPbXOCYp3rtN9DG058b6fl7Vff6zvhANPseXya8Z93y60TE7eugweMf4L2S+nvuFPOfLglWvEcUo/PtfIfDJ5E0l9mzl9/j9nOV2xStqofyFBELyW54th/Z/ADrzPnunftdshbuLa5ZW1/iiQM5u2l5Xz05TK++OYnNm7ZXuPcfi3tiLA7RTmk9TOX/ueL0S+deMhjL0aeqf2F9IDYdMfKbWD+QMjaTtB06zQqjS6RbynKOZ3swktRvTuiVQUqHyPag0o1HUNCO6xFuQX4p65CW8+nOEa4j6/YRLeck3AuIe9KaoywmlQneFryHSU5JbXOzwX9G77p5yI6CeiJyvVk6FB8BSMpyU3soVOqd7hFfrM1q82eK0DPAJ1PyYjq1ztkKF+Jv3DfmH1Ff6Y499I6x7ML/oRSaYhVRPWyZE+djZrxb2Iq66tsfgl+QfHI74GPQJ/HXzgVyEU4ANMzFXBwA5efqzyoBr/Evr4egsrFlOTUfe39BUcBJ4bbLaU4p/ZznEl2wSMxx77omZZU7HwTOBJhMsU519W8KYtSxGfAZwyd/hSW9SqhfM1J+At7U0zq5INlZxqYAM2wjFcZWnBy2LiPj2V8i1ig8oNjIwwgaOZQdUOuyIGqz4w9+ud56Fg4GxgAAsq1lOTWNaqfvnQ7EDIehxY+gqWJvX4eXU3kncSK4mGPRnbBaNR6GOFHKqwT63idQobTVC556ll2lj+LMBDoh1R8gm/asQmNExEPqgB9keDr+PJPjrnZVbPjT6AHgTg3frLze6B6UnicK3BiiFVimeuRiBe0mSfxxomLS6pR8u9csPzTW07u/p3tPhnN7qGGwJgjNrGz2Ry+/3MW29qeTax6RVvaw5qwiJtogPa/fMw+iyGt9HCS2smXW5nQ7xX+8bbt3K8dVtpBT24+cv6wVh+e6vBa5y67ttXJPR/cvMDpLCtRkOVJ5O+Uqaf08U3H90zcMvU81CrriKPXb19Voeo8T044ngGTLmQe9uvyppq0wKOQdIHmz7EYzcvj7RW6DoXhh36DBzx4KxK8nVBIqxNP3HYsOQCwbYgZwe2TEHFUi64iEOTtj7/l/c+XUhFwnj1QH9KMUnq1fPW5xYt97Q84oKTK2nPyIn2EGIeBjERkDPABcDGXz0hs+ao+gegggsE+WIGjw8dOrtUogMFogsH+1Ye4Gt+MkGFYPPKN+DkXmw/BME5CdSjwGHAjoTy1JoQoJTnz8GYcBjonfLArwiv4C09qkEuq+kP/Mf4X4/yzoNFfV5G/Rz1uaeIdljW/LEeC/7E3yToXVrTlGGBd+OHZDMnfM7mx4mCl/ZuSnDeiT8HGjk7AeiLq8f55HipKZwNHAh/QZ/X1cXfGZg3/ELHOpFrgZgT+gusSXt82ZlrEg9ZYvEF2QXxvNICh4fIU6nx7KFQjpDp0WRgR8ow7oONej1C9E5sf1QirzaycT1C5O2G7ZPAVDkZ5hJCEdnbc0L+nL91Om6APrSrlsQcir3Juflbca2jkbrX8GTFfZ0Bh4vBXQ0NbepbsSNi2budRVC4GhYPwFTaoMpmLSwPSXNUoVLUpIz6xXx+Eq5K4TgUBbz4fn/VvPjv1cra1zQaa2+qp4mHdXkfwyelH8NXx3xDwJhPC5sHgQaedJmw4tXsF5vbELWsiBvdqPXKMVoxrdT7osU773bTu7P8GMepbbzYpMoSsO1ukOcuPj0Sk8YQ7Bk4+AfTiJHruQBnP5q1H2jbCajPv2jW8NP6K8OaeHYdBGcgULO3BS+Pz7V4mb+GKQxDJdTK1X9du4rHn5vOfj7/d5UZYJW28P6bj+b048pg9Q0xZjHI1RcM/Q6lA9QFUb0M4ndLgZLILHsFXGDuvrML8nqIRL5EeXINhnIJ/WhFwUc1GkolltQsJChinoTIMeAAzYFfacgNWoC8iTxE0JlGcOwGVyyEZtcYG5tmLt7C19AJCxiyACfoMvuKGqG5eGXbYL2qNi207iikaHv2HYFZOdG+SSGIjZVFegKKR39ueZW1K/KXAW5VXxDRTrt4UChWLYSCpJn4vZo+MHjffYa8RIJW7jhNseZOKRn6MyKSII3kpKHgewmvVNpw7oPIWvul94/YLBEOZc4LzBNpvup4B7Et1bb8uyJazbPf3FxwX9s4AbEWxXRwRU+djWKmtD+jLbxWWtDZQXmdWzicJ+0wdVYERHEa1gd2HTM+18Tuph1A8fuX8jyZDX+GSpxKpjJWH+zv7dfEVp6HGZUTWYBTritgdXFyaPMfdufCnS2y2fQDHSnL6AysPvImPzrqACq+f+oggbG3Xl4/O/BNr91kIju+z/ZjYb4iTDkE1u9+9/gzngjzKESvGtvI57gd8MhKvKo43xzYFM3+fu/WgQ5K5Zqo4N8N7eBfT+DDJ7p0oT7stpROyQ16ekaTy5ybUOJ154yfbzsuPx7zr3sYMHAF8E6NFEHQGlmc/Xho3jpevcyRaZqhMwYEzacmyn5n2wiJ+39QQYYfO2Cfr3b98++1xVeXB7D6JUoSb8BfciehkwIthhG5eypUofwWNLik/ZFoX0oKf4C9YRyBtAyqzQfxEu/mJPIl/2sV4dn5KSc6TFOfeSO+fY6vS5eUZZE/dD/+08VhWOmqmA2l4rHvwFV6OaG6NvJ+mxGtjyhDNgaoAqc7I5pSpE0XwdegfPQJ/wV1R5+E0jllteMRSgVAtZuIJOi5KWS/UhrEZjTMfTkeMvPCjMrLMN233NawHgcqSEc1Qrk5qDnUHrvSIPUZVWK52RKwFZE+LE5LjDS/ukzDELEYTCtedUXUskZBODTQv4sFz4VBaewRbfoknc3bihg4QYyzQIfRAX7bdr2jUDyAvVB/Q8fTPi73wE/EA5UiN974fO8tfir9Ro6H3yhSH79XmwaAdCYUjVv5C+fAV1COHxcWlkVGdkLdwRfx7+IR+hwL2N4dCfMCnp83ml+4TqY84QQ3EYNkhJ7H08M9RnK0SRexvUIV5ZvNhh2+1MtY67adw79Krnecbtc5qeQXgKHwM4Kq1vq9UpNFrXj3VJrObqCQZXaVXM3hSMvXfkufTlucChzrstQaD/swbW7csVX148YbVBOU0IDJkXoE5GMaBvHTdcF6+xrFC8B0LfjwOpb/d9l8vXU3xax8SaCQvWG1MyiXDu7lKyM6eISYcTihE6GagDcjNqA6r1abuDrGvoC1eGQv0ANrbuFJXkKcJpP2Ov+Bz/AVzWNLlkXCYU01G5nv5psu3qPE+yPWY5gRKhr8cElYgG9EZwFmI4w9k/RGbYRFFI74BjVgwSlI7TnFRIhaNciPZ0wo48+H6GVJ2wvZSgVYpRH66SyTeI0n2ObZsdnJ4YQvIl7aVMQGeH7EGZFHVY9V6J0gDEaGk+h0qZ1O94O6Eyr/Jzu8RtZ+3ygBztrj35e+N6JkIz6FSrZopehZDChJXux88sx1I/6rHqgsdXb/EH0y9lL1Eaih95KyvRoYhtKXD3rGVy0KhiRlYLfOB6o0T4RRky0uxQ8ElZIgFgw53MiW0+aPmE6AvhY9lYkjd3FAXl92HzmaQOupkNTAcFhVWPuST0xZQ1uxvNIQU+Lq9juTbY74H7IcOqh7GfSc4EpRQkfbXrh3ymdPpAfuK2dJR7vLi0R2aS0i4yBE/VrRd9d/Sbk0iRLqTIZ2ys0zHddjCeAjyaNRopIbCUKeFuAOocR5zxkdPX6kvr4z7GbUGATuB90BO5KXxQ5gzNpanLDGW/e/uyp/XM/uNj7G0aZWp6uBdcvCGZZ3+BMlJWt6IaDsg0mjYgWE9WaPV0BndgGfQpGpQCHAIMAgYzbd71V24TB1VgZJOqFZZJ9AzGDp9T/qsuhLRwiSuWV8i81/SYraqjRjzIh4dFXe33Mm4laxbXRxWcQyhkkPzZgsY/HhHx2NVjWGkxiMmcYo6hvKJjg63eyBmu6jjpqS4Z3KGmHJK9f/VufGoGqlo2DdUo6q+VHrEJIOSnA8wqLwpAnRBzYX4ptUVbQkaIQPMaWiimFcAJiIzwyUDKhPnDTySk7C/t/woIj3mprnS0fXtsNOy/xkZMq0LEFFI1YqtZBgNNWruMkowzg6phO4jZVuzKM69BeHRiJOnsSNYxMj8aApRIUPMMOwbYudN745wEsjHlAz7CjRSeGlUvRYPv5c3dRlwlz84KnJdzFyxKf1bg2Q7GO1HvjjlacqzkpPHt8vGjn9mxYFfOOqjtcoI2WDRjp4nrg60dizsIyK3/nBDG9t5T5npFTdQKb7mgNxfL/iJeqtYpo4bW2Qcn2lIcnU4heMZNCmZfC3nDJx8IOCoRAHoLSn3hNVm3vVfIkYfXhp/PC+Nq1etyrvnL++EMMhO2+2l5ZS8/hHBFGcqpAJDLLZpm8ng2BCT5wGrSkIdAiAzCNC3jiR20BqCcCZ26iwlQuVpfIWXR5lPxIdHMglSwuIOWfT5eSQaxUPXkCiRSfj2byCBYORN10ubfWPf5ERiyMzHYVFeAEPPJ3KXTfRYvN5P8U1NLv7aSFlo4h6xr7F1NNAV9Nk6hbsToSmpHp9cvp5ol+r/OwwzCfWpVUdsewpCxCRkiGnYuJyV+xYq2VR7urpiyPywwVFNYEfovKr9xX3IcBwOLKnOo9II5SjNjWFIRDQxagqzaBKhkYlIT7P/GfFS83XBdPa+lgxfB1oacST2eyphGd5mVuh+UpQzBohMYB7AJqOo7oZNODTRchCaaFqjAAOsmaEhWs8HQmqHqr0ZWpCMdHOIjCTq77i4pJaed8//KfqitNwaiP2NzSAb9xhLafMJKZtZPH7tfhxb2yyy30HOIa+/043DzCt+y04m3L+9llm2PC4rr83aU3HodQQ+L+uyeHmgXZPwhlVigvl4ywwLSC62TeV+Bk1xvn5zjtPqV+9z6Lb7GmQmtZk7dmUqhrFEhlDT8RGTN979kq3bSxM3bCRap/3YX1eRaRCZpF0bFYFIf57+D6X6C6I6huKc4VGL0B6w6kFgZUpmq+yD6Iw6al5mYAwwC8LleEWPRTIWsLhLawytdrPG80kG1YtUJrrXg5qhbPZvioa3Zm0GTzCOcazJKfA8P+JLVE9EiLzxdkGM+THD0uJhJZk/VZfqBbcaN5JdMJrsAh/Z0+5DdTLoE6z9+XLHo6bCELMjSBINSyK9fMlsQtTMhQoYKTBCgqEFh0QY0CU580AuoPK7o3THKwtqqFNmahIesS3nEwp5fLLqUECeolp8Yk82mWfHHcKotYstDbGoF/sKjiI1PbemmURuiESWzIj3Yx6aV6ByY0eUvqtHA89EjDWYjl2fr2mMhUMTjYA9o9lXnAZyOVCOaRUBoZBO4fmqNpY43mmvxpsCT66LS/2wjNqiYGHEQYF55VG+OWo0qdhUtss3x/wZFbuKfS3ItE53fInyTv2/3LmX43A0EcYtG9c2oXhWQLy3Q5yolxiM+s1fRhMsrH1Emtm3lynRVZYT0wnLanjhDsFZeovoXUmVpmlEFBv1ggkpJP7v27qmSVPCa5R6twSbDTaA2EXaRFoiRMohX4qpDwIvo/I3SuIUDg29uSmpxh6aixaGw5yqeX7UeopzLyBo7A+EFfr0CESnoDKwqgPkAK8AACAASURBVF2ltHM0DKsdqL2aXPGI9Iipg5uIJxBpJAaheWxRAk3CI1ZJyYhPMcsPB16NONoONWc7lhVPhUfMl98KangR90d1MMpYVK4nVNPOTE69x8EiOxaqyRliQmTYWpeY7WL3j/zhCnDwivrXvKt8v2obl8U5s4FcKo0kpRcecyEXTAuFklSEDTFnHqmQ4p7ot/imHYZv2mGY2h6NVE6S+Kp8Ss2QzqA6Dm1JSDDoxFiv+Z0MWs7f15qf9Xjf8dC8LK1un5dnsXb1sFqiH+fTsevUqvxZy6FqorFlYDiX8WMCxj5V7xX6dUSrIcmHMJuuIebS+Ah1N33yMFDsFgjezvfHvBGhgrtrCHhb8mt3+zk0GpFTax9z5Bq/Yyl7IBOCt8ZrsGJ8i94Cw+K1icZL2w768Pdg8z8nMaddwn2tM2diT5K9LsJfGXD/QamdUQTnTN4LVfuiKMr/mDs+cf3aJkT+J594AVtlEN759DuaWFpYVEq19UUGSuxdF7Vag0SG4fTFkheAZaC/RV/Aq3DRM6EdY5Gfwwc3hf/qgXxcNX5tZg9fDpG5aHIpkeIgasRO3FdpB0YKDLEkjROrRpjSV3FrpanGr0GUiOdGb6Q451xE7484ejCy1Va8bcQ8UhD6Z9QMzxLrMopHnEZx7rEIT4aPjsBfmISUttbfEEOT88IokQvZPlXfBdv9NbJcwycp2a2yzMrnUjfcsjh3Jqp/pdozvj8BeY1BM1pDh9DiXsSml2V6X4QTwo/mIfJJ9V9koVM9HV9B7CKdGvwsYj5gWLFLYySNA2PdzPiBSMESsY5ydKmQ56ramy18Grtx+LvloeZ3fVFeAG0xNBweXtl2GEu6TAOVKq+lZdNoVq1Muj+uxvukMj2iVRper+PFVIhy1xBzaXxUu+bN/7FmUdtm/fsS+X2M258Cfu+UTJ2x+rOq79GoxN4oj0Q0qVC+dcEWx/5rWx/H9aJEGbZ0bNvoxasBy5L7cFgWwEKCN649Z1eE7yXN/h5jO6LjEreMigcxHmsw4Q5Tnf1OGvKIY8XsRmbd5raHYiNtZMfOcr75IXr1paZGprH5WIO41r3RHquOt6gdMBZhNOuWVH+g8vIM/AVP4i/8gYqd/w2po+kjwLuIdQmqTnc5tgFTEJkafryZc/Oz8BcuwlfwL/zTxtRord4fgFVRRxIr9nNUaR3XGLWLJOlKt4xI6/61es8jIaIUjfgbMLP6kHWmoyFU6n8jsczYY6Sl/bVaYEQfilujrqlhGZHS5iaBsnOdDSARtb3Evkx6PCo9Yhojd7FkxOMII6n0jAmH4g2+Dhszw/3sLe7FugqwEA7EU96WndKS4lyhOFfou9pEqaxXJwjDY45TMuonoFrVS+Wieit91odnL94CkSIq4mzjosM+fahWWVuP1erj2I3DhpjlqbvpUuIPoi0uqWmMMRz/9AepNBRNT2KjOTu/B8gpCEV4ytvSd7VZ9T4V5wqGVheXF0ZGVa1NhOVJRZ6mi0u9EaklXmBZh9nuvLX9i6BnpHpOtggaGWxtazeq6FDykluD3PH7X1ZSGaJuH9MgEDVnbvnYNieAOPzdgzXB5s/vxLN/4paNzNzrngf+lWTv4xg42W6NO2coTtbYigRTs77YhaiKLRX0b374uUkKdEQjzdjW2kDiKcFYf6Ja8aw2+9Chb8iaHjyzHUu6vApcRqiIax88eg5WcBXFuSdQNPIVMPYCnKjIVVBu3oFlPIryDoYuJNMYAvQLiYDIQ/gL/o1vemRCebQQpgrW/BI7KVW0PaLJqeGkAtHLw/8rI6CPpXTsS55qFrNOlBrXU7l4syT1xZLrw9OXbkeMSwj9OKQhWoIvf+/GnpYtZg9bSmT4p6VXO9oBEzk5/L9NqD6RmklJpWpi7J2kotwChNFUeqKEoxBzHmAhNsQ6fP9sDlwMvEVR7tc8N3oj83Kqa/jl5VkRnk6A4fFFOyTyR74zLbKc1VQLzSd1iPwz4tHxZE+3/6NnWJFKmg/G9XoTDk2UYPTcihJ/kNaBy2qFKY6BsHJaWbmNBZUnFxBU8nlu9MY6XtdZuf8BfggNTXeWdD4t8Zi1LxFwDTGXJoGg+9U6VFchNir6I4uP647jgs8pZE0PuzlW6bQ8ec/EzeqyLthis9a8N9tEzl12bauTax9V9N4kplG6YGfvXSMakQpUrgHsl6apyX0NItwh0j1xo0r0e+Zc77iWXGOjYnSz0275KmfCxo2NgRKnPoIciGlE35FR1lHiD5I99Qi8FZ8Af6nV91HEXIe/YAP+gsWIFmOvllglLUgL5mIG2mHwCAHjIjBqh8mchliL8BdOh8zfQOqGPyrfx80zUvqiZamtnyA2a4z4CgcDIW+PyBReHLE6pfPYWdEFiyFRz5UMX4dIaLElcXJWGotZwz8Ebg8/2gMxX99tiswGrRuovEkLR+Gfnmur39CCU1DtHXqgtzkqYhyPKk+YFT/vrSg3H+FKqsMC+xG6RyT2iBnplwItQWfEbFNR8SzVIX6d2GzG9iwV58yGGonRd+MvsCfLe/mMDIyM1MpMF+W8AFSH8Kj1eIJSEyF8xSaqleG1K6H8oQQ9QsapEjsMeeqoCtauugAoiTgaCvX0eOMbYiPzvaheBqyk76r/RG8kChIhZZ+MaIcROzTRN71vzHMuLimntiGmNjf1ZBFUhVo3Dhs6HoDdOo7lgcQ1GmOQ5vHehpP6ZWFEmKARNdWWj2vlA7WVwxOJwpRbN571c+KWTYR545bV2ix0QifUuj1xM6doN9tNJca6vslj77v76/p6ZkLtYgxMjVfYry0ayKRmVWyAX0HH4ivoiRoLgW4x+nuBNkBfIhXy7OEB7seShSjFiE4CrbP7EkKHIVuHY8jhQFmNU0KMxUbleWlByVXOZcbjk9hg8M04ENFQPobyDq0CcZNfk0eih1Wc+XA6qiFPmCatBNSw9F19T8RivA/Ca1zylGMVpl3O7JGLQYdTZdDow/imxfcqDChsgcWD4UczKR7xcOomVKm2aSTOMSzKzQ8bDpGx4wkWAirhPpvRVnNjNptz5VoivYXKmJhtAbzpfqi6P6UBb5A9bWC8LgBst0ajVmo3NRAloD6qQ7mPpGOXGYnD9jZfT6gG2XZEBiW816hU5tfG/5wvyguwdvWF1DTGIC0jviEWMn73RHgqbv5hQJ+kSulSzuW86Q52WwENRi9N4cvfG0MdK7y5uCSPdKj5UOxu6H2F0jv183FA0MxAzZ/sNZZ2idtEZ+/71v+iWvX744QjV4xt5QP4ZCReVe5OYoz1kmbsPt6wStK23AskW5T4KgZNSa58UCxE7Ktqq+4+Rm9N2iRqoAobNyWjQdN4GARbfkk85UQ1zkZ0QY1jwkJKRiwAzSYJedIUo6BfIXoCs4avIjK3BED0rZg9fTP2AF0a87wjjMgFWTeGTo+e0O+b3gF/4W1I8COgNSJT2Rn8C1NH2dn1ithltlm0WDiB7IK6O9otsm4j9N79j23bn69zPv6Yke95cmEbHquWURBFPCEvz0L1QqCyXtyRlJW/HBKSiDu/6jlpMsWdVaDGQti5+EfxiOdBLyK0y5iByKv4C++IKt5x3vTupPM6cADCZNautudBs42Gb15WZ1vNS0ZMDXtBKhfi8Rf32YXngxyIsogSf/yiHaJPRjw6Hv+0s2K2ffbiLZR7TgkXaFegGSpz8RfMCYUk1wr5PDc/C3/BdYhORM2vo45ZPZGa76knkNiL/eKI1ahxSkSB9ItZ0uVtsgvrFmgeme/FX3AzIncDv2BYp1OUk9jzLuH3SjXxxlWVMabFVcfK02LfR/LyjLAiKVjyZtyxX8z9MewRAPDgsfLiT6aWOIeaf61S36xkaGFnxDMVq3atPBeXhkRrhinbLm+iPwLONiAaggqPPeVcs34hlIE070Rwni+vcO/iPNLaNms5CrCv2lfZX/TOHhM3bnbar9EpySuPsmlpFxO1/plS4Q4ngnFK0y2uFZfEQnEVgcBukx9WiYcSfxB/wZvEKgSnnI3KAwg5Vccs2ofDcp4D3kEZh5B4p7pheJniEQPxFZucl98b2Cvi3DbS0uN4e6wjqSnnnhx5eQZL9OiII4JlvY+/4H3ge0QCYYOgN1iHAxmg81EmUJy7IPqgEZyX3xuPZ19Uj4w4ejS+grMRo4zSivd5edSOuh2NzRCsQHkCf+Fg0IWoCsIpwKkonxDUwbw2pqxu3ygMmdYFj3EsqtkRwZetQwtOviMQ/IrZo+Ln2/mKTWTbSWDV/LyocRX+6XNRayUlucuqjpfkbuDyGaeyI5APciFwEmnBz/EVPobJQmYN/7RK+Wfw4x3J8OxBkOqETuUwLph2EOXmNtpVrEpo8GYXno41/WAg0ti7AF/BKgzdSdGIF+O/SBEUj3ie8/I/xzTvAM4DvYWK0uvwFyyAcFgoVl+w+gOfoHoGxSPiL5Cd4CvcH6y9QQaEDsif8BcMB+Mn0j0f8PSlsbeNinOmkV2gKPlE9YipcOHjranwHo7qFBAQ0hk6vSvB5r/EzIMS42NUlapwFpmOr+ByLON7Zg9bUUfFae6wTUAu/oIZwDXAQGAQYg3CX7gRCr4F3R7a9db9CCkqrYeKL4iGr9jE2rYPUuvzF+AsfAU7wNxGybDY4j4lw5cwaMaRpAXuABkJHIfqF/gLvgD5HLHWg+zNJvoB7RGdgeW5mVm58ZVZfYXHY2gXNLyQEbmU7MLPENkcDtONzqK8AP3zLqJTF0XJps3GukazrziT4JaOLNG/gx4ROqh7M6CwRY08vjro/4BQFIJyCf5py1FeJpC2kjmXVW/enTe9O+igGusR0XMIym/4CwA2Ai2xwmqmJv+I+1q4uKQQqZUb2yrgXbPTYyXYqIETtuylC9AMy2amQUPRvLT1xoq09Qnn27ois6I+qmO971u/ddm4lveISqLw6drsm7Gl1XgN3Z+dskIrtuQnbtZEmXfd2wyc/AxoMgIcxzJo8mXMTSY/Lyq2DfFT0z0nPjxiajK5fLyT+UuHktZL6xVevsMIbH8/89dPEjYUXcbf3imIOJBwU3x3M8Kg8o0TeQXV6IaYcBLKFcAvQOfwsdPpuNc/UPMJRDNQOiS3KZASBpBdmI+19SNMMxeIjCGdHXexKZxOafBv9bq6b3pflljnAIvCfyBkobQgVACyVbgm1U5EloDOJGD+JyzqYA+vZwtBay1QN8xQUPaMETpWMuw3hhT0wsNQVI8BzkeMLaDLMTiVWTkLHMmXtrfWsK3iTSC6sbAlEMUYrD0nfxDftB8ImlOAKXXOB826eVFPDtsJXMaFj11LhTe8Q6mgZs25G2YHgmZH4IKqYwIE6YhJRza2+ZVEYXalfEDzso+BgjrnKkzn3/CQYeoPhWSZp6PGISGvh3YC2YzKvxC5zpa3xDHGZrA2oFWCMOHDKJmliYuYF+UWhIwT6u5WjpzqYXPaqWGdrrFVx9U6mortbxKzXIWRBrVC0wQwgt3Iu30leTFuJMW57wHvMXhmOzwVR4MegiEdQDJR2Qm6HTEKUf2M0uDn0TcmgHVLhI57dwfjM6A6XDS01uqGVqwnUZ2YkHE4hiH5EzCNcxH6gbEn6EGosRnRdajeCdarFI+yF1ZkBdaDUQpUb+ioguWJXXqjkkV5AXzFFyFbF0XdaLA2dcdr9AVZACyoer7p8meIE7qtUoJIbXWw5ngqNLIRRkE3xPwSJPR6qpWOEc5xU02vke8mxiZ+W/VVwufk4pIiLKTGveD9lf49gT/Z6PrCMcZ2tliNq/A9YfVJp528LnFQhiLpf0pazC9EWcstT2RsajUGoYejjqGQRMcWq6I39noEexvBTRUjbSxW2Zk400AIoUxk0JS5zB2biqQm2/U+u3mNoxR1VoYlzA6zgvnNoguUO+SUxE3kZWquxRJ+Gb27oWBvaMalzCODrUSvHG8gjEDJR4hIMJQ7EOvvKFmNvGEUqokTkt+udZzYKoQj871sgpgLNruUDF8CLKnXGImYlfMLIUPYOS/m/ghMjH7SYQRcaJFX/wLDJSNq5xza47nRG6F2DaYIFfTZIxdT3yLicT0E9SAkyV7XuGtIQp6d+tXIK8l9Lurx0GehJOq5eMwathJYGf1aNvqHPDGvkqwnOyTcMz+pvrV5cdSvwNTwX/1I5ElORMgDGV1lM9nvRUnOB4kbiVJCYq++i0sjIejWWo+DanPR0k4g8U5Iw9LWZnC9qOVUgr4OB+RRvmwcN4kyy2FX56tA4eMek7cUOe7X1Jjz198ZMOlGJKnfgY6odQckyJe2h22DdufuUOk4RM31mEogke/AYxpkZqRRujPxXnNTIfQVn5ezFZE4eUJ6FN7yR6h7T6pfgWFhYeg/np+B7+s1Vm2Uf+PRnQwojGZcwmY5A8N6Ieo5FxcXFxcXlz8Cv0Y+UMT2gnVvj/P04FSzZ5ySmzUQIyUrzx6TNxcL2NiEqTf/kEYMpUop88YVUJ3L7pTRDJhkqz5WAmyrLK8N7iYvu1JTYl/UVm5b+9aprV7T0ETstUj0OF1lMWr6Qt4IfSAlV1UWg5yPR2/EP/1UzEAvzKx+iIwFey90AixM41aCMpMMfS2qMabmYeF6OS4uLi4uLi5/RFRqpQGI7eiS/c2kaiSnjD0MoZNhbw6WSkqU8AQUS/6eirHiXOXVHpM3xxZS2+0QxbCuwEF4YAQmBvmJFXgToSvttvw+EKeUZVNC5fuaD7H1Ge+6Z9ICoo1C9RtfNPwzlH/XOv89weBplAwPVUfbWnpfhGJYsvyPtIxj8ZQtoLyiGVhjUOMs2BrEkz4dzAHUe5dEp2LpocAhwHGk83oNYyw7vwfCMkf5US4uLi4uLi67Fwa1w35tysHDCemN6xE7LM3+9bMMK2VqpN0f2vQ2yCupGq8WQQ02tKHXCMy5/ms0St67HZQj+LzlZfWbQKUAWGJ+DCobdofwRLG+r/lQbH13e+4TvXpKU6WmBW7KTVQbQd8TCPYP50GEeG1MGUoukHwssqHXEigbRCBtLaRNpO/qQfRZdRNBcyGBnZ+guhN4KenxYSXB4GTQO6uOiB5Lhv4L3z9D/ko1B2O1cBoD7eLi4uLi4rIbYQXk3cjHalnf2e17sMekrdF4SfDnZHjtNl3bY+qolErAG0bweuqz1ouFMLPnwxsTqkDulmjz26lbd9cm1v0/bWybkfS1LfnYblMF3i5L/VubYgJkltd4TmJTj6F71w60aJb8S7krUQyrpiE2K+cT4EVgGeo9uYYRVklx7tuo5iV5zXJ++/ndcO0FE+QBFnd5n8VdLgI+QOmFWA+BvptooJjjq1yI6X2Cugo2xyPpr3HBtIMQ69uY8touLi4uLi4ufwS+zzt97xqhiEGvxi4HUQtT4MJM28ZQStnDEI6z7RGTlOd07Ttp67fAzBQPW6qYeSkes+nw8qgdiF6VXGdpd9mTF+2T/MWt93AQTfZiaRM3xJRPGfNhDV0KE/MDbDxHQ4QjDmz8EoB2KA22+b5uTGpAr0VlPCWXxY7FPODnCeBYVQcgjU577gPyBsIyDLqDMZyQAtoxAKjxC3BQEmMrKqMQHQR6cow2x2PJjRSNbCiXu4uLi4uLi0tTQHRu7UMHP3HlWsB2GNcFmWlkNYJT7IrmadgOTBT9b0PMwev13grUT1k6EuXBnpM3pET7vMky97rXgDnJdP3v8m79/rO0Z3Iq3C9ftx7lS7vNP60I8lWgCdfcEqmdKsWNp3b5HeylRx19cE+yMtJSPq2UI/p6XUPsxRGrQYP48lvF7JiXZ6EtL4uSU2YD82aKc26nKHc/inKewgj2wmAoyBhU/gYVD4NkOx+3qkjo9XHabMbyjk9ibBcXFxcXF5fdCo1efoM69fFi0tqAa5qlp2pCttjPYzDEflgiRrLlPBKw933rf1F4MEXDbfRkcH+KxmramMZVRKu/mRjDP3WYWJqkfoFosZPmk7aW0WRNMQ1ELW2g8LKd7hnpXk4//sDUzqkBaG5smBFdpaUk518YRvxiayX+cpqZA0GdWf7K5fgL76B/ngdf/t5Y9AE6ocZ6PNYbiGc64OSuZ6Fci7AJ0ULi1bMQuSqup8/FxcXFxcXlj8Dnt57c/X/RTojD0jUXZnk51LtrFBQzBCa0zLDvDYOlfaaOarAi6QGv916oJSOeFHL7Pvdurn8d0t2BF8f+Cnp74oZ12VKa0WfCa6clF2oqVhEOwhM/rgjy5I5khB4bGJFP+ft7UWtfiqjt+qWH9ulGnx6dUzevFLMt0OHX9K58GePOIkqZZwHnzegVd5Qnh+1EW/mAKThSOtRb6NRlCWJehYhiaTkSvJugfAZ0sT8OW1DNBjFRHqe2+EgN5GGKcp51MLaLi4uLi4vL7ojIvbFO9dnzt3cRbIfIGcCDLTPpsgvk7G9tnkFvj5PraJwasPWn933rt4LcU89hVliBTdELzv9RSdv7YeDzZLre86/T+qzf3ty5R23u334AXnPS5cHtZXxR0cT8YpYV0wt7y0ndPsJm3WERGHzq4XRsFzvArzGxghmPQzzDZe6wTRjGDoYWxjcnS/xBinPHIToY+N32DJRewN+AexG5CzgXnGwC8SlqnojIeYhOIn5l94W0DlznYGwXFxcXFxeX3ZPveq/fe3ask5KXZwk86mTA9qbwROtM2tstsOwQAf7RPJ2BmR4n3cpEpMENnI3bNz0GLEu2v6I39noE24W0/xCU+INYOgpwLAxnYbQZOvWy5JQlFUf1foMK124uZWmwyRhjK9hpxtSgEBEV1Ha4bEa6l0sHHkf7Nk2ryHOZ1XJnx/RVD0BcDxKEwvjEjFoQuTZFI17CU94L5GFo0LDT7cDfMawxSPAFYGj85vIx3oxBTB3VBP2vLi4uLi4uLqlEhHF+v8RdAJeVp00FtjoZd19TKGqT5dBjlZh0Ee5okc7FWU4VGvX5vlOjqFunmMOnUqHCzUl2/6JHqy2Ocpf+MLx83ccoU5Pp+t4P3Y95e1kP58bvvPELQRY56bLOUi7bUMqXFU1ATFzJI29RXEnH4I70mcB6u0O2bJ5J7vn96bZXbTH1xmNj+T5PSFdKIZEhBjBr+CrS1Uv/vMTbNM+N3khxzjUIByM8TWprUGwFeZigcQrCQVjGO0CP+F30Kyo8Z/LsxVvit3NxcXFxcXH5AzD3lpO7JRTjOPTJYZtAHHkPICQr/3SbLC7O8joK4YnFfh6ToraZDHEuk1+O5bk7BVOwRY/Jm4sFnOcuCddJXtPVhGhwKrx/B35J2K4uhi9/eCAp4Q4NXoNDT9xmVYZv2skzOyqcu/BSx3vc8PbTiRrlndt5B+AoBy8rM53LB5/ASUf1xbMLQozjsa2i09ZufFVV1NzebEpyNwCQl2evfVHu1xTlXkqAnqjejM0ibFEIoLyFyjBUzgD1YFpvo1yYcO7KIjwVJzLnMvvhki4uLi4uLi67K2ssQ6+027hl8233Az86vUiWhMIIZ7XJol+aaXMhVZPOhsEdLTN4oU0mvZJaGOqkAwpzkw4XdIqAYsnfE7eswb96TN78VoNMaHfhtTFbEE0qNWZLaUbvCa+fZrtQcxXzrv8yHJ3miFJVJmwr44KNO1i86/PGyjB0NGJPb6L37/s8LuAofNMwDE46qg9XXXQaB+7XBUMap1j7+kCvK6RXdaiu/W//orywd0vtz/zF3B8pGXE3xbkHoN4uKJeCPojyGvAd8Cuh0ICNwKpQDQR5AbgL5RyCHIkhLyHW1Yi+D4wGEhcGEJ6Glmfw3Oj/Hwo9Li4uLi4u/78JClyYd9K+v9nt0HXKuFKQMclesK/X4PHWmbzSNotRzdI40GPE9ZK1M4SBmR4ea53Bv9pncl6Gh6RSzoTlZtA7Idl5J0v3hza9DWJXKt8yVG5q0AntLsy97nnAdsmESO559fT91m9r7iiEFoDNW25EiaoamojFFRb+jTvI2VTKyzsDbNXk1PQdoYzn+nds10Hz+yUoMIokIu/atW6O7y9Hce1lf+Hko/vSuWObXWaU/bTjuLf77PdujbIajrJCycuz8PVNw5zeiVnDnRXlC8nGPx3+C6NC9tTuWIYFHIbQCaEjyqEIV2DSHlXi63DUYDvIWIpypjmam4uLi4uLi8vuzLW3nNJtgdNOB0wbOW/xiPx8Qou6pNjHYzDGk8aYZmlss+Bny+LXoFKmiiHQ2hB6mAZtjZQs9gKG6MW9p+c4X5ynAFMD1wfFPIPE68eZ+z646YtdMafdApVrED0ZyHDSzUJaDy249L/zr33saEfXW5S3k8FTLsCyPgCSkg38b3mQ/5YHMYGeHoP9PSYt0hokcLGYv7/9T6edbj6l2/t3LFhxDyq3JnPR1i2z6H9kH/of2Yed5RWs37CVDZu386f2DaMrs66s9xbjh5an1z7u3B9e4i8n2PwXhuTvybn5WfWalb/wWtR8CI+1FZF8kEdRbiWkoOg0q+4jgsHDKXaNMBcXFxcXl/83qNx26yndHKkgRlIqjBOwvRsfj+YG7O8x6J9uckaGh9PSPRzhNVNlhIFwS5/8K5KrM5UCuj247RuEpxI024ll5O2K+ew2zBu3DCQpL+Z7y3oc+c7S7o5DaJkz9hvEGgT1U6wMAt8FLObtrODrQMoNsbcpNS5LtrMl3e5E5Y36TiIjzUuXPdpy0P5d6bVPp/oOV4etwc6BVWUnn9jrrNfqvBfJZayV+IO8OOpXmhst8E07DF+x85zVMx9OB8YC8Pyo9cD0pOYCa4Ac+q4+htmjvk1yDBcXFxcXF5fdC0XlhltP3eeO+gxy+NRRO4yg50zgpxTNq6GYfsDUUTHro+0qvB7vLcCOmA2UKT3+r707j46qugM4/v29SUJY0lBaWopAkBpAkU2FVokeiSwiReoygeMRqIQQkEWWUpQCGejCYhGBAzmEBNpT1JLpKULogVqEQKlaVBobLRaUsLSAISSZJDDDLO/2D5YqEJjlTRKa7+Ev4gAABvFJREFU+/nzvXt/907OyR/33Xt/vxUVDf1vWffiqhYDB8PoadhzxnrNEG4GXfHmrEJgDBYlzzuEJ6zjjrU4QJwxHEehJ9wAjv7ibxLvthNmzba64Pa3UkUu+1P9uq257g5xZKlD3sj4AhKLMKrvZsT6e4LKrDhsbTPs68aT0GwN0B44xZO5SSgWIfz60v2xIEgpSs1FBbqQP249DkfjzcqjaZqmaY1LDSIj5w9IWmpFsK7r008awg+AM1bEi4KtbmFCfU8CoMPSspMoVtTyuiImnpfrdEK3CqfDi2ISBJeQ4stc7qbJS7YPPBDWuFtmbsLgCW60eA6SW5Q70hgACLtoeqE/0wsrIw01O6VrtS2WocAnFszMUlX+28z3yiePGtRzxdba2kSew9GZFmBT+keYLT6iTdu+jMgbhH1Dm1rbF2SeR4wewGhgI0oOEUMmqERs3hkINy4gjbyPUs+jEjrizPgFzszQq49rmqZpWiRi5GYf//THwSgRRZGIed/81CRL61PdmZNZHBAeQgjtDny0KV53C0/f14DqofriYhcBpde8EFmYtNilE6XV5mKdr43hdP359kGdymqah7eY2jxzG4YxAOTfYfW3krCW82eHMPVvlpWW+ulDHU/FxsmDhFNiIUpOe7r7Ck/PHvzYvQtfu1E765LpO9MC/G78O2xKfwt8bS4uyHIfZURO52va5qdPRn2tOaJWgxqDYWQj8jn+uC+Anle19gL7UGQhZhfy0/vizMjGmWbNqlzTNE3TQiW+E9ywVo+U1NlcGo/zCrUg0ev7/rzUTv+KxgA9cjI/BVJE8UE04odIgVp0V7tToxrSIgyg69KyapBfXvX4qOmrzK6XCd1KjLjphFCQ+DJTScsf/ebZ8I8Gbp7+LqbZmzAzOFrAhTCSn+ydgOMTr9XBX3owqaKpP34gENZC1zrCwephZ3afmtdrxP1Td96sdWhZE4PlHH/pHKQS7Hl9sK97GpELKBIwRJBACb6KcrCVIZzAVI8ilGBSg6hSkEMoDoEqxmO+R0FmxNupmqZpmmaZ15+vIC13AzDuOm9PoPyW7tY0cucV5NmwLZn7SPv/RHuwbjmZxw9PWZnidTdZihB2evsIuUylxnbPnfCHehr/pjyJldnxrsTJwB0AKDUneVVkiSEahc2Tz/L4sjkIOaF2fftg5z4Hjrc7dk+HMDe2Cn5cBgxl+CvDQK3m4hWhOiDbUIFJzN4X1buDswa3OQeMWvD2sb2CWg40j+Z4V6vwJfF++cQtx0qfGjH1seSg/heisxC7QhRO9gP7rzyy5zclUPUt4mgFtCJgLIYW75KfprMdapqmabeO2PiZeD2tEYZ/6WkJipH62Lwl/imiNgZ8gTzH4DuuPQYXRcmrpl4AXigel73ZEGMNcGddjS2obT5lm9gzN6P+j5HdQDcH3s+mq3mCvAEUdWpZtam+53TL2Dojl+GvjAH6hdgz5onsjIpji7IiG3/LjALsi/dyIXYaoqaAfCOygLVRO1DyM17c80504l9f1iNJ6xxvHf+jzWYuVjAq2uN5Al/nw8rnTv6jfOQzM1L77oHga59HeSF2HRePFB4jjGr2mqZpmtZgvPZsFfBD7HkpGKoHpiolvsl2fjv6XH1P7ZYkcgJlFomwWwVids4f2L64vqfUPXdi4eEpK3tf8MRNE2Qm0DqKw+0zlTmve+7EwiiOYanvLq/a9Pn0xBcE5olD34sMniiMlydgGgeA2FB6lla36JVVMCSHYHPb1cb5ogtYgH31Mnzu50BGoegTWVAAKkD9HlOyeekv9ZbN0DGow0lg9IKdRzeIMBdItXqMcu/tFLueKf20euj8SvP+PEeqhJydsu4XYpqmaZr2/8SZvg/YV9/TiIqAfIwhT0YjtKn87hgVW2NiuJqasUcuHStqcC7tji35YPzaVc2UZCjUeOAui8J7QbabKvCqZQswMXegjCATZqiIii4LqCOGjOy0rDKyj+tnqs6TmBD8NoI77n+/z4z5UGz+OcF0U+ZXSxQYgcBYZcS2CKZvnJifBT2/YGye9THDftUDW+jH5zbsf6Aq4oXYZc5JNcAqYBWPv9oFIzAERX8gBWgVRIQAUAwUotROPOV/jsYdsHBlDei4G9i9cFfJ90RJugI70DKcWEoZlPmSKal5OHD0XMpfT3geWNm5rNOb09Ik7AJrFlUY1DRN0zRNaxwOjlt3b0DMNEORqoTeQCj1VF3AHhF22MDZJScz5MQNmlYn7Ctb4/Ulo7gNSKDtUbi9qBlCDaZxFlMO4z1zpCEtvG7Gsbsk3qYk1VSkCjwM3A00ufz+O/F/p983l+MNJGBi45z/21T525oub7tTpz29dlX7W/8plpgdcwa0O2vFfP4LO2kfwi+GK90AAAAASUVORK5CYII='
