<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Reservacion de parques</title>

    <link rel="icon" href="{{ asset('IMG/Escudo.svg') }}" type="image/x-icon">
    <link rel="stylesheet" href="{{ asset('CSS/actualizar.css') }}" >
    <script src="{{ asset('JS/mantenimientos/actualizacion_reserva.js') }}"></script>
    <script src="{{ asset('JS/peticiones.js') }}"></script>

    <!-- LIBRERIAS EXTERNAS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js" integrity="sha512-uMtXmF28A2Ab/JJO2t/vYhlaa/3ahUOgj1Zf27M5rOo8/+fcTUVH0/E0ll68njmjrLqOBjXM3V9NiPFL5ywWPQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>

</head>
<body>
    <div class="cont-logo-principal">
        <img  src="/IMG/Logo_ADN.svg" alt="" class="logo-principal">
    </div>

    <section class="box">
        <div class="box_content">
            <div class="up_content">
                <div class="svg_box">
                    <svg xmlns="http://www.w3.org/2000/svg" class="svg_style" viewBox="0 0 512 512"><path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/></svg>
                </div>
                <h2>Correo validado</h2>
            </div>
            <div class="mid_content">
                <p>
                    Hemos recibido tu solicitud de actualización de reservación. A continuación encontrarás el resultado del proceso de verificación de tu correo electrónico.
                </p>
                <p>
                    Su solicitud es 
                </p>
            </div>
        </div>
    </section>



    <section class="box_2">
        @if ($reservacion ?? false)<!-- ACEPTADO -->
            @if ($reservacion == true)
                <script>
                    let id = @json($id);
                    trigger_email();
                </script>
                <div class="contenedor_principal">
                    <div class="contenedor_superior">
                        <h1>Correo electronico verificado</h1>
                    </div>
                    <div class="contenedor_intermedio">
                        <p>
                            Tu correo electrónico ha sido verificado correctamente. Tu solicitud de reservación ha sido registrada y será procesada en breve.
                            Recibirás una notificación con los detalles de tu reservación una vez que sea confirmada por el administrador del parque.
                        </p>
                    </div>
                    <div class="contenedor_inferior">
                        <p></p>
                    </div>
                </div>
            @else
                <div class="contenedor_principal">
                    <div class="contenedor_superior">
                        <h1>Solicitud rechazada</h1>
                    </div>
                    <div class="contenedor_intermedio">
                        <p>
                            Lamentamos informarte que tu solicitud de reservación ha sido rechazada. Si consideras que esto es un error o deseas más información,
                            puedes comunicarte con el administrador del parque para recibir asistencia personalizada.
                        </p>
                    </div>
                    <div class="contenedor_inferior">
                        <p></p>
                    </div>
                </div>
            @endif
        @elseif ($respuesta == false)<!-- RECHAZADO -->
            <div class="contenedor_principal">
                <div class="contenedor_superior">
                    <h1>Esta solicitud ya ha sido actualizada</h1>
                </div>
                <div class="contenedor_intermedio">
                    <p>
                        Esta reservación ya fue procesada anteriormente y no puede volver a modificarse mediante este enlace.
                        Si necesitas realizar cambios adicionales, por favor contacta directamente al administrador del parque.
                    </p>
                </div>
                <div class="contenedor_inferior">
                    <p></p>
                </div>
            </div>        
        @else <!-- NO EXISTE -->
            <div class="contenedor_principal">
                <div class="contenedor_superior">
                    <h1>ID no existente</h1>
                </div>
                <div class="contenedor_intermedio">
                    <p>
                        El identificador de reservación proporcionado no existe en nuestro sistema. Es posible que el enlace sea incorrecto o que la reservación haya sido eliminada.
                        Por favor verifica el enlace recibido o comunícate con el administrador para obtener ayuda.
                    </p>
                </div>
                <div class="contenedor_inferior">
                    <p></p>
                </div>
            </div>
        @endif
    </section>


    <!-- 
    @if ($reservacion ?? false)
        <p>{{ $id }}</p>
        <p> {{ $estado }}</p>
    @elseif ($respuesta == false)
        <p>Respuesta no valida</p>
        <p>{{ $origen }}</p>
    @else
        <p>No existe ID form</p>
    @endif
    -->

    <footer class="foot_content">
        <div class="svg_footer">
            <img src="/IMG/casitas.svg" alt="">
        </div>
        <div class="section_inferior">
            <p>
                <!--
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores minima veritatis et fugiat similique vel aliquid dolore quod, fugit molestias a hic illum odio nam animi neque itaque autem vitae?
                -->
            </p>
        </div>
    </footer>
    
</body>



</html>