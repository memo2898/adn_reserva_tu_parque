<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div class="ventana_modal">
        <div class="ventana_modal_contenido">
            <section class="seccion_modal">
                <div class="modal_top">
                    <p>Informacion del rol</p>
                </div>
                <div class="modal_mid">
                    <p>¿Esta seguro de que desea proceder?</p>
                </div>
                <div class="modal_bottom">
                    <div class="seccion_botones">
                        <div class="btn_style btn_rechazar_modal" onclick="cerrar_modal()">
                            Rechazar
                        </div>
                        <div class="btn_style btn_confirmar_modal">
                            Guardar
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
    <script>
        window.addEventListener("click",function(event) { //CERRAR DE VENTANA MODAL POR CLICK FUERA
            var modal = document.querySelector(".ventana_modal");
            if (event.target == modal) {
                document.querySelector(".ventana_modal").style.display = 'none'
            }
        });
    </script>

</body>
</html>