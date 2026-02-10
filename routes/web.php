<?php
use App\Mail\ReservacionMaker;
use App\Mail\ReservacionMaker_qr;
use App\Mail\Reset_pass;
//================================================
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\Session;
//================================================
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\RequestOptions;
//================================================
use Carbon\Carbon;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
/*
Route::get('/', function () {
    return view('welcome');
});
*/
/*
Route::get('/Reservaciones', function () {
    return view('Reservaciones');
});
*/
Route::get('/Office', function () { //ANTIGUO
    return view('Home');
});

Route::get('/input', function () { //ANTIGUO
    return view('input');
});

Route::get('/QRview', function () { //BORRADOR
    return view('QRview');
});


Route::get('/login', function () { //IMPORTANTE
    if (Session::has('usuario')) {
        return redirect('/inicio');
    } else {
        return view('login');
    }
})->name('login');

Route::get('/return',function(){ //BOTON LOGOUT
    Session::flush();
    return redirect('/login');
});



Route::get('/modal', function () {
    return view('modal');
});



Route::get('/solicitud_estado',function(){
    return view('reservacion_info');
});

Route::get('/solicitud_estado/{id}',function($id){
    return view('reservacion_info',[
        'id' =>$id
    ]);
});

Route::post('/solicitud_estado_codigo',function(Request $request){
    return ($request);
});
//Route::get('/solicitud_estado_json/{id}/{estado}',function($id,$estado){
Route::post('/solicitud_estado_json',function(Request $request){
    //RESERVACION
    //$tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $id)->first();
    $tbl_reservacion;
    //return ($request);
    if ($request['estado'] == 'id') {
        $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $request['id'])->first();
    }else{
        $tbl_reservacion = \App\Models\tbl_reservaciones::where('codigo_reservacion', $request['id'])->first();
    }
    //SOLICITANTE
    $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservacion['id_solicitante'])->first();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_solicitantes['id_tipo_doc'])->first();
    //PARQUE
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_reservacion['id_parque'])->first();
    $tbl_telefonos_por_parque = \App\Models\tbl_telefonos_por_parque::where('id_parque', $tbl_parques['id'])->first();
    //ZONA
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id', $tbl_reservacion['id_zona'])->first();
    //EVENTO
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('id', $tbl_reservacion['id_evento'])->first();
    //+++++++++++++++++++++++++++++++++++
    $reservacion_status = [
        'reservacion'=>[
            'reservacion_id'=>$tbl_reservacion['id'],
            'codigo_reservacion'=>$tbl_reservacion['codigo_reservacion'],
            'fecha_evento'=>$tbl_reservacion['fecha_evento'],
            'hora_inicio'=>$tbl_reservacion['hora_inicio'],
            'hora_fin'=>$tbl_reservacion['hora_fin'],
            'motivo_evento'=>$tbl_reservacion['motivo_evento'],
            'descripcion'=>$tbl_reservacion['descripcion_evento'],
            'responsables'=>$tbl_reservacion['responsables'],
            'cantidad_adultos'=>$tbl_reservacion['cantidad_participantes_adultos'],
            'cantidad_ninos'=>$tbl_reservacion['cantidad_participantes_ninos'],
        ],
        //-------------------------------------------
        'solicitante'=>[
            'usuario_id'=>$tbl_solicitantes['id'],
            'nombres'=>$tbl_solicitantes['nombres'],
            'apellidos'=>$tbl_solicitantes['apellidos'],
            'tipo_documento'=>$tbl_tipo_documento['tipo_documento'],
            'documento'=>$tbl_solicitantes['documento'],
            'celular'=>$tbl_solicitantes['celular'],
            'correo'=>$tbl_solicitantes['correo'],
        ],
        //-------------------------------------------
        'parque'=>[
            'parque_id'=>$tbl_parques['id'],
            'nombre_parque'=>$tbl_parques['nombre_parque'],
            'descripcion'=>$tbl_parques['descripcion'],
            'correo'=>$tbl_parques['correo'],
            'provincia'=>$tbl_parques['provincia'],
            'municipio'=>$tbl_parques['municipio'],
            'sector'=>$tbl_parques['sector'],
            'circunscripcion'=>$tbl_parques['circunscripcion'],
            'coordenadas_maps'=>$tbl_parques['coordenadas_maps'],
            'direccion'=>$tbl_parques['direccion'],
            'espera'=>$tbl_parques['espera'],
            'telefono_parque'=>$tbl_telefonos_por_parque['telefono'],
        ],
        //-------------------------------------------
        'zona'=>[
            'zona_id'=>$tbl_zona_parques['id'],
            'nombre_zona'=>$tbl_zona_parques['nombre'],
            'direccion'=>$tbl_zona_parques['direccion'],
            'coordenadas_maps'=>$tbl_zona_parques['coordenadas_maps'],
        ],
        //-------------------------------------------
        'evento'=>[
            'evento_id'=>$tbl_tipos_eventos['id'],
            'tipo'=>$tbl_tipos_eventos['tipo'],
        ],
        'estado_reservacion'=>$tbl_reservacion['estado'],
        'formato'=>$request['estado'],
    ];
    //-----------
    if ($tbl_reservacion) {
        if($tbl_reservacion['estado'] == 'confirmada'){
            return response()->json($reservacion_status);
        }else{
            return response()->json(['estado_reservacion'=>$tbl_reservacion['estado']]);
        }
        
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});





Route::get('/OfficeT', function () { // INSERVIBLE
    $tbl_reservaciones = \App\Models\tbl_reservaciones::orderBy('id', 'asc')->get();

    return view('Home(table)', [
        'tbl_reservaciones' => $tbl_reservaciones
    ]);
});

/*
    |--------------------------------------------------------------------------
    | PRACTICA DE CORREOS ELECTRONICOS
    |--------------------------------------------------------------------------
*/


/* 
Route::get('/Reservaciones', function () {
    $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    $tbl_telefonos_por_parque = \App\Models\tbl_telefonos_por_parque::orderBy('id', 'asc')->get();
    $tbl_imagenes_por_parque = \App\Models\tbl_imagenes_por_parque::orderBy('id', 'asc')->get();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::orderBy('id', 'asc')->get();
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::orderBy('id', 'asc')->get();


    return view('Reservaciones', [
        'tbl_parques' => $tbl_parques,
        'tbl_parques_2' => $tbl_parques,
        'tbl_tipo_documento' => $tbl_tipo_documento,
        'tbl_tipos_eventos' => $tbl_tipos_eventos,
        'tbl_telefonos_por_parque' => $tbl_telefonos_por_parque,
        'tbl_imagenes_por_parque' => $tbl_imagenes_por_parque,
        'tbl_imagenes_por_zona' => $tbl_imagenes_por_zona,
        'tbl_horarios_parques' => $tbl_horarios_parques,
    ]);
});
*/



//Route::get('/Stripo', function () {
//    return view('/Stripo');
//});



//-----------------------------------------------------
Route::get('/actualizar_reservacion/{id}',function($id){
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id', $id)->first();
    return view('actualizar_reservacion',[
        'reservacion' => $tbl_reservaciones
    ]);
});



Route::get('/actualizacion', function(Request $request) { // CONFIRMACION DEL CORREO ELECTRONICO
    if($request['estado'] == 'pendiente' || $request['estado'] == 'rechazada'){
        $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id', $request['id'])->first();
        if($tbl_reservaciones['estado'] == 'espera'){
            $tbl_reservaciones->estado = $request['estado'];
            $tbl_reservaciones->save();
            return view('actualizar_reservacion', [
                'id' => $request['id'],
                'estado' => $request['estado'],
                'reservacion' => $tbl_reservaciones,
                'respuesta' => true,
            ]);
        }
        return view('actualizar_reservacion', [
            'respuesta' => false,
            'origen' => 'reservacion ya actualizada',
        ]);
    }else{
        return view('actualizar_reservacion', [
            'respuesta' => false,
            'origen' => 'actualizacion denegada',
        ]);
    }
});
//-----------------------------------------------------





Route::get('/Stripo_confirmacion', function () {
    return view('/stripo_confirmacion');
});



/*
Route::get('/Qr', function () {
    return view('/Qr');
});
*/

// web.php
//use Illuminate\Support\Facades\Route;

//use Illuminate\Support\Facades\Response;
//use QRCode\QRCodeStyling;





/*
Route::get('/email_view/{Reservacion}', function ($Reservacion) {
    $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $Reservacion)->get();

    return view('/email_view',[
        'Reservaciones' => $tbl_reservacion,
    ]);
    //return response() -> json($tbl_reservacion);
});
*/


//================================================
//================================================

/*
    ||====================================================
    || EMAIL MANAGER - MANEJADORES DE CORREOS ELECTRONICOS
    ||====================================================
*/

Route::post('/enviar-correo', function (Request $request) { // RESERVACIONES
    try {
        $id = $request->input('Reservacion');
        $QR= $request->input('QR');
        $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $id)->first();
        //--------------
        //$tbl_parques = \App\Models\tbl_parques::where('id', $tbl_reservacion['id_parque'])->first();
        //--------------
        $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservacion['id_solicitante'])->first();
        $tbl_terminos_condiciones = \App\Models\tbl_terminos_condiciones_generales::where('id_parque', $tbl_reservacion['id_parque'])->first();
        $packed = [
            //
            "id" => $tbl_reservacion["id"],
            "codigo_reservacion" => $tbl_reservacion["codigo_reservacion"],
            "documento" => $tbl_solicitantes["documento"],
            "nombres" => $tbl_solicitantes["nombres"],
            "apellidos" => $tbl_solicitantes["apellidos"],
            //--------------------------
            //"nombre_parque" => $tbl_parques["nombre_parque"],
            //--------------------------
            "fecha_evento" => $tbl_reservacion["fecha_evento"],
            "hora_inicio" => $tbl_reservacion["hora_inicio"],
            "hora_fin" => $tbl_reservacion["hora_fin"],
            'QR' => $QR,
            "estado" => $tbl_reservacion["estado"],
            'condiciones'=>$tbl_terminos_condiciones,
        ];
        $correo = new ReservacionMaker($packed);
        $Destinatario = $tbl_solicitantes['correo'];
        Mail::to($Destinatario)->send($correo);
        $respuestas[] = [
            'respuestas' => 'Correo electronico enviado correctamente',
            'Reservacion' => $tbl_reservacion,
            'destinatario' => $Destinatario,
            'condiciones'=>$tbl_terminos_condiciones,
            'QR' => $QR,
        ];
        return response() ->json($respuestas);
        //return ["Correo electrónico enviado",$Destinatario];
    } catch (\Exception $e) {
        return "Error al enviar el correo electrónico: " . $e;
    }
});



Route::post('/enviar-correo_confirmacion', function (Request $request) { // EN PROCESO DE EVALUACION
    try {
        $id = $request['id'];
        //$QR= $request['qr'];
        $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $id)->first();
        $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservacion['id_solicitante'])->first();
        $packed = [
            //
            "id" => $tbl_reservacion["id"],
            "codigo_reservacion" => $tbl_reservacion["codigo_reservacion"],
            "documento" => $tbl_solicitantes["documento"],
            "estado" => $tbl_reservacion["estado"],
            "nombres" => $tbl_solicitantes["nombres"],
            "apellidos" => $tbl_solicitantes["apellidos"],
            "fecha_evento" => $tbl_reservacion["fecha_evento"],
            "hora_inicio" => $tbl_reservacion["hora_inicio"],
            "hora_fin" => $tbl_reservacion["hora_fin"],
        ];
        $correo = new ReservacionMaker_qr($packed);
        $Destinatario = $tbl_solicitantes['correo'];
        Mail::to($Destinatario)->send($correo);
        $respuestas[] = [
            'respuestas' => 'Correo electronico enviado correctamente',
            'Reservacion' => $tbl_reservacion,
            'destinatario' => $Destinatario,
            //'QR' => $QR,
        ];
        return response() ->json($respuestas);
    } catch (\Exception $e) {
        return "Error al enviar el correo electrónico: " . $e;
    }
});



/*
    ||====================================================
    || EMAIL MANAGER - MANEJADORES DE CORREOS ELECTRONICOS - END
    ||====================================================
*/





Route::get('/Res/{Reservacion}', function ($Reservacion) { //DEBE ELIMINARSE
    $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $Reservacion)->first();
    $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservacion['id_solicitante'])->first();

    $packed = [
        //
        "codigo_reservacion" => $tbl_reservacion["codigo_reservacion"],
        "documento" => $tbl_solicitantes["documento"],

        "estado" => $tbl_reservacion["estado"],

        "nombres" => $tbl_solicitantes["nombres"],
        "apellidos" => $tbl_solicitantes["apellidos"],

        "fecha_evento" => $tbl_reservacion["fecha_evento"],
        "hora_inicio" => $tbl_reservacion["hora_inicio"],
        "hora_fin" => $tbl_reservacion["hora_fin"],
    ];
    return response() -> json($packed);
});



/*
    |--------------------------------------------------------------------------
    | ACCIONES
    |--------------------------------------------------------------------------
*/


Route::get('/Office', function () {
    $tbl_reservaciones = \App\Models\tbl_reservaciones::orderBy('id', 'asc')->get();

    return view('Home', [
        'tbl_reservaciones' => $tbl_reservaciones
    ]);
});




/*
    |--------------------------------------------------------------------------
    | RESERVACIONES
    |--------------------------------------------------------------------------
*/




//=================================
//GET - Reservas
//=================================

/*
Route::get('/Tempo', function () {
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::orderBy('id', 'asc')->get();
    $formateo = $tbl_horarios_parques->map(function ($horario) {
        $horaApertura = \Carbon\Carbon::parse($horario['hora_apertura']);
        $horario['hora_apertura'] = $horaApertura->format('h:i A');
        //---------------------
        $horaCierre = \Carbon\Carbon::parse($horario['hora_cierre']);
        $horario['hora_cierre'] = $horaCierre->format('h:i A');
        return $horario;
    });
    return $formateo;
});
*/

//$fixed = Carbon::parse($tbl_horarios_parques['hora_apertura']);
//$fixed = $fixed->format('Y-m-d h:i:s A');

Route::get('/reservaciones', function () { // PARTE USUARIO - GET PRINCIPAL
    $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')->get();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('estado', 'activo')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('estado', 'activo')->get();
    $tbl_telefonos_por_parque = \App\Models\tbl_telefonos_por_parque::orderBy('id', 'asc')->get();
    $tbl_imagenes_por_parque = \App\Models\tbl_imagenes_por_parque::orderBy('id', 'asc')->get();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::orderBy('id', 'asc')->get();
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::orderBy('id', 'asc')->get();
    //-------------------
    $formateo = $tbl_horarios_parques->map(function ($horario) {
        $horaApertura = \Carbon\Carbon::parse($horario['hora_apertura']);
        $horario['hora_apertura'] = $horaApertura->format('h:i A');
        //---------------------
        $horaCierre = \Carbon\Carbon::parse($horario['hora_cierre']);
        $horario['hora_cierre'] = $horaCierre->format('h:i A');
        return $horario;
    });
    //-------------------
    return view('Reservaciones', [
        'tbl_parques' => $tbl_parques,
        'tbl_parques_2' => $tbl_parques,
        'tbl_tipo_documento' => $tbl_tipo_documento,
        'tbl_tipos_eventos' => $tbl_tipos_eventos,
        'tbl_telefonos_por_parque' => $tbl_telefonos_por_parque,
        'tbl_imagenes_por_parque' => $tbl_imagenes_por_parque,
        'tbl_imagenes_por_zona' => $tbl_imagenes_por_zona,
        //'tbl_horarios_parques' => $tbl_horarios_parques,
        'tbl_horarios_parques' => $formateo,
    ]);
});

Route::get('/reservaciones_eventos/{id}',function($id){
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('id_parque', $id)->get();
    return response()->json($tbl_tipos_eventos);
});

/*
    @foreach ($tbl_tipo_documento as $tbl_tipo_documento)
        <option value="{{ $tbl_tipo_documento->id }}"> {{ $tbl_tipo_documento->tipo_documento }}</option>
    @endforeach

    {{ $tbl_tipo_documento->tipo_documento }}

*/

//------------------------------------------------------------

Route::get('/Reservaciones_doc', function () { //PRUBAS? NECESITO VERIFICAR
    $Pruebas = \App\Models\tbl_reservaciones::orderBy('id', 'asc')->get();
    return response()->json($Pruebas);
});


Route::get('/Reservaciones_parque_espera/{id}',function($id){
    $tbl_parques = \App\Models\tbl_parques::where('id', $id)->first();
    return response()->json($tbl_parques['espera']);
});

/*
Route::post('/Reservaciones_cuenta', function (Request $request) {
    try{
        $usuario = \App\Models\tbl_usuario::where('usuario', $request->input('usuario'))->first();
        //return ($request);
        if($usuario['password'] == $request['password']){
            //Session::flush();
            //Session::put('usuario', $usuario);
            token_maker($request);
            return response()->json(true);
        }else{
            return response()->json(false);
        }
    }
    catch (\Exception $e){
        //return "No se ha encontrado al usuario: " . $e;
        return "No se ha encontrado al usuario";
        //return response()->json(false);
    }
});
*/


Route::post('/Reservaciones_cuenta', function (Request $request) { // 
echo('...SS');
    try{
        $usuario = \App\Models\tbl_usuario::where('usuario', $request->input('usuario'))->first();
        if ($usuario['estado'] == 'activo') {
            return response()->json(['usuario'=>$usuario['usuario'], 'password'=>$usuario['password'], 'estado'=>$usuario['estado']]);
        }else{
            return response()->json(['estado'=>$usuario['estado']]);
        }
    }
    catch (\Exception $e){
        return "No se ha encontrado al usuario";
    }
});

Route::post('/reservaciones_sesion',function(Request $request){ // 
    $usuario = \App\Models\tbl_usuario::where('usuario', $request->input('usuario'))->first();
    token_maker($request);
    return response()->json(true);
});



Route::get('/Reservaciones_doc_where/{fecha}/{id_solicitante}', function ($fecha, $id_solicitante) {
    $Pruebas = \App\Models\tbl_reservaciones::where('fecha_evento', $fecha)
    ->where('id_solicitante', $id_solicitante)
    ->get();
    if ($Pruebas->isEmpty()) {
        return response()->json(404);
    }
    else{
        return response()->json($Pruebas);
    }
});


Route::get('/Reservaciones_email/{email}', function ($email) {
    $Pruebas = \App\Models\tbl_solicitantes::where('correo', $email)->get();
    
    if ($Pruebas->isEmpty()) {
        return response()->json(404);
    }else{
        return response()->json($Pruebas);
    }
    //return response()->json($Pruebas);
});

Route::get('/Reservaciones_dia/{fecha}/{parque}', function ($fecha, $parque) {
    $Pruebas = \App\Models\tbl_reservaciones::where('fecha_evento', $fecha)
    ->where('id_parque', $parque)
    ->get();
    
    if ($Pruebas->isEmpty()) {
        return response()->json(404);
    }
    else{
        return response()->json($Pruebas);
    }
    //return response()->json($Pruebas);
});


//
//----------------------------------------------------
//

Route::get('/Reservaciones_imagenes', function () {
    //$Pruebas = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $Pruebas = \App\Models\tbl_imagenes_por_parque::orderBy('id', 'asc')->get();


    return response()->json($Pruebas);
    /*
    return view('Reservaciones', [
        'tbl_tipo_documento' => $tbl_tipo_documento
    ]);
    */
});




Route::get('/Reservaciones_zonas_img/{id_parque}', function ($id_parque) {
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id_parque', $id_parque)->get();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::orderBy('id', 'asc')->get();
    $tbl_horarios_zonas = \App\Models\tbl_horarios_zonas::orderBy('id', 'asc')->get();
    $imagenes_por_zona = [];
    $fixed = null;
    $fixed_f = null;

    foreach ($tbl_zona_parques as $zona_parque) {
        $horarios_por_zona = [];
        
        foreach ($tbl_imagenes_por_zona as $imagen_por_zona) {
            if ($zona_parque->id == $imagen_por_zona->id_zona) {
                foreach ($tbl_horarios_zonas as $horarios_zonas) {
                    if ($zona_parque->id == $horarios_zonas->id_zona) {
                        //$fixed = Carbon::parse($horarios_zonas['hora_apertura']);
                        //$fixed = $fixed->format('h:i A');
                        ////==============================================
                        //$fixed_f = Carbon::parse($horarios_zonas['hora_cierre']);
                        //$fixed_f = $fixed_f->format('h:i A');
                        $horarios_por_zona[] = [
                            'id_horario' => $horarios_zonas->id,
                            'dia_semana' => $horarios_zonas->dia_semana,
                            'hora_apertura' => $horarios_zonas->hora_apertura,
                            'hora_cierre' => $horarios_zonas->hora_cierre,
                            //'hora_apertura' => $fixed,
                            //'hora_cierre' => $fixed_f,
                        ];
                    }
                }
                $imagenes_por_zona[] = [
                    'id' => $zona_parque->id,
                    'nombre' => $zona_parque->nombre,
                    'direccion' => $zona_parque->direccion,
                    'imagen' => $imagen_por_zona->imagen,
                    'imagen_ruta' => $imagen_por_zona->ruta,
                    'horarios' => $horarios_por_zona,
                ];
            }
        }
    }
    
    return response()->json($imagenes_por_zona);
});




Route::get('/Reservaciones_zonas/{id_parque}', function ($id_parque) {
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id_parque', $id_parque)->get();

    return response()->json($tbl_zona_parques);
});

//use GuzzleHttp\Client;
//use GuzzleHttp\Exception\GuzzleException;
//use GuzzleHttp\RequestOptions;

Route::get('/ADN_Padron/{cedula}', function ($cedula) {
    try {
        $client = new Client();

        $url = 'https://adn.gob.do/api_registro_nacional/backend/buscar_persona';
        $response = $client->get($url, [
            RequestOptions::VERIFY => false, // Deshabilitar la verificación del certificado SSL
            RequestOptions::QUERY => [
                'cedula' => $cedula,
            ],
        ]);

        $responseData = $response->getBody()->getContents();

        return $responseData;
    } catch (GuzzleException $e) {
        // Manejar cualquier error de Guzzle aquí
        return $e->getMessage();
    }
});


/*
Route::get('/Reservaciones_solicitantes/{documento}', function ($documento) { //BUSCA PRECISA DE DOCUMENTOS
    $Documento = \App\Models\tbl_solicitantes::where('documento', $documento)->get();
    if ($Documento->isEmpty()) {
        return response()->json(['error' => 'No se encontraron coincidencias.'], 404);
    }
    return response()->json($Documento);
});
*/

Route::get('/Reservaciones_solicitantes/{id_tipo_doc}/{documento}', function ($id_tipo_doc, $documento) {
    $Documento = \App\Models\tbl_solicitantes::where('id_tipo_doc', $id_tipo_doc )
        ->where('documento', $documento)
        ->get();
    if ($Documento->isEmpty()) {
        return response()->json(['error' => 'No se encontraron coincidencias.'], 404);
    }
        //40223317336 - RAUL
        //40231270998 - ???
        //40231270998 - KIKOS
    return response()->json($Documento);
});


//BUSQUEDA IMAGENES POR ZONA
Route::get('/Reservaciones_imagenes_zonas/{id_zona}', function ($id_zona) {
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::where('id_zona', $id_zona)->get();

    return response()->json($tbl_imagenes_por_zona);
});


//BUSQUEDA DE ZONAS Y IMAGENES
Route::get('/Reservaciones_imagenes_zonas_2/{id_zona}', function ($id_zona) {
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id_parque', $id_zona)->get();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::where('id_zona', $id_zona)->get();

    
    return response()->json([
        'tbl_zona_parques' => $tbl_zona_parques,
        'tbl_imagenes_por_zona' => $tbl_imagenes_por_zona,
    ]);
    
});

//=============================
// RUTAS EXPERIMENTALES
//=============================

Route::get('/Reservaciones_foranea/{id_parque}', function ($id_parque , $dia) {
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id_parque', $id_parque)->get();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::orderBy('id', 'asc')->get();

    $imagenes_por_zona = [];
    
    foreach ($tbl_zona_parques as $zona_parque) {
        foreach ($tbl_imagenes_por_zona as $imagen_por_zona) {
            if ($zona_parque->id == $imagen_por_zona->id_zona) {
                //
                //$imagenes_por_zona[] = [
                //    $zona_parque->id,
                //    $imagen_por_zona->id,
                //    $imagen_por_zona->ruta
                //];
                //
                $imagenes_por_zona[] = [
                    'zona_id' => $zona_parque->id,
                    'zona_nombre' => $zona_parque->nombre,
                    'imagenes_id' => $imagen_por_zona->id,
                    'imagen_ruta' => $imagen_por_zona->ruta,
                    'imagen' => $imagen_por_zona->imagen
                ];
                
            }
        }
    }
    return response()->json([
        //'tbl_zona_parques' => $tbl_zona_parques,
        'imagenes_por_zona' => $imagenes_por_zona,
        //'tbl_imagenes_por_zona' => $tbl_imagenes_por_zona,
    ]);
});





Route::get('/Reservaciones_horarios/{dia}', function ($dia) { //PRUEBAS
    $tbl_horarios_zonas = \App\Models\tbl_horarios_zonas::where('dia_semana', $dia)->get();

    return response()->json($tbl_horarios_zonas);
});



//=============================
// RUTAS EXPERIMENTALES END
//=============================


Route::get('/Reservaciones_parque_horarios/{id_parque}', function ($id_parque) {
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::where('id_parque', $id_parque)->get();

    return response()->json($tbl_horarios_parques);
});





//=================================
//POST - Reservas
//=================================


Route::post('/Reservaciones_2_post', function (Request $request) { //POST DE PRUEBA FUNCIONAL

    $postData = new \App\Models\tbl_reservaciones;
    $postData->id_solicitante = $request->input('id_solicitante');
    $postData->id_parque = $request->input('id_parque');
    $postData->id_zona = $request->input('id_zona');
    $postData->id_evento = $request->input('id_evento');
    $postData->fecha_evento = $request->input('fecha_evento');
    $postData->hora_inicio = $request->input('hora_inicio');
    $postData->hora_fin = $request->input('hora_fin');
    $postData->motivo_evento = $request->input('motivo_evento');
    $postData->descripcion_evento = $request->input('descripcion_evento');
    $postData->responsables = $request->input('responsables');
    $postData->cantidad_participantes_adultos = $request->input('cantidad_adultos');
    $postData->cantidad_participantes_ninos = $request->input('cantidad_ninos');
    $postData->codigo_reservacion = $request->input('codigo_reservacion');
    $postData->estado = 'espera';
    $postData->save();
    // Aquí se puede procesar o guardar la información del formulario recibido en $postData.
    //return redirect('/Reservaciones')->with('success', 'La solicitud se ha guardado correctamente.');
    //return response()->json(['success' => true]);
    return response()->json($postData);

});


/*
Route::post('/Reservaciones_user', function (Request $request) { //POST PARA LOS USUARIOS

    $postData = new \App\Models\tbl_solicitantes;
    $postData->nombres = $request->input('nombres');
    $postData->apellidos = $request->input('apellidos');
    $postData->id_tipo_doc = $request->input('id_tipo_doc');
    $postData->documento = $request->input('documento');
    $postData->celular = $request->input('celular');
    $postData->correo = $request->input('correo');

    $postData->save();
    // Aquí se puede procesar o guardar la información del formulario recibido en $postData.
    //return redirect('/Reservaciones')->with('success', 'La solicitud se ha guardado correctamente.');
    return response()->json($postData);
});
*/

Route::post('/Reservaciones_user', function (Request $request) {
    $postData = new \App\Models\tbl_solicitantes;
    $postData->nombres = $request->input('data.nombres');
    $postData->apellidos = $request->input('data.apellidos');
    $postData->id_tipo_doc = $request->input('data.id_tipo_doc');
    $postData->documento = $request->input('data.documento');
    $postData->celular = $request->input('data.celular');
    $postData->correo = $request->input('data.correo');

    $postData->save();

    return response()->json($postData);
});


//Route::post('/Reservaciones', 'ReservationController@store')->name('reservations.store');
/*
Route::post('/Reservaciones_post', function (Request $request) {

    $postData = new \App\Models\tbl_reservaciones;
    $postData->id_solicitante = $request->input('id_solicitante');
    $postData->id_parque = $request->input('id_parque');
    $postData->id_zona = $request->input('id_zona');
    $postData->id_evento = $request->input('evento');
    $postData->fecha_evento = $request->input('fecha_evento');
    $postData->hora_inicio = $request->input('hora_inicio');
    $postData->hora_fin = $request->input('hora_fin');
    $postData->descripcion_evento = $request->input('descripcion_evento');
    $postData->responsables = $request->input('responsables');
    $postData->cantidad_participantes_adultos = $request->input('cantidad_participantes_adultos');
    $postData->cantidad_participantes_niños = $request->input('cantidad_participantes_niños');
    $postData->codigo_reservacion = $request->input('codigo_reservacion');
    $postData->estado = $request->input('estado');

    // asignar los valores de los otros campos del formulario aquí
    $postData->save();
    // Aquí se puede procesar o guardar la información del formulario recibido en $postData.
    return redirect('/Reservaciones')->with('success', 'La solicitud se ha guardado correctamente.');
    //return response()->json(['success' => true]);

});
*/





/*
    |--------------------------------------------------------------------------
    | DATATABLE PRUEBAS
    |--------------------------------------------------------------------------
*/




/*
Route::get('/OfficeT', function () {
    $tbl_reservaciones = \App\Models\tbl_reservaciones::orderBy('created_at', 'asc')->get();

    return view('Home(table)', [
        'tbl_reservaciones' => $tbl_reservaciones
    ]);
});
*/




Route::get('/Office_js', function () {
    $tbl_reservaciones = \App\Models\tbl_reservaciones::orderBy('created_at', 'asc')->get();

    return response()->json($tbl_reservaciones);
});



Route::get('/Office_Get_id/{id}', function ($id) { //BUSQUEDA PRECISA
    $tbl_reservacion = \App\Models\tbl_reservaciones::find($id);

    return response()->json($tbl_reservacion);
});

/*
Route::patch('/Office_patch/{id}', function ($id) {//REALIZACION DEL PATCH
    $tbl_reservacion = \App\Models\tbl_reservaciones::find($id);
    
    // Actualizar los datos de la reserva
    $tbl_reservacion->estado = request()->input('estado');
    $tbl_reservacion->save();

    return response()->json(['message' => 'Actualizado']);
});
*/

//return response('/Reservaciones')->with('success', 'La solicitud se ha guardado correctamente.');

Route::patch('/Office_patch/{id}', function ($id) {
    $tbl_reservacion = \App\Models\tbl_reservaciones::find($id);
    
    // Actualizar el estado de la reserva
    $tbl_reservacion->estado = request()->input('estado');
    $tbl_reservacion->save();

    if ($tbl_reservacion) {
        // Si la reserva se actualizó exitosamente, retornar un mensaje de éxito
        return response()->json(['message' => 'Actualizado']);
    } else {
        // Si la reserva no se pudo actualizar, retornar un mensaje de error
        return response()->json(['message' => 'Error al actualizar la reserva'], 500);
    }
});


/*
Route::post('OfficeT/reservations/{id}', function ($id) {

    $tbl_reservaciones = new tbl_reservaciones;
    $tbl_reservaciones->name = $request->name;
    $tbl_reservaciones->save();

    return view('Home(table)');
});

*/


Route::get('/Post', function () {
    return view('Post');
});


Route::post('/Post', function (Request $request) {

    $postData = new \App\Models\tbl_reservaciones;
    
    /*
        $postData->id_solicitante = $request->input('id_solicitante');
        $postData->id_parque = $request->input('id_parque');
        $postData->id_zona = $request->input('id_zona');
        $postData->id_evento = $request->input('id_evento');
        $postData->fecha_evento = $request->input('fecha_evento');
        $postData->hora_inicio = $request->input('hora_inicio');
        $postData->hora_fin = $request->input('hora_fin');
        $postData->descripcion_evento = $request->input('descripcion_evento');
        $postData->responsables = $request->input('responsables');
        $postData->cantidad_participantes_adultos = $request->input('cantidad_participantes_adultos');
        $postData->cantidad_participantes_niños = $request->input('cantidad_participantes_niños');
        $postData->codigo_reservacion = $request->input('codigo_reservacion');
    */

    //$postData->id_solicitante = $request->input('id_solicitante');



    // asignar los valores de los otros campos del formulario aquí
    //$postData->save();
    // Aquí se puede procesar o guardar la información del formulario recibido en $postData.
    return redirect('/Post')->with('success', 'La solicitud se ha guardado correctamente.');


});





/*
    |--------------------------------------------------------------------------
    | ENDPOINTS
    |--------------------------------------------------------------------------
*/

Route::get('/esquema', function(){
    return view ("esquema");
});
//--------------------------------------
/*
Route::get('/m_solicitudes', function(){
    return view ("/oficina_fix/m_solicitudes");
});
*/


//==============================================================================
//DASHBOARD
//==============================================================================

Route::get('/inicio', function(){
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'pendiente')->get();
    return view ("Inicio");
})->middleware('token.auth');


/*
Route::get('/Dashboard', function(){
    $sesion = Session::get('usuario');
    $pendientes = \App\Models\tbl_reservaciones::where('estado', 'pendiente')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    $confirmada = \App\Models\tbl_reservaciones::where('estado', 'confirmada')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    $rechazada = \App\Models\tbl_reservaciones::where('estado', 'rechazada')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    $espera = \App\Models\tbl_reservaciones::where('estado', 'espera')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    $vencida = \App\Models\tbl_reservaciones::where('estado', 'vencida')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    $realizada = \App\Models\tbl_reservaciones::where('estado', 'realizada')
    ->where('id_parque', $sesion['id_parque'])
    ->count();
    return response () -> json([
        'espera' => $espera,
        'pendientes' => $pendientes,
        'vencida' => $vencida,
        'confirmada' => $confirmada,
        'rechazada' => $rechazada,
        'realizada' => $realizada,
    ]);
});
*/


/*
Route::get('/Dashboard', function () {
    $sesion = Session::get('usuario');
    
    $primerDiaDelMes = Carbon::now()->startOfMonth()->toDateString();
    $ultimoDiaDelMes = Carbon::now()->endOfMonth()->toDateString();

    $pendientes = \App\Models\tbl_reservaciones::where('estado', 'pendiente')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    $confirmada = \App\Models\tbl_reservaciones::where('estado', 'confirmada')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    $rechazada = \App\Models\tbl_reservaciones::where('estado', 'rechazada')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    $espera = \App\Models\tbl_reservaciones::where('estado', 'espera')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    $vencida = \App\Models\tbl_reservaciones::where('estado', 'vencida')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    $realizada = \App\Models\tbl_reservaciones::where('estado', 'realizada')
    ->where('id_parque', $sesion['id_parque'])
    ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
    ->count();
    return response()->json([
        'espera' => $espera,
        'pendientes' => $pendientes,
        'vencida' => $vencida,
        'confirmada' => $confirmada,
        'rechazada' => $rechazada,
        'realizada' => $realizada,
    ]);
});
*/

Route::get('/Dashboard', function () {
    $sesion = Session::get('usuario');
    $primerDiaDelMes = Carbon::now()->startOfMonth()->toDateString();
    $ultimoDiaDelMes = Carbon::now()->endOfMonth()->toDateString();
    if ($sesion["permisos"] == 'administrador') {
        //Todos
        $pendientes = \App\Models\tbl_reservaciones::where('estado', 'pendiente')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $confirmada = \App\Models\tbl_reservaciones::where('estado', 'confirmada')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $rechazada = \App\Models\tbl_reservaciones::where('estado', 'rechazada')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $espera = \App\Models\tbl_reservaciones::where('estado', 'espera')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $vencida = \App\Models\tbl_reservaciones::where('estado', 'vencida')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $realizada = \App\Models\tbl_reservaciones::where('estado', 'realizada')
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        return response()->json([
            'espera' => $espera,
            'pendientes' => $pendientes,
            'vencida' => $vencida,
            'confirmada' => $confirmada,
            'rechazada' => $rechazada,
            'realizada' => $realizada,
        ]);
    }else{
        //Filtrar
        $pendientes = \App\Models\tbl_reservaciones::where('estado', 'pendiente')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $confirmada = \App\Models\tbl_reservaciones::where('estado', 'confirmada')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $rechazada = \App\Models\tbl_reservaciones::where('estado', 'rechazada')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $espera = \App\Models\tbl_reservaciones::where('estado', 'espera')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $vencida = \App\Models\tbl_reservaciones::where('estado', 'vencida')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        $realizada = \App\Models\tbl_reservaciones::where('estado', 'realizada')
        ->where('id_parque', $sesion['id_parque'])
        ->whereBetween('agregado_en', [$primerDiaDelMes, $ultimoDiaDelMes])
        ->count();
        return response()->json([
            'espera' => $espera,
            'pendientes' => $pendientes,
            'vencida' => $vencida,
            'confirmada' => $confirmada,
            'rechazada' => $rechazada,
            'realizada' => $realizada,
        ]);
    }
});




//==============================================================================
//SOLICITUDES
//==============================================================================

Route::get('/R_solicitudes', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    //------------------------------
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'pendiente')->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    //------------------------------
    $packed = [];
    $fixed = null;
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $fixed = Carbon::parse($reservaciones['agregado_en']);
                                $fixed = $fixed->format('Y-m-d h:i:s A');
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'fecha_evento' => $reservaciones['fecha_evento'],
                                    //'agregado_en' => $reservaciones['agregado_en'],
                                    'agregado_en' => $fixed,
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    //-----------------------------------------
    return view('/oficina_fix/R_solicitudes', [
        'tbl_reservaciones' => $packed,
    ]);
})->middleware('token.auth');



Route::get('/R_solicitudes_all', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    //------------------------------
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'pendiente')->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    //--------------------------
    $packed = [];
    $fixed = null;
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $fixed = Carbon::parse($reservaciones['agregado_en']);
                                $fixed = $fixed->format('Y-m-d h:i:s A');
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'fecha_evento' => $reservaciones['fecha_evento'],
                                    'agregado_en' => $fixed,
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    //-----------------------------------------
    return response()->json($packed);
});


//-------------------------------

Route::get('/R_solicitudes_dia/{id}', function($id){
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id', $id)->first();
    $reservaciones_dia = \App\Models\tbl_reservaciones::where('fecha_evento', $tbl_reservaciones['fecha_evento'])
    ->where('estado','pendiente')
    ->get();
    $packed = [];
    foreach ($reservaciones_dia as $reservaciones) {
        if ($tbl_reservaciones['id'] != $reservaciones['id']) {
            $packed[] = [
                'id'=>$reservaciones['id'],
                'codigo'=> $reservaciones['codigo_reservacion'],
                'fecha_evento'=>$reservaciones['fecha_evento'],
                'hora_inicio'=>$reservaciones['hora_inicio'],
                'hora_fin'=>$reservaciones['hora_fin'],
            ];
        }
    }
    //return response()->json([$tbl_reservaciones, $packed, $reservaciones_dia]);
    return response()->json([$tbl_reservaciones, $packed]);
});
//-------------------------------

Route::patch('/R_solicitudes_rechazadas', function(Request $request) {
    $registros = [];
    $respuesta = null;
    foreach ($request->all() as $packed) {
        $tbl_reservacion = \App\Models\tbl_reservaciones::find($packed['id']);
        if ($tbl_reservacion) {
            $tbl_reservacion->estado = 'rechazada';
            $tbl_reservacion->save();
            $respuesta = notificacion_email($tbl_reservacion->id);
            $registros[] = [
                'id' => $tbl_reservacion->id,
                'estado' => $tbl_reservacion->estado,
                'email' => $respuesta,
            ];
            
        }
    }
    return response()->json($registros);
});






Route::get('/Reservaciones_preciso/{id}', function($id){
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id', $id)->first();
    $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservaciones['id_solicitante'])->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_reservaciones['id_parque'])->first();
    $tbl_imagenes_por_parque = \App\Models\tbl_imagenes_por_parque::where('id', $tbl_parques['id'])->first();
    //----------
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id', $tbl_reservaciones['id_zona'] )->first();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::where('id_zona', $tbl_zona_parques['id'])->first();
    //----------    
    
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('id', $tbl_reservaciones['id_evento'])->first();
    $packed = [];
    $fixed = null;
    $fixed = Carbon::parse($tbl_reservaciones['agregado_en']);
    $fixed = $fixed->format('Y-m-d h:i:s A');
    $packed[] = [
        'id' => $tbl_reservaciones['id'],
        'codigo_reservacion' => $tbl_reservaciones['codigo_reservacion'],
        'nombre_parque' => $tbl_parques['nombre_parque'],
        'nombre_zona' => $tbl_zona_parques['nombre'],
        'nombre_evento' => $tbl_tipos_eventos['tipo'],
        //---------------------------------------------
        //'agregado_en' => $tbl_reservaciones['agregado_en'],
        'agregado_en' => $fixed,
        'fecha_evento' => $tbl_reservaciones['fecha_evento'],
        'hora_inicio' => $tbl_reservaciones['hora_inicio'],
        'hora_fin' => $tbl_reservaciones['hora_fin'],
        'motivo_evento' => $tbl_reservaciones['motivo_evento'],
        'descripcion_evento' => $tbl_reservaciones['descripcion_evento'],
        'direccion_parque' => $tbl_parques['direccion'],
        'direccion_zona' => $tbl_zona_parques['direccion'],
        //-----------------------------------
        'responsables' => $tbl_reservaciones['responsables'],
        'cantidad_participantes_adultos' => $tbl_reservaciones['cantidad_participantes_adultos'],
        'cantidad_participantes_ninos' => $tbl_reservaciones['cantidad_participantes_ninos'],
        //---------------------------------------------
        'parque_img' => $tbl_imagenes_por_parque['imagen'],
        'zona_img' => $tbl_imagenes_por_zona['imagen'],
        //---------------------------------------------
        'usuario_info' => $tbl_solicitantes,
    ];
    return response()->json($packed);
    
});






Route::patch('/Reservacion_parques_solicitudes', function(Request $request){
    $id = $request['id'];
    $accion = $request['accion'];
    $responsable = $request['responsable'];
    $tbl_reservacion = \App\Models\tbl_reservaciones::find($id);
    $tbl_reservacion->modificado_por = $responsable;
    $tbl_reservacion->estado = $accion;
    $tbl_reservacion->save();
    if ($tbl_reservacion) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error al actualizar la reserva'], 500);
    }
}); // FUNCIONAL PARA CAMBIAR ESTADOS





//==============================================================================
//RESERVACIONES
//==============================================================================

/*
Route::get('/R_reservaciones', function(){
    $sesion = Session::get('usuario');
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'confirmada')->get();
    //$tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
    ->where('id', $sesion['id_parque'])
    ->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    $packed = [];
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    return view('/oficina_fix/R_reservaciones', [
        'tbl_reservaciones' => $packed,
    ]);
})->middleware('token.auth');// FUNCIONAL
*/

/*
Route::get('/R_reservaciones', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'confirmada')->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    $packed = [];
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'agregado_en' => $reservaciones['agregado_en'],
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    return view('/oficina_fix/R_reservaciones', [
        'tbl_reservaciones' => $packed,
    ]);
})->middleware('token.auth');// FUNCIONAL
*/


Route::get('/R_reservaciones', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'confirmada')->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    //--------------------------    
    $packed = [];
    $fixed = null;
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $fixed = Carbon::parse($reservaciones['agregado_en']);
                                $fixed = $fixed->format('Y-m-d h:i:s A');
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'fecha_evento' => $reservaciones['fecha_evento'],
                                    'agregado_en' => $fixed,
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    return view('/oficina_fix/R_reservaciones', [
        'tbl_reservaciones' => $packed,
    ]);
})->middleware('token.auth');// FUNCIONAL




//==============================================================================
//ESPERA
//==============================================================================

Route::get('/R_espera', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }

    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('estado', 'espera')->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::orderBy('id', 'asc')->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    //--------------------------
    $packed = [];
    $fixed = null;
    foreach ($tbl_reservaciones as $reservaciones){
        foreach($tbl_parques as $parques){
            //--------------------------
            if ($reservaciones['id_parque'] == $parques['id']){
                //------------------------------
                foreach($tbl_zona_parques as $zona_parques){
                    if ($reservaciones['id_zona'] == $zona_parques['id']){
                        foreach($tbl_tipos_eventos as $tipos_eventos){
                            if ($reservaciones['id_evento'] == $tipos_eventos['id']){
                                $fixed = Carbon::parse($reservaciones['agregado_en']);
                                $fixed = $fixed->format('Y-m-d h:i:s A');
                                $packed[] = [
                                    'id' => $reservaciones['id'],
                                    'codigo_reservacion' => $reservaciones['codigo_reservacion'],
                                    'nombre_parque' => $parques['nombre_parque'],
                                    'nombre_zona' => $zona_parques['nombre'],
                                    'nombre_evento' => $tipos_eventos['tipo'],
                                    'fecha_evento' => $reservaciones['fecha_evento'],
                                    'agregado_en' => $fixed,
                                    'estado' => $reservaciones['estado'],
                                ];
                            }
                        }
                    }
                }
            }
        }
    }
    return view('/oficina_fix/R_espera', [
        'tbl_reservaciones' => $packed,
    ]);
})->middleware('token.auth'); // FUNCIONAL


//==============================================================================
//MANTENIMIENTOS - PARQUES
//==============================================================================

// $sesion = Session::get('usuario');

// $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
// ->where('id', $sesion['id_parque'])
// ->get();

Route::get('/mantenimientos_parques', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    return view('/oficina_fix/mantenimiento_parques', [
        'tbl_parques' => $tbl_parques,
    ]);
})->middleware('token.auth');

Route::get('/mantenimientos_parques_all', function(){
    $sesion = Session::get('usuario');
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    return response()->json($tbl_parques);
});

Route::get('/mantenimientos_parques_zonas/{id}',function($id){
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id_parque', $id)->get();
    $estado = null;
    if ($tbl_zona_parques->isEmpty()) {
        $estado = false; //VACIO - NO ACEPTAR CAMBIOS DE ESTADO
    }else{
        $estado = true; //TIENE ZONAS - PERMITIR MANIPULACION
    }
    return response()->json([
        'zonas' =>$tbl_zona_parques, 
        'estado' => $estado,
    ]);
});

Route::get('/Search_parque/{id}', function($id){
    $tbl_parques = \App\Models\tbl_parques::where('id', $id)->first();
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::where('id_parque', $id)->get();
    $tbl_imagenes_por_parque = \App\Models\tbl_imagenes_por_parque::where('id_parque', $id)->first();
    $tbl_telefonos_por_parque = \App\Models\tbl_telefonos_por_parque::where('id_parque', $id)->first();
    $tbl_terminos_condiciones = \App\Models\tbl_terminos_condiciones_generales::where('id_parque', $id)->first();
    $telefono = null;
    if ($tbl_telefonos_por_parque) {
        $telefono = $tbl_telefonos_por_parque['telefono'];
    }else{
        $telefono = '---';
    }
    $packed = [
        'id' => $tbl_parques['id'],
        'nombre_parque' => $tbl_parques['nombre_parque'],
        'provincia' => $tbl_parques['provincia'],
        'municipio' => $tbl_parques['municipio'],
        'sector' => $tbl_parques['sector'],
        'circunscripcion' => $tbl_parques['circunscripcion'],
        'direccion' => $tbl_parques['direccion'],
        'coordenadas_maps' => $tbl_parques['coordenadas_maps'],
        'descripcion' => $tbl_parques['descripcion'],
        'imagen' => $tbl_imagenes_por_parque['imagen'],
        //-----------------------------------------------------------------
        'correo' => $tbl_parques['correo'],
        'espera' => $tbl_parques['espera'],
        'estado' => $tbl_parques['estado'],
        //-----------------------------------------------------------------
        'horarios' => $tbl_horarios_parques,
        //-----------------------------------------------------------------
        'telefono' => $telefono,
        //----------------
        'condiciones' => $tbl_terminos_condiciones,
        //'telefono' => $tbl_telefonos_por_parque['telefono'],
    ];
    //return view ("/oficina_fix/mantenimiento_parques");
    return response() -> json($packed);
});

//------------------------------------------------------------------
//MANTENIMIENTOS - PARQUES - ACCIONES
//------------------------------------------------------------------

Route::patch('/mantenimientos_parques_actualizar/{id}', function($id, Request $request){ //GET
    $tbl_parques = \App\Models\tbl_parques::find($id);
    //--------------------------------------------------------
    try {
        $tbl_parques->nombre_parque = $request['nombre_parque'];
        $tbl_parques->correo = $request['correo'];
        $tbl_parques->espera = $request['espera'];
        $tbl_parques->provincia = $request['provincia'];
        $tbl_parques->municipio = $request['municipio'];
        $tbl_parques->sector = $request['sector'];
        $tbl_parques->circunscripcion = $request['circunscripcion'];
        $tbl_parques->direccion = $request['direccion'];
        $tbl_parques->coordenadas_maps = $request['coordenadas_maps'];
        $tbl_parques->descripcion = $request['descripcion'];
        $tbl_parques->modificado_por = $request['modificado_por'];
        $tbl_parques->estado = $request['estado'];
        $tbl_parques->save();
        //-------------------------------------------------------
        $tbl_telefonos_por_parque = \App\Models\tbl_telefonos_por_parque::where('id_parque',$id)->first();
        if ($tbl_telefonos_por_parque) {
            $tbl_telefonos_por_parque['telefono'] = $request['telefono'];
            $tbl_telefonos_por_parque['agregado_por'] = $request['modificado_por'];
        }else{
            $tbl_telefonos_por_parque = new \App\Models\tbl_telefonos_por_parque;
            $tbl_telefonos_por_parque['id_parque'] = $tbl_parques['id'];
            $tbl_telefonos_por_parque['telefono'] = $request['telefono'];
            $tbl_telefonos_por_parque['modificado_por'] = $request['modificado_por'];
        }
        $tbl_telefonos_por_parque->save();
        return response()->json(['message' => 'Actualizado']);
    } catch (\Throwable $th) {
        return response()->json(['message' => 'Error al actualizar la informacion del parque'], 500);
    }

});

Route::patch('/mantenimientos_parques_actualizar_horarios/{id}', function($id, Request $request){ //GET
    $tbl_horarios_parques = \App\Models\tbl_horarios_parques::where('id_parque', $id)->get();
    
    if ($request['lunes']['hora_apertura'] != "default") {
        $tbl_horarios_parques[0]->hora_apertura = $request['lunes']['hora_apertura'];
    }
    if ($request['lunes']['hora_cierre'] != "default") {
        $tbl_horarios_parques[0]->hora_cierre = $request['lunes']['hora_cierre'];
    }
    //=================================================
    if ($request['martes']['hora_apertura'] != "default") {
        $tbl_horarios_parques[1]->hora_apertura = $request['martes']['hora_apertura'];
    }
    if ($request['martes']['hora_cierre'] != "default") {
        $tbl_horarios_parques[1]->hora_cierre = $request['martes']['hora_cierre'];
    }
    //=================================================
    if ($request['miercoles']['hora_apertura'] != "default") {
        $tbl_horarios_parques[2]->hora_apertura = $request['miercoles']['hora_apertura'];
    }
    if ($request['miercoles']['hora_cierre'] != "default") {
        $tbl_horarios_parques[2]->hora_cierre = $request['miercoles']['hora_cierre'];
    }
    //=================================================
    if ($request['jueves']['hora_apertura'] != "default") {
        $tbl_horarios_parques[3]->hora_apertura = $request['jueves']['hora_apertura'];
    }
    if ($request['jueves']['hora_cierre'] != "default") {
        $tbl_horarios_parques[3]->hora_cierre = $request['jueves']['hora_cierre'];
    }
    //=================================================
    if ($request['viernes']['hora_apertura'] != "default") {
        $tbl_horarios_parques[4]->hora_apertura = $request['viernes']['hora_apertura'];
    }
    if ($request['viernes']['hora_cierre'] != "default") {
        $tbl_horarios_parques[4]->hora_cierre = $request['viernes']['hora_cierre'];
    }
    //=================================================
    if ($request['sabado']['hora_apertura'] != "default") {
        $tbl_horarios_parques[5]->hora_apertura = $request['sabado']['hora_apertura'];
    }
    if ($request['sabado']['hora_cierre'] != "default") {
        $tbl_horarios_parques[5]->hora_cierre = $request['sabado']['hora_cierre'];
    }   
    //=================================================
    if ($request['domingo']['hora_apertura'] != "default") {
        $tbl_horarios_parques[6]->hora_apertura = $request['domingo']['hora_apertura'];
    }
    if ($request['domingo']['hora_cierre'] != "default") {
        $tbl_horarios_parques[6]->hora_cierre = $request['domingo']['hora_cierre'];
    }
    //=================================================

    foreach ($tbl_horarios_parques as $horario) {
        $horario->save();
    }
    
    if ($tbl_horarios_parques) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error al actualizar la informacion del parque'], 500);
    }
});



Route::patch('/mantenimientos_parques_actualizar_imagen/{id}', function($id, Request $request){
    $tbl_imagenes_por_parque = \App\Models\tbl_imagenes_por_parque::where("id_parque", $id)->first();
    $tbl_imagenes_por_parque->imagen = $request['imagen'];
    $tbl_imagenes_por_parque->agregado_por = $request['responsable'];
    $tbl_imagenes_por_parque->save();
    if ($tbl_imagenes_por_parque) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error al actualizar la informacion del parque'], 500);
    }
});


Route::delete('/mantenimientos_parques_eliminar/{id}', function($id){ //GET
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id_parque',$id)->get();
    $tbl_parques = \App\Models\tbl_parques::find($id);
    //return response()->json($tbl_reservaciones);
    if ($tbl_reservaciones->isEmpty()) {
        if ($tbl_parques) {
            $tbl_parques->delete();
            return response()->json(['estado' => true, 'response' => $tbl_parques]);
        } else {
            return response()->json(['estado' => 'error','message' => 'Error de peticion'], 500);
        }
    }else{
        return response()->json(['estado'=>false,'response'=>$tbl_reservaciones]);
    }
});

// ||======================================================================

/*
Route::post('/mantenimientos_parque_agregar', function(Request $request){ //GET
    $tbl_parques = new \App\Models\tbl_parques;
    //--------------------------------------------------------------
    $tbl_parques->nombre_parque = $request['nombre'];
    $tbl_parques->descripcion = $request['descripcion'];
    $tbl_parques->correo = $request['correo'];
    $tbl_parques->provincia = $request['provincia'];
    $tbl_parques->municipio = $request['municipio'];
    $tbl_parques->sector = $request['sector'];
    $tbl_parques->circunscripcion = $request['circunscripcion'];
    $tbl_parques->coordenadas_maps = $request['coordenadas_maps'];
    $tbl_parques->direccion = $request['direccion'];
    $tbl_parques->espera = $request['espera'];
    $tbl_parques->agregado_por = $request['responsable'];
    //--------------------------------------------------------------
    try {
        $tbl_parques->save();
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_parques, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
});
*/

Route::post('/mantenimientos_parque_agregar', function(Request $request){ //GET
    $tbl_parques = new \App\Models\tbl_parques;
    $tbl_telefonos_por_parque = new \App\Models\tbl_telefonos_por_parque;
    //--------------------------------------------------------------
    try {
        $tbl_parques->nombre_parque = $request['nombre'];
        $tbl_parques->descripcion = $request['descripcion'];
        $tbl_parques->correo = $request['correo'];
        $tbl_parques->provincia = $request['provincia'];
        $tbl_parques->municipio = $request['municipio'];
        $tbl_parques->sector = $request['sector'];
        $tbl_parques->circunscripcion = $request['circunscripcion'];
        $tbl_parques->coordenadas_maps = $request['coordenadas_maps'];
        $tbl_parques->direccion = $request['direccion'];
        $tbl_parques->espera = $request['espera'];
        $tbl_parques->agregado_por = $request['responsable'];
        $tbl_parques->estado = 'inactivo';
        //--------------------------------------------------------------
        $tbl_parques->save();
        $tbl_telefonos_por_parque['id_parque'] = $tbl_parques['id'];
        $tbl_telefonos_por_parque['telefono'] = $request['telefono'];
        $tbl_telefonos_por_parque['agregado_por'] = $request['responsable'];
        $tbl_telefonos_por_parque->save();
        //--------------------------------------------------------------
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_parques,$tbl_telefonos_por_parque, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
});


Route::post('/mantenimientos_parque_agregar_img', function(Request $request){ //GET
    //return response()-> json($request);
    $tbl_imagenes_por_parque = new \App\Models\tbl_imagenes_por_parque;
    $tbl_imagenes_por_parque['id_parque'] = $request['id_parque'];
    $tbl_imagenes_por_parque['imagen'] = $request['img'];
    $tbl_imagenes_por_parque['agregado_por'] = $request['responsable'];
    //-----------------------------
    try {
        $tbl_imagenes_por_parque->save();
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_imagenes_por_parque, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
});



Route::post('/mantenimientos_parque_agregar_horarios/{id}', function($id, Request $request){ //GET
    $dia = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
    for ($i = 0; $i < 7; $i++) {
        $tbl_horarios_parques = new \App\Models\tbl_horarios_parques;
        $tbl_horarios_parques->id_parque = $id;
        $tbl_horarios_parques->dia_semana = $dia[$i];
        $tbl_horarios_parques->hora_apertura = $request[$dia[$i]]['hora_apertura'];
        $tbl_horarios_parques->hora_cierre = $request[$dia[$i]]['hora_cierre'];
        //------------------------------------------------
        $tbl_horarios_parques->save();
    }
    return response()-> json($tbl_horarios_parques);
});
// ||======================================================================

//------------------------------------------------------------------
//MANTENIMIENTOS - PARQUES - ZONAS - ACCIONES
//------------------------------------------------------------------

Route::get('/Search_zonas/{id}', function($id){ //GET
    $tbl_zona_parques = \App\Models\tbl_zona_parques::where('id', $id)->first();
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::where('id_zona', $id)->get();
    $tbl_horarios_zonas = \App\Models\tbl_horarios_zonas::where('id_zona', $id)->get();
    $packed = [
        'zonas' => $tbl_zona_parques,
        'imagenes' => $tbl_imagenes_por_zona,
        'horarios' => $tbl_horarios_zonas,
    ];
    return response() -> json($packed);
    //
});


Route::patch('/mantenimientos_zona_actualizar/{id}', function($id, Request $request){ //GET
    $tbl_zona_parques = \App\Models\tbl_zona_parques::find($id);
    //--------------------------------------------------------
    $tbl_zona_parques->nombre = $request['nombre'];
    $tbl_zona_parques->direccion = $request['direccion'];
    $tbl_zona_parques->coordenadas_maps = $request['coordenadas_maps'];
    $tbl_zona_parques->estado = $request['estado'];

    $tbl_zona_parques->save();
    if ($tbl_zona_parques) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});

Route::patch('/mantenimientos_zona_actualizar_horarios/{id}', function($id, Request $request){ //GET
    $tbl_horarios_zonas = \App\Models\tbl_horarios_zonas::where('id_zona', $id)->get();
    
    if ($request['lunes']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[0]->hora_apertura = $request['lunes']['hora_apertura'];
    }
    if ($request['lunes']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[0]->hora_cierre = $request['lunes']['hora_cierre'];
    }
    //=================================================
    if ($request['martes']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[1]->hora_apertura = $request['martes']['hora_apertura'];
    }
    if ($request['martes']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[1]->hora_cierre = $request['martes']['hora_cierre'];
    }
    //=================================================
    if ($request['miercoles']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[2]->hora_apertura = $request['miercoles']['hora_apertura'];
    }
    if ($request['miercoles']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[2]->hora_cierre = $request['miercoles']['hora_cierre'];
    }
    //=================================================
    if ($request['jueves']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[3]->hora_apertura = $request['jueves']['hora_apertura'];
    }
    if ($request['jueves']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[3]->hora_cierre = $request['jueves']['hora_cierre'];
    }
    //=================================================
    if ($request['viernes']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[4]->hora_apertura = $request['viernes']['hora_apertura'];
    }
    if ($request['viernes']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[4]->hora_cierre = $request['viernes']['hora_cierre'];
    }
    //=================================================
    if ($request['sabado']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[5]->hora_apertura = $request['sabado']['hora_apertura'];
    }
    if ($request['sabado']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[5]->hora_cierre = $request['sabado']['hora_cierre'];
    }   
    //=================================================
    if ($request['domingo']['hora_apertura'] != "default") {
        $tbl_horarios_zonas[6]->hora_apertura = $request['domingo']['hora_apertura'];
    }
    if ($request['domingo']['hora_cierre'] != "default") {
        $tbl_horarios_zonas[6]->hora_cierre = $request['domingo']['hora_cierre'];
    }
    //=================================================

    foreach ($tbl_horarios_zonas as $horario) {
        $horario->save();
    }
    
    if ($tbl_horarios_zonas) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


Route::patch('/mantenimientos_zona_actualizar_imagen/{id}', function($id, Request $request){
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::where("id_zona", $id)->first();
    $tbl_imagenes_por_zona->imagen = $request['imagen'];
    $tbl_imagenes_por_zona->agregado_por = $request['responsable'];
    $tbl_imagenes_por_zona->save();
    if ($tbl_imagenes_por_zona) {
        return response()->json(['message' => 'Actualizado']);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


Route::get('/mantenimientos_zona_agregar_img', function(Request $request){ //GET
    $tbl_imagenes_por_zona = \App\Models\tbl_imagenes_por_zona::orderBy('id', 'asc')->get();
    return response()->json($tbl_imagenes_por_zona);
});
Route::post('/mantenimientos_zona_agregar', function(Request $request){ //GET
    $tbl_zona_parques = new \App\Models\tbl_zona_parques;
    $tbl_imagenes_por_zona = new \App\Models\tbl_imagenes_por_zona;
    //--------------------------------------------------------------
    $tbl_zona_parques->id_parque = $request['id_parque'];
    $tbl_zona_parques->nombre = $request['nombre'];
    $tbl_zona_parques->direccion = $request['direccion'];
    $tbl_zona_parques->coordenadas_maps = $request['coordenadas_maps'];
    //--------------------------------------------------------------
    try {
        $tbl_zona_parques->save();
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_zona_parques, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
});

Route::post('/mantenimientos_zona_agregar_img', function(Request $request){ //GET
    $tbl_imagenes_por_zona = new \App\Models\tbl_imagenes_por_zona;
    $tbl_imagenes_por_zona->id_zona = $request['id_zona'];
    $tbl_imagenes_por_zona->imagen = $request['img'];
    $tbl_imagenes_por_zona->agregado_por = $request['responsable'];
    //$tbl_imagenes_por_zona->save();
    //-----------------------------
    try {
        $tbl_imagenes_por_zona->save();
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_imagenes_por_zona, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
});

Route::post('/mantenimientos_zona_agregar_horarios/{id}', function($id, Request $request){ //GET
    $dia = ['lunes','martes','miércoles','jueves','viernes','sábado','domingo'];
    for ($i = 0; $i < 7; $i++) {
        $tbl_horarios_zonas = new \App\Models\tbl_horarios_zonas;
        $tbl_horarios_zonas->id_zona = $id;
        $tbl_horarios_zonas->dia_semana = $dia[$i];
        $tbl_horarios_zonas->hora_apertura = $request[$dia[$i]]['hora_apertura'];
        $tbl_horarios_zonas->hora_cierre = $request[$dia[$i]]['hora_cierre'];
        //------------------------------------------------
        $tbl_horarios_zonas->save();
    }
    /*
    try {
        return response()->json(['mensaje' => 'Registro agregado exitosamente', 'response' => $tbl_horarios_zonas, 'status'=>200], 200);
    } catch (\Exception $e) {
        return response()->json(['mensaje' => 'Error al agregar el registro', 'error' => $e->getMessage()], 500);
    }
    */
    return response()-> json($tbl_horarios_zonas);
});


Route::delete('/mantenimientos_zona_eliminar/{id}', function($id){ //GET
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id_zona',$id)->get();
    $tbl_zona_parques = \App\Models\tbl_zona_parques::find($id);
    if ($tbl_reservaciones->isEmpty()) {
        if ($tbl_zona_parques) {
            $tbl_zona_parques->delete();
            return response()->json(['estado' => true, 'response' => $tbl_zona_parques]);
        } else {
            return response()->json(['estado' => 'error','message' => 'Error de peticion'], 500);
        }
    }else{
        return response()->json(['estado'=>false,'response'=>$tbl_reservaciones]);
    }
});

//==============================================================================
//USUARIOS
//==============================================================================


Route::get('/mantenimientos_usuarios', function(){
    $tbl_usuario = \App\Models\tbl_usuario::orderBy('id', 'asc')->get();
    $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')->get();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('estado', 'activo')->get();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();
    $packed = [];
    foreach ($tbl_usuario as $usuarios){
        foreach ($tbl_parques as $parques){
            if ($usuarios['id_parque'] == $parques['id']){
                foreach ($tbl_permisos_usuarios as $permisos){
                    if ($usuarios['id_user_type'] == $permisos['id']){
                        $packed[] = [
                            'id' => $usuarios['id'],
                            'usuario' => $usuarios['usuario'],
                            'nombre' => $usuarios['nombre'],
                            'apellido' => $usuarios['apellido'],
                            'correo' => $usuarios['correo'],
                            'telefono' => $usuarios['telefono'],
                            'parque' => $parques['nombre_parque'],
                            'posicion' => $permisos['posicion'],
                            'rol' => $permisos['permisos'],
                            'estado' => $usuarios['estado'],
                        ];
                    }
                }
            }
        }
    }
    return view('oficina_fix/mantenimiento_usuario', [
        'tbl_usuarios' => $packed,
        'tbl_tipo_documento' => $tbl_tipo_documento,
        'tbl_permisos_usuarios' => $tbl_permisos_usuarios,
        'tbl_parques' => $tbl_parques,
    ]);
})->middleware('token.auth'); // FUNCIONAL


Route::get('/mantenimientos_usuarios_js', function(){ //Recarga manual
    $tbl_usuario = \App\Models\tbl_usuario::orderBy('id', 'asc')->get();
    $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::orderBy('id', 'asc')->get();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();
    $packed = [];
    foreach ($tbl_usuario as $usuarios){
        foreach ($tbl_parques as $parques){
            if ($usuarios['id_parque'] == $parques['id']){
                foreach ($tbl_permisos_usuarios as $permisos){
                    if ($usuarios['id_user_type'] == $permisos['id']){
                        $packed[] = [
                            'id' => $usuarios['id'],
                            'usuario' => $usuarios['usuario'],
                            'nombre' => $usuarios['nombre'],
                            'apellido' => $usuarios['apellido'],
                            'documento' => $usuarios['documento'],
                            'imagen' => $usuarios['imagen'],
                            'correo' => $usuarios['correo'],
                            'telefono' => $usuarios['telefono'],
                            'parque' => $parques['nombre_parque'],
                            'posicion' => $permisos['posicion'],
                            'permisos' => $permisos['permisos'],
                            'estado' => $usuarios['estado'],
                        ];
                    }
                }
            }
        }
    }
    return response()->json($packed);
}); // FUNCIONAL




Route::get('/mantenimientos_usuarios_preciso/{id}', function($id){
    $tbl_usuario = \App\Models\tbl_usuario::where('id', $id)->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_usuario['id_parque'])->first();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $tbl_usuario['id_user_type'])->first();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_usuario['id_tipo_doc'])->first();
    //-------------------------
    $packed = [];
    $packed = [
        'usuario' => $tbl_usuario,
        'parque' => $tbl_parques,
        'permisos' => $tbl_permisos_usuarios,
        'documento' => $tbl_tipo_documento,
    ];
    return response()->json($packed);
});

//  || PATCH
/*
Route::patch('/mantenimientos_usuarios_guardar_edicion/{id}', function($id, Request $request){
    $tbl_usuario = \App\Models\tbl_usuario::where('id', $id)->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_usuario['id_parque'])->first();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $tbl_usuario['id_user_type'])->first();
    //$tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_usuario['id_tipo_doc'])->first();
    //--------------------------------------
    
    $tbl_usuario->id_parque = $request[''];
});
*/


Route::post('/mantenimientos_usuarios', function(Request $request){
    $tbl_usuario = new \App\Models\tbl_usuario;
    //-------------------------------
    $tbl_usuario->nombre = $request['nombre'];
    $tbl_usuario->apellido = $request['apellido'];
    $tbl_usuario->id_tipo_doc = $request['id_tipo_doc'];
    $tbl_usuario->documento = $request['documento'];
    //$tbl_usuario->imagen = $request['img'];
    if($request['imagen'] != null){
        $tbl_usuario->imagen = $request['imagen'];
    }
    //-------------------------------
    $tbl_usuario->correo = $request['correo'];
    $tbl_usuario->telefono = $request['telefono'];
    $tbl_usuario->usuario = $request['usuario'];
    $tbl_usuario->password = $request['password'];
    $tbl_usuario->id_parque = $request['id_parque'];
    $tbl_usuario->id_user_type = $request['id_user_tipo'];
    $tbl_usuario->agregado_por = $request['responsable'];
    //-------------------------------
    $tbl_usuario-> save();
    if ($tbl_usuario) {
        return response()->json(['message' => 'Actualizado', 'response' => $tbl_usuario]);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


Route::patch('/mantenimientos_usuarios/{id}', function($id,Request $request){
    $tbl_usuario = \App\Models\tbl_usuario::find($id);
    //return $tbl_usuario;

    //-------------------------------
    $tbl_usuario->nombre = $request['nombre'];
    $tbl_usuario->apellido = $request['apellido'];
    $tbl_usuario->id_tipo_doc = $request['id_tipo_doc'];
    $tbl_usuario->documento = $request['documento'];
    if($request['imagen'] != null){
        $tbl_usuario->imagen = $request['imagen'];
    }
    //-------------------------------
    $tbl_usuario->telefono = $request['telefono'];
    $tbl_usuario->correo = $request['correo'];
    $tbl_usuario->usuario = $request['usuario'];
    //$tbl_usuario->password = $request['password'];
    $tbl_usuario->id_parque = $request['id_parque'];
    $tbl_usuario->id_user_type = $request['id_user_type'];
    $tbl_usuario->estado = $request['estado'];
    $tbl_usuario->modificado_por = $request['responsable'];
    //----------------------------------------
    $tbl_usuario-> save();
    if ($tbl_usuario) {
        return response()->json(['message' => 'Actualizado', 'response' => $tbl_usuario]);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
    
});


Route::delete('/mantenimientos_usuarios/{id}', function($id) {
    $tbl_usuario = \App\Models\tbl_usuario::find($id);
    if (!$tbl_usuario) {
        return response()->json(['message' => 'Usuario no encontrado'], 404);
    }
    $tbl_usuario->delete();
    return response()->json(['message' => 'Usuario eliminado correctamente','status'=>201], 200);
});




//==============================================================================
// ROLES
//==============================================================================


Route::get('/mantenimiento_roles', function () { // RECARGA
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::orderBy('id')->get();
    return view('oficina_fix/mantenimiento_roles', [
        'tbl_permisos_usuarios' => $tbl_permisos_usuarios
    ]);
})->middleware('token.auth');

Route::get('/mantenimiento_roles_all', function () { // RECARGA
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::orderBy('id', 'asc')->get();
    if ($tbl_permisos_usuarios) {
        return response()->json($tbl_permisos_usuarios);
    } else {
        return response()->json(['message' => 'Error durante la peticion', 'status'=>500], 500);
    }
});
Route::get('/mantenimiento_roles_preciso/{id}', function ($id) { // RECARGA
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $id)->first();
    if ($tbl_permisos_usuarios) {
        return response()->json($tbl_permisos_usuarios);
    } else {
        return response()->json(['message' => 'Error durante la peticion', 'status'=>500], 500);
    }
});


Route::patch('/mantenimiento_roles/{id}',function($id, Request $request){
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $id)->first();
    $tbl_permisos_usuarios['posicion'] = $request['rol'];
    $tbl_permisos_usuarios['permisos'] = $request['permisos'];
    $tbl_permisos_usuarios['estado'] = $request['estado'];
    $tbl_permisos_usuarios['modificado_por'] = $request['responsable'];
    $tbl_permisos_usuarios-> save();
    if ($tbl_permisos_usuarios) {
        return response()->json($tbl_permisos_usuarios);
    } else {
        return response()->json(['message' => 'Error durante la peticion', 'status'=>500], 500);
    }
});



Route::post('/mantenimiento_roles',function(Request $request){
    $tbl_permisos_usuarios = new \App\Models\tbl_permisos_usuarios;
    $tbl_permisos_usuarios['posicion'] = $request['rol'];
    $tbl_permisos_usuarios['permisos'] = $request['permisos'];
    $tbl_permisos_usuarios['agregado_por'] = $request['responsable'];
    $tbl_permisos_usuarios-> save();
    if ($tbl_permisos_usuarios) {
        return response()->json($tbl_permisos_usuarios);
    } else {
        return response()->json(['message' => 'Error durante la peticion', 'status'=>500], 500);
    }
});



Route::delete('/mantenimiento_roles/{id}', function ($id) { // RECARGA
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $id)->first(); //DOCUMENTO PRINCIPAL
    $tbl_usuario = \App\Models\tbl_usuario::where('id_user_type',$id)->get(); // DEPENDENCIA
    if ($tbl_usuario->isEmpty()) {
        $tbl_permisos_usuarios->delete();
        if ($tbl_permisos_usuarios) {
            return response()->json(['estado'=>true,'respuesta'=>$tbl_permisos_usuarios]);
        } else {
            return response()->json(['estado'=>'error','respuesta'=>'Error inesperado']);
        }
    }else{
        return response()->json(['estado'=>false,'respuesta'=>$tbl_permisos_usuarios]);
    }
});



/*
    1. Ver solicitudes
    2. Evaluar solicitudes (Aceptar o rechazar)
    3. Crear, editar y eliminar parques
    4. Crear usuarios y roles
*/




//==============================================================================
// EVENTOS
//==============================================================================


Route::get('/mantenimientos_eventos',function(){
    //++++++++++++++++++++++++++++++++++++++++++
    $sesion = Session::get('usuario');
    $tbl_tipos_eventos = null;
    //-----------------------------------
    $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')->get();
    //-----------------------------------
    if ($sesion["permisos"] == 'administrador') {
        $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    }else{
        $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')
        ->where('id_parque', $sesion['id_parque'])
        ->get();
    }
    return view('oficina_fix/mantenimiento_eventos',[
        'tbl_tipos_eventos' => $tbl_tipos_eventos,
        'tbl_parques' => $tbl_parques,
    ]);
    //+++++++++++++++++++++++++++++++++++++++++
    //$tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
    //return view('oficina_fix/mantenimiento_eventos',[
    //    'tbl_tipos_eventos' => $tbl_tipos_eventos,
    //]);
})->middleware('token.auth');

Route::get('/mantenimientos_eventos_all',function(){
    $sesion = Session::get('usuario');
    $tbl_tipos_eventos;
    $tbl_parques;
    if ($sesion["permisos"] == 'administrador'){
        $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')->get();
        $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')->get();
    }else{
        $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::orderBy('id', 'asc')
        ->where('id_parque', $sesion['id_parque'])
        ->get();
        $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')
        ->where('id', $sesion['id_parque'])
        ->get();
    }
    //return response()->json($tbl_tipos_eventos);
    return response()->json([
        'eventos'=> $tbl_tipos_eventos,
        'parques'=> $tbl_parques,
    ]);
});


Route::post('/mantenimientos_eventos', function(Request $request){
    $tbl_tipos_eventos = new \App\Models\tbl_tipos_eventos;
    $tbl_tipos_eventos['id_parque'] = $request['id_parque'];
    $tbl_tipos_eventos['tipo'] = $request['tipo'];
    $tbl_tipos_eventos['estado'] = $request['estado'];
    $tbl_tipos_eventos['agregado_por'] = $request['responsable'];
    $tbl_tipos_eventos-> save();
    if ($tbl_tipos_eventos) {
        return response()->json(['message' => 'Actualizado', 'response' => $tbl_tipos_eventos]);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
    return response()->json($request);
});


Route::patch('/mantenimientos_eventos/{id}', function($id, Request $request){
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('id', $id)->first();
    $tbl_tipos_eventos['tipo'] = $request['tipo'];
    $tbl_tipos_eventos['id_parque'] = $request['parque'];
    /*
    if ($request['parque'] != null) {
        $tbl_tipos_eventos['id_parque'] = $request['parque'];
    }else{}
    */
    $tbl_tipos_eventos['estado'] = $request['estado'];
    $tbl_tipos_eventos['modificado_por'] = $request['responsable'];
    $tbl_tipos_eventos-> save();
    if ($tbl_tipos_eventos) {
        return response()->json(['message' => 'Actualizado', 'response' => $tbl_tipos_eventos]);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});



Route::delete('/mantenimientos_eventos/{id}',function($id){
    $tbl_reservaciones = \App\Models\tbl_reservaciones::where('id_evento',$id)->get();
    $tbl_tipos_eventos = \App\Models\tbl_tipos_eventos::where('id', $id)->first();
    //-----------------------------------
    if ($tbl_reservaciones->isEmpty()) {
        $tbl_tipos_eventos->delete();
        if ($tbl_tipos_eventos) {
            return response()->json(['estado'=>true,'respuesta'=>$tbl_reservaciones]);
        }else{
            return response()->json(['estado'=>'error','respuesta'=>'Error inesperado']);
        }
    }else{
        return response()->json(['estado'=>false,'respuesta'=>$tbl_reservaciones]);
    }
});
// 






//==============================================================================
// TIPOS DE DOCUMENTOS
//==============================================================================


Route::get('/mantenimientos_documentos',function(){
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();
    return view('oficina_fix/mantenimiento_documento',[
        'tbl_tipo_documento' => $tbl_tipo_documento,
    ]);
})->middleware('token.auth');


Route::get('/mantenimientos_documentos_all',function(){
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();
    if ($tbl_tipo_documento) {
        return response()->json($tbl_tipo_documento);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


Route::patch('/mantenimientos_documentos/{id}',function($id, Request $request){
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $id)->first();
    $tbl_tipo_documento['tipo_documento'] = $request['tipo'];
    $tbl_tipo_documento['estado'] = $request['estado'];
    $tbl_tipo_documento['modificado_por'] = $request['responsable'];
    $tbl_tipo_documento->save();

    if ($tbl_tipo_documento) {
        return response()->json($tbl_tipo_documento);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


Route::post('/mantenimientos_documentos',function(Request $request){
    $tbl_tipo_documento = new \App\Models\tbl_tipo_documento;
    $tbl_tipo_documento['tipo_documento'] = $request['tipo'];
    $tbl_tipo_documento['estado'] = $request['estado'];
    $tbl_tipo_documento['agregado_por'] = $request['responsable'];
    $tbl_tipo_documento->save();

    if ($tbl_tipo_documento) {
        return response()->json($tbl_tipo_documento);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});



Route::delete('/mantenimientos_documentos/{id}',function($id){
    $tbl_usuario = \App\Models\tbl_usuario::where('id_tipo_doc', $id)->get();
    $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id_tipo_doc', $id)->get();
    //----
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $id)->first();
    //=======================================
    if ($tbl_usuario->isEmpty() && $tbl_solicitantes->isEmpty()) {
        $tbl_tipo_documento->delete();
        if ($tbl_tipo_documento) {
            return response()->json(['estado'=>true,'respuesta'=>$tbl_tipo_documento]);
        }else{
            return response()->json(['estado'=>false,'respuesta'=>'Error inesperado']);
        }
    }else{
        return response()->json(['estado'=>false,'usuarios'=>$tbl_usuario,'solicitantes'=>$tbl_solicitantes]);
    };
    //----------------------------
    //return;
    /*
    $tbl_tipo_documento->delete();
    if ($tbl_tipo_documento) {
        return response()->json($tbl_tipo_documento);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
    */
});


//==============================================================================
// CONFIGURACIONES
//==============================================================================


Route::get('/configuraciones_usuario', function () { // RECARGA
    $tbl_usuario = \App\Models\tbl_usuario::orderBy('id', 'asc')->get();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::orderBy('id', 'asc')->get();

    return view('oficina_fix/configuraciones_usuario', [
        'tbl_usuario' => $tbl_usuario,
        'tbl_tipo_documento' => $tbl_tipo_documento,
    ]);
})->middleware('token.auth');
//});


Route::patch('/configuraciones_usuario/{id}', function($id, Request $request){
    $tbl_usuario = \App\Models\tbl_usuario::find($id);
    //-------------------------------
    $tbl_usuario->nombre = $request['nombre'];
    $tbl_usuario->apellido = $request['apellido'];
    $tbl_usuario->id_tipo_doc = $request['tipo_doc'];
    $tbl_usuario->documento = $request['documento'];
    if($request['imagen'] != null){
        $tbl_usuario->imagen = $request['imagen'];
    }
    //-------------------------------
    $tbl_usuario->telefono = $request['celular'];
    $tbl_usuario->correo = $request['correo'];
    $tbl_usuario->usuario = $request['usuario'];
    $tbl_usuario->password = $request['password'];
    //----------------------------------------
    $tbl_usuario-> save();
    if ($tbl_usuario) {
        token_maker($request);
        return response()->json(['message' => 'Actualizado', 'response' => $tbl_usuario]);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});





//==============================================================================
// REPORTES
//==============================================================================



Route::get('/reportes',function(){
    return view('oficina_fix/mantenimientos_reportes');
})->middleware('token.auth');



Route::Post('/reportes_desplegar',function(Request $request){
    $sesion = Session::get('usuario');
    $tbl_reservaciones = null;
    $tbl_parques = null;
    if ($sesion["permisos"] == 'administrador') {
        $tbl_reservaciones = \App\Models\tbl_reservaciones::whereBetween('agregado_en', [$request['startdate'], $request['enddate']])->get();
        $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    }else{
        $tbl_reservaciones = \App\Models\tbl_reservaciones::whereBetween('agregado_en', [$request['startdate'], $request['enddate']])
        ->where('id_parque', $sesion['id_parque'])
        ->get();
        $tbl_parques = \App\Models\tbl_parques::where('id', $sesion['id_parque'])->get();
    }
    return response()->json([
        'reservaciones'=>$tbl_reservaciones,
        'parques'=>$tbl_parques,
    ]);
});
//$total = \App\Models\tbl_reservaciones::whereBetween('fecha_evento', [$request['startdate'], $request['enddate']])->get();



//==============================================================================
// ESTADISTICAS
//==============================================================================


Route::get('/estadisticas',function(){
    return view('oficina_fix/estadisticas');
})->middleware('token.auth');
/*
Route::get('/estadisticas_parques_all',function(){
    $tbl_parques = \App\Models\tbl_parques::orderBy('id', 'asc')->get();
    if ($tbl_parques) {
        return response()->json($tbl_parques);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});
*/

Route::get('/estadisticas_parques_all',function(){
    $sesion = Session::get('usuario');
    $tbl_parques;
    if ($sesion["permisos"] == 'administrador'){
        $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')->get();
        if ($tbl_parques) {
            return response()->json($tbl_parques);
        }else {
            return response()->json(['message' => 'Error de peticion'], 500);
        }
    }else{
        $tbl_parques = \App\Models\tbl_parques::where('estado', 'activo')
        ->where('id', $sesion['id_parque'])
        ->get();
        if ($tbl_parques) {
            return response()->json($tbl_parques);
        }else {
            return response()->json(['message' => 'Error de peticion'], 500);
        }
    }
});


Route::post('/estadisticas_reservaciones_fecha',function(Request $request){
    //$total = \App\Models\tbl_reservaciones::whereBetween('fecha_evento', [$request['startdate'], $request['enddate']])->get();
    $total = \App\Models\tbl_reservaciones::whereBetween('agregado_en', [$request['startdate'], $request['enddate']])->get();
    if ($total) {
        return response()->json($total);
    } else {
        return response()->json(['message' => 'Error de peticion'], 500);
    }
});


/*
Route::get('/estadisticas_reservaciones_por_mes', function(Request $request){ // FUNCIONAL
    $startDate = now()->firstOfYear(); // Primer día del año actual
    $endDate = now()->endOfMonth(); // Último día del mes actual
    $reservaciones = \App\Models\tbl_reservaciones::whereBetween('fecha_evento', [$startDate, $endDate])->get();
    $reservacionesPorMes = [];
    foreach ($reservaciones as $reservacion) {
        // Convierte la cadena de fecha a un objeto DateTime
        $fechaEvento = \Carbon\Carbon::parse($reservacion->fecha_evento);
        $mes = $fechaEvento->format('F'); // Obtiene el nombre del mes
        $reservacionesPorMes[$mes][] = $reservacion;
    }

    return response()->json($reservacionesPorMes);
});
*/



Route::get('/estadisticas_reservaciones_por_mes', function(Request $request){
    $startDate = now()->firstOfYear(); // Primer día del año actual
    $endDate = now()->endOfMonth(); // Último día del mes actual
    //$reservaciones = \App\Models\tbl_reservaciones::whereBetween('fecha_evento', [$startDate, $endDate])->get();
    $reservaciones = \App\Models\tbl_reservaciones::whereBetween('agregado_en', [$startDate, $endDate])->get();
    $reservaciones_por_mes = [];
    foreach ($reservaciones as $reservacion) {
        //$fechaEvento = \Carbon\Carbon::parse($reservacion->fecha_evento);
        $fechaEvento = \Carbon\Carbon::parse($reservacion->agregado_en);
        $mes = $fechaEvento->format('F'); // Obtiene el nombre del mes
        if (!isset($reservaciones_por_mes[$mes])) {
            $reservaciones_por_mes[$mes] = 1;
        } else {
            $reservaciones_por_mes[$mes]++;
        }
    }
    return response()->json($reservaciones_por_mes);
});




/*
Route::get('/estadisticas_reservaciones_por_mes', function(){
    setlocale(LC_TIME, 'es_ES'); // Configurar localización en español

    $startDate = now()->firstOfYear(); // Primer día del año actual
    $endDate = now()->endOfMonth(); // Último día del mes actual

    $reservaciones = \App\Models\tbl_reservaciones::whereBetween('fecha_evento', [$startDate, $endDate])->get();

    $reservacionesPorMes = [];

    foreach ($reservaciones as $reservacion) {
        // Convierte la cadena de fecha a un objeto DateTime
        $fechaEvento = \Carbon\Carbon::parse($reservacion->fecha_evento);
        $mes = strftime('%B', $fechaEvento->timestamp); // Obtiene el nombre del mes en español
        $reservacionesPorMes[$mes][] = $reservacion;
    }

    return response()->json($reservacionesPorMes);
});
*/



/*
    $pendientes = \App\Models\tbl_reservaciones::where('estado', 'pendiente')->count();
    $confirmada = \App\Models\tbl_reservaciones::where('estado', 'confirmada')->count();
    $rechazada = \App\Models\tbl_reservaciones::where('estado', 'rechazada')->count();
    $espera = \App\Models\tbl_reservaciones::where('estado', 'espera')->count();
    $vencida = \App\Models\tbl_reservaciones::where('estado', 'vencida')->count();
    $realizada = \App\Models\tbl_reservaciones::where('estado', 'realizada')->count();
*/



//======================================================================
Route::post('/obtener_fecha_dia_parque',function(Request $request){
    
    $tbl_horario = \App\Models\tbl_horarios_parques::where('id_parque', $request['id_park'])
    ->where('dia_semana', $request['dia_semana'])->get();
    // Mas para lante!!! hacer una proteccion contra tildes
    

    return response()->json($tbl_horario);
});


/*
    ||============================================
    || CREACION Y GESTION DE SESIONES
    ||============================================
*/




Route::get('/make_sesion',function(){
    $tbl_usuario = \App\Models\tbl_usuario::where('id', '1')->get();
    Session::put('usuario', $tbl_usuario);
    $datosDeSesion = Session::all();
    return ($datosDeSesion);
});
//})->middleware('token.auth');
//->middleware('token.auth')


Route::get('/view_sesion',function(){
    $datosDeSesion = Session::all();
    return ($datosDeSesion);
});

Route::get('/eliminar_sesion',function(){
    Session::flush();
    $datosDeSesion = Session::all();
    return ($datosDeSesion);
});





Route::get('/session_live',function(){
    $sesion = Session::get('usuario');
    return ($sesion);
});





/*
    $tbl_usuario = \App\Models\tbl_usuario::where('id', $id)->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_usuario['id_parque'])->first();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $tbl_usuario['id_user_type'])->first();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_usuario['id_tipo_doc'])->first();
    //-------------------------
    $packed_token = [
        'id' => $tbl_usuario['id'],
        'nombre' => $tbl_usuario['nombre'],
        'apellido' => $tbl_usuario['apellido'],
        'tipo_documento' => $tbl_tipo_documento['tipo_documento'],
        'documento' => $tbl_usuario['documento'],
        //---------------------------------------
        'usuario' => $tbl_usuario['usuario'],
        //---------------------------------------
        'correo' => $tbl_usuario['correo'],
        'telefono' => $tbl_usuario['telefono'],
        'imagen' => $tbl_usuario['imagen'],
        'estado' => $tbl_usuario['estado'],
        //---------------------------------------
        'rol' => $tbl_permisos_usuarios['posicion'],
        'permisos' => $tbl_permisos_usuarios['permisos'],
        //---------------------------------------
        'nombre_parque' => $tbl_parques['nombre_parque'],
    ];
    return response()->json($packed_token);
*/


Route::get('/user_packed/{id}', function($id){
    $tbl_usuario = \App\Models\tbl_usuario::where('id', $id)->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_usuario['id_parque'])->first();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $tbl_usuario['id_user_type'])->first();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_usuario['id_tipo_doc'])->first();
    //-------------------------
    $packed = [
        'id' => $tbl_usuario['id'],
        'nombre' => $tbl_usuario['nombre'],
        'apellido' => $tbl_usuario['apellido'],
        'tipo_documento' => $tbl_tipo_documento['tipo_documento'],
        'id_documento' => $tbl_tipo_documento['id'],
        'documento' => $tbl_usuario['documento'],
        //---------------------------------------
        'usuario' => $tbl_usuario['usuario'],
        'password' => $tbl_usuario['password'],
        //---------------------------------------
        'correo' => $tbl_usuario['correo'],
        'celular' => $tbl_usuario['telefono'],
        'imagen' => $tbl_usuario['imagen'],
        'estado' => $tbl_usuario['estado'],
        //---------------------------------------
        'rol' => $tbl_permisos_usuarios['posicion'],
        'permisos' => $tbl_permisos_usuarios['permisos'],
        //---------------------------------------
        'nombre_parque' => $tbl_parques['nombre_parque'],
    ];
    //return ($packed);
    return response()->json($packed);
});


function token_maker($request){
    $tbl_usuario = \App\Models\tbl_usuario::where('usuario', $request->input('usuario'))->first();

    //$tbl_usuario = \App\Models\tbl_usuario::where('id', $id)->first();
    $tbl_parques = \App\Models\tbl_parques::where('id', $tbl_usuario['id_parque'])->first();
    $tbl_permisos_usuarios = \App\Models\tbl_permisos_usuarios::where('id', $tbl_usuario['id_user_type'])->first();
    $tbl_tipo_documento = \App\Models\tbl_tipo_documento::where('id', $tbl_usuario['id_tipo_doc'])->first();
    //-------------------------
    $packed_token = [
        'id' => $tbl_usuario['id'],
        'nombre' => $tbl_usuario['nombre'],
        'apellido' => $tbl_usuario['apellido'],
        'tipo_documento' => $tbl_tipo_documento['tipo_documento'],
        'documento' => $tbl_usuario['documento'],
        //---------------------------------------
        'usuario' => $tbl_usuario['usuario'],
        'password' => $tbl_usuario['password'],
        //---------------------------------------
        'correo' => $tbl_usuario['correo'],
        'celular' => $tbl_usuario['telefono'],
        'imagen' => $tbl_usuario['imagen'],
        'estado' => $tbl_usuario['estado'],
        //---------------------------------------
        'rol' => $tbl_permisos_usuarios['posicion'],
        'permisos' => $tbl_permisos_usuarios['permisos'],
        //---------------------------------------
        'nombre_parque' => $tbl_parques['nombre_parque'],
        'id_parque' => $tbl_parques['id'],
    ];
    Session::put('usuario', $packed_token);
    return ($packed_token);
};

Route::get('/redirect_json',function(){
    $respuesta = token_maker('1');
    return response()->json($respuesta['rol']);
});


function notificacion_email($request){ //EMAIL DE CONFIRMACION
    try {
        $id = $request;
        //$QR= $request['qr'];
        $tbl_reservacion = \App\Models\tbl_reservaciones::where('id', $id)->first();
        $tbl_solicitantes = \App\Models\tbl_solicitantes::where('id', $tbl_reservacion['id_solicitante'])->first();
        $packed = [
            //
            "id" => $tbl_reservacion["id"],
            "codigo_reservacion" => $tbl_reservacion["codigo_reservacion"],
            "documento" => $tbl_solicitantes["documento"],
            "estado" => $tbl_reservacion["estado"],
            "nombres" => $tbl_solicitantes["nombres"],
            "apellidos" => $tbl_solicitantes["apellidos"],
            "fecha_evento" => $tbl_reservacion["fecha_evento"],
            "hora_inicio" => $tbl_reservacion["hora_inicio"],
            "hora_fin" => $tbl_reservacion["hora_fin"],
        ];
        $correo = new ReservacionMaker_qr($packed);
        $Destinatario = $tbl_solicitantes['correo'];
        Mail::to($Destinatario)->send($correo);
        $respuestas[] = [
            'respuestas' => 'Correo electronico enviado correctamente',
            'Reservacion' => $tbl_reservacion,
            'destinatario' => $Destinatario,
            //'QR' => $QR,
        ];
        return response() ->json($respuestas);
    } catch (\Exception $e) {
        return "Error al enviar el correo electrónico: " . $e;
    }
};


/*
    ||=================================================
    || VERIFIACIONES DE EXISTENCIA
    ||=================================================
*/

//Route::get('/redirect_json',function(){
//$tbl_usuario = \App\Models\tbl_usuario::where('usuario', $request->input('usuario'))->first();

Route::post('/validar_info_existente',function(Request $request){
    $modelo = $request['origen'];
    $respuesta = app("App\\Models\\$modelo")::where($request['tipo'], $request['info'])->get();
    $packed = [];
    $check = false;
    if ($respuesta->isEmpty()) {
        return response()->json(['existe'=>false]);
    }else{
        if ($respuesta) {
            if ($request['id'] == null) {
                $check = false;
                return response()->json(['respuesta'=>$respuesta, 'existe'=>true, 'patch' =>$check, 'id' =>$request['id']]);
            }else{
                foreach ($respuesta as $res) {
                    if ($res['id'] == $request['id']){
                        $packed[] = [
                            'id_existente'=>$res['id'],
                            'info_existente'=>$res,
                            //-------------------------
                            'coincidencia'=> true,
                        ];
                        $check = true;
                    }else{
                        $packed[] = [
                            'id_existente'=>$res['id'],
                            'info_existente'=>$res,
                            //-------------------------
                            'coincidencia'=> false,
                        ];
                    }
                }
                return response()->json(['respuesta'=>$packed, 'existe'=>true, 'patch' =>$check, 'id' =>$request['id']]);
            }
            //return response()->json(['respuesta'=>$packed, 'existe'=>true, 'patch' =>$check, 'id' =>$request['id']]);
        }else{
            return ('Error');
        }
    }
});



/*
Route::get('/terminos_condiciones',function(){
    $tbl_terminos_condiciones = \App\Models\tbl_terminos_condiciones_generales::orderBy('id', 'asc')->get();
    return response()->json($tbl_terminos_condiciones);
});
*/


Route::get('/terminos_condiciones_all',function(){
    $tbl_terminos_condiciones = \App\Models\tbl_terminos_condiciones_generales::orderBy('id', 'asc')->get();
    return response()->json($tbl_terminos_condiciones);
});

Route::post('/terminos_condiciones',function(Request $request){
    $tbl_terminos_condiciones = \App\Models\tbl_terminos_condiciones_generales::where('id_parque', $request['id'])->first();
    if ($tbl_terminos_condiciones) {
        $tbl_terminos_condiciones['condiciones'] = $request['terminos'];
        $tbl_terminos_condiciones->save();
        return response()->json(['respuesta'=>$tbl_terminos_condiciones,'accion'=>'patch', 'estado'=>true]);
    }else{
        $tbl_terminos_condiciones = new \App\Models\tbl_terminos_condiciones_generales;
        $tbl_terminos_condiciones['id_parque'] = $request['id'];
        $tbl_terminos_condiciones['condiciones'] = $request['terminos'];
        $tbl_terminos_condiciones->save();
        return response()->json(['respuesta'=>$tbl_terminos_condiciones,'accion'=>'post', 'estado'=>true]);
    }
});


/*
    ||=================================================
    || LABORATORIO DE PRUEBAS
    ||=================================================
*/



/*
Route::get('/stripo_reset',function(){
    return view('Stripo-reset');
});
*/


Route::post('/correo-reset', function (Request $request) { // RESERVACIONES
    try {
        $tbl_usuario = \App\Models\tbl_usuario::where('id', $request['id'])->first();
        $tbl_usuario['password'] = $request['password'];
        $tbl_usuario->save();
        $packed = [
            "usuario" => $tbl_usuario["usuario"],
            "password" => $tbl_usuario["password"],
        ];
        $correo = new Reset_pass($packed);
        $Destinatario = $tbl_usuario['correo'];
        Mail::to($Destinatario)->send($correo);
        $respuestas = [
            'respuestas' => 'Correo electronico enviado correctamente',
            'destinatario' => $Destinatario,
            'Info'=>$packed,
            //'Request'=>$request,
            'estado'=>true
        ];
        return response() ->json($respuestas);
    } catch (\Exception $e) {
        return "Error al enviar el correo electrónico: " . $e;
    }
});


Route::get('/key',function(){
    $cryptoKey = env('CRYPTO_KEY');
    return response()->json($cryptoKey);
});


