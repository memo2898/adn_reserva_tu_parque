<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alcaldía del Distrito Nacional</title>
    <link rel="icon" href="{{ asset('IMG/Logo_ADN.svg') }}" type="image/png"> <!-- CONECTAR IMAGEN -->
    <link rel="stylesheet" href="{{ asset('CSS/login.css') }}"> <!-- CONECTAR CSS -->
    <link rel="stylesheet" href="{{ asset('CSS/headerFooter.css') }}"> <!-- CONECTAR CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <!-- CSS only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous">
    <!--<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.css">-->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css">
</head>
<body>

<header>
    <div class="LogoHeader">
        <a id="logo-link" href="https://adn.gob.do/">
        <img id="logo" src="{{ asset('IMG/Logo_ADN.svg') }}" id="icon" alt="User Icon" />
        </a>
    </div>
</header>



<div class="contenedorForm">

<!-- MultiStep Form -->
<form action="auth_carnet" class="form" method="post" enctype="multipart/form-data">
    <h1 class="text-center">Sistema de administración de parques</h1>
    

    <!-- Validacion de los datos -->
    <div class="form-step form-step-active">
        <div class="input-group">
        <label for="username"class="labelCentrado" >Nombre de Usuario:</label>
        <input class="inputpersonalizado" type="text"  onkeydown="onKeyDownHandler(event);" name="usuario" id="usuario" placeholder="Nombre de usuario" autocomplete=off  />
        
        </div>
        <div class="input-group">
    
            <label class="labelCentrado" for="position" >Contraseña:</label>
    
        <input type="password"  onkeydown="onKeyDownHandler(event);" class="inputpersonalizado" name="password" id="password" placeholder="Contraseña" autocomplete=off />
        
    
        </div>
    
        <div class="botonCentrado">
                <span id="mensaje-error"></span>
        </div>
<br>
    <a class="botonCustom" id="acceder" onclick="Acceso()" >Acceder</a>


    <br>
        



    </div>

    
    
    
    
    </div>

    </form>
<!-- /.MultiStep Form -->


<!-- datos hidden -->

</div>




<!-- / -->

<br>
<br>











<footer>
    <div class="bloqueAzul">

        <div class="LogoFooter">
            <img id="logosFooter" src="{{ asset('/IMG/RdAdn.svg') }}" id="icon" alt="User Icon" />
        </div>


        <div class="centrado">
                <h1 class="textoFooter">Alcaldía del Distrito Nacional</h1>
        </div>


        <div class="centrado">
                <span class="spanFooter">Alcaldía del Distrito Nacional, Avenida Jiménez Moya, Santo Domingo, Codigo Postal 10101 Santo Domingo, República Dominicana</span>

        </div>


        <div class="centrado">
                <span class="spanFooter">Tel: (809) 535-1181 - Fax: (809) 532-0245</span>
        </div>


        <div class="centrado">
                <span class="spanFooter">info@adn.gob.do</span>
        </div>


        <br>
        <br>

        <div class="centrado">
                <span class="copyRFooter">© Todos los Derechos Reservados</span>
        </div>



</footer>

<!--SCRIPTS!!!!-->
    <!-- JavaScript Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.5/dist/umd/popper.min.js" integrity="sha384-Xe+8cL9oJa6tN/veChSP7q+mnSPaj5Bcu9mPX5F5xIGE0DVittaqT5lorf0EI7Vk" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.min.js" integrity="sha384-ODmDIVzN+pFdexxHEHFBQH3/9/vQ9uori45z4JjnFsRydbmQbmL5t1tQ0culUzyK" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <!-- -->
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>       
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <!-- -->
    <script src="{{ asset('JS/admin_login.JS') }}"></script>
<!-- ENCRYPT -->
    <script src="{{ asset('JS/peticiones.js') }}"></script>
    <script src="{{ asset('JS/mantenimientos/Quick/R_funcion.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js" integrity="sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


</body>
</html>