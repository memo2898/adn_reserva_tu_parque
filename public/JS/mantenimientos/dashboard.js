async function cantidades(){
  return new Promise((resolve, reject) => {
      axios.get('/Dashboard')
      .then(response =>{
          //console.log(response)
          resolve (response.data)
      })
      .catch(error =>{
          //console.log(error)
          reject (error)
      });
  })
}

async function presentarAvance() {
    let card = document.querySelectorAll('.contador-card-dash')
    let respuesta = await cantidades();
    //console.log(respuesta)

    let datosChart =[{
        espera:respuesta['espera'],
        pendientes:respuesta['pendientes'],
        confirmadas:respuesta['confirmada'],
        rechazadas:respuesta['rechazada'],
        realizadas:respuesta['realizada'],
        vencidas:respuesta['vencida'],
        
    }];
    card[0].innerText = respuesta['espera']
    card[1].innerText = respuesta['pendientes']
    card[2].innerText = respuesta['confirmada']
    card[3].innerText = respuesta['rechazada']
    card[4].innerText = respuesta['realizada']
    card[5].innerText = respuesta['vencida']

    //-------------------------------------------
    // Obtén el contexto del lienzo
    var ctx = document.getElementById('myChart').getContext('2d');
  
    // Crea los datos del gráfico
    var data = {
      labels: [`Estados`],
      datasets: [
        {
          label: 'En espera',
          data: [datosChart[0].espera],
          backgroundColor: 'rgba(0, 79, 141,1)'
        },
        {
          label: 'Pendientes',
          data: [datosChart[0].pendientes],
          backgroundColor: 'rgba(0, 79, 141,1)'
        },
        {
          label: 'Confirmadas',
          data: [datosChart[0].confirmadas],
          backgroundColor: 'rgba(0, 79, 141,1)'
        },
        {
          label: 'Rechazadas',
          data: [datosChart[0].rechazadas],
          backgroundColor: 'rgba(0, 79, 141,1)'
        },
        {
          label: 'Realizadas',
          data: [datosChart[0].realizadas],
          backgroundColor: 'rgba(0, 79, 141,1)'
        },
        {
          label: 'Vencidas',
          data: [datosChart[0].vencidas],
          backgroundColor: '#DD710F'
        },
      ]
    };
  
    // Crea el gráfico utilizando Chart.js
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          indexAxis: 'x',
          // Elements options apply to all of the options unless overridden in a dataset
          // In this case, we are setting the border of each horizontal bar to be 2px wide
          elements: {
            bar: {
              borderWidth: 2,
            }
          },
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: '',
              font: {
                size: 24
              }
            }
        }
    }
        
      ,
      options: {
        responsive: true, // Hace que el gráfico sea responsive
        maintainAspectRatio: false // Permite que el gráfico se ajuste al contenedor padre sin mantener el aspecto original
      },
      plugins: [{
        afterRender: function (chart) {
        }
      }]
    });
    //-------------------------------------------
}
presentarAvance()

/*
  ||==========================
  || Lab.
  ||==========================
*/


function Try_responsive(){
  console.log("Point")
}

