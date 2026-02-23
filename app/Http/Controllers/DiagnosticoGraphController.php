<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;

class DiagnosticoGraphController extends Controller
{
    private $httpClient;
    private $tenantId;
    private $clientId;
    private $clientSecret;

    public function __construct()
    {
        $this->httpClient = new Client();
        $this->tenantId = config('msgraph.tenantId');
        $this->clientId = config('msgraph.clientId');
        $this->clientSecret = config('msgraph.clientSecret');
    }

    /**
     * Diagnóstico completo de Microsoft Graph
     */
    public function diagnosticar()
    {
        $resultado = [
            'timestamp' => now()->toDateTimeString(),
            'configuracion' => $this->verificarConfiguracion(),
            'token' => $this->verificarToken(),
            'permisos' => null,
            'test_envio' => null
        ];

        // Si el token funciona, verificar permisos
        if ($resultado['token']['valido']) {
            $resultado['permisos'] = $this->verificarPermisos($resultado['token']['access_token']);
            $resultado['test_envio'] = $this->probarEnvio($resultado['token']['access_token']);
        }

        return response()->json($resultado, 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Verificar configuración básica
     */
    private function verificarConfiguracion()
    {
        return [
            'tenant_id' => $this->tenantId,
            'client_id' => $this->clientId,
            'secret_configurado' => !empty($this->clientSecret),
            'from_email' => env('MAIL_FROM_ADDRESS'),
        ];
    }

    /**
     * Obtener y verificar token
     */
    private function verificarToken()
    {
        try {
            // Limpiar caché del token para obtener uno fresco
            Cache::forget('msgraph_access_token');

            $response = $this->httpClient->post(
                "https://login.microsoftonline.com/{$this->tenantId}/oauth2/v2.0/token",
                [
                    'form_params' => [
                        'client_id' => $this->clientId,
                        'client_secret' => $this->clientSecret,
                        'scope' => 'https://graph.microsoft.com/.default',
                        'grant_type' => 'client_credentials'
                    ]
                ]
            );

            $data = json_decode($response->getBody()->getContents(), true);

            if (isset($data['access_token'])) {
                // Decodificar el token para ver los permisos (sin verificar firma)
                $tokenParts = explode('.', $data['access_token']);
                $payload = json_decode(base64_decode(str_pad(strtr($tokenParts[1], '-_', '+/'), strlen($tokenParts[1]) % 4, '=', STR_PAD_RIGHT)), true);

                return [
                    'valido' => true,
                    'access_token' => $data['access_token'],
                    'expira_en' => $data['expires_in'] . ' segundos',
                    'tipo' => $data['token_type'],
                    'permisos_en_token' => $payload['roles'] ?? [],
                    'app_id_token' => $payload['appid'] ?? null,
                    'tenant_id_token' => $payload['tid'] ?? null,
                ];
            }

            return [
                'valido' => false,
                'error' => 'No se recibió access_token',
                'respuesta_completa' => $data
            ];

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorBody = $e->getResponse()->getBody()->getContents();
            return [
                'valido' => false,
                'error' => 'Error HTTP al obtener token',
                'codigo' => $e->getResponse()->getStatusCode(),
                'detalles' => json_decode($errorBody, true)
            ];
        } catch (\Exception $e) {
            return [
                'valido' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Verificar permisos del token
     */
    private function verificarPermisos($token)
    {
        // Decodificar el token JWT para ver los permisos
        $tokenParts = explode('.', $token);
        $payload = json_decode(base64_decode(str_pad(strtr($tokenParts[1], '-_', '+/'), strlen($tokenParts[1]) % 4, '=', STR_PAD_RIGHT)), true);

        $roles = $payload['roles'] ?? [];

        return [
            'permisos_encontrados' => $roles,
            'tiene_mail_send' => in_array('Mail.Send', $roles),
            'permisos_requeridos' => ['Mail.Send'],
            'estado' => in_array('Mail.Send', $roles) ? '✅ PERMISOS CORRECTOS' : 'FALTA PERMISO Mail.Send'
        ];
    }

    /**
     * Probar envío de correo
     */
    private function probarEnvio($token)
    {
        try {
            $fromEmail = env('MAIL_FROM_ADDRESS', 'alerts@adn.gob.do');
            $testEmail = 'manuelmaldonado2898@gmail.com';

            $message = [
                'message' => [
                    'subject' => 'TEST - Diagnóstico Microsoft Graph',
                    'body' => [
                        'contentType' => 'HTML',
                        'content' => '<h1>Test exitoso</h1><p>Los permisos están configurados correctamente.</p>'
                    ],
                    'toRecipients' => [
                        [
                            'emailAddress' => [
                                'address' => $testEmail
                            ]
                        ]
                    ]
                ],
                'saveToSentItems' => true
            ];

            $response = $this->httpClient->post(
                "https://graph.microsoft.com/v1.0/users/{$fromEmail}/sendMail",
                [
                    'headers' => [
                        'Authorization' => "Bearer {$token}",
                        'Content-Type' => 'application/json'
                    ],
                    'json' => $message
                ]
            );

            return [
                'exitoso' => true,
                'codigo_http' => $response->getStatusCode(),
                'mensaje' => '✅ CORREO ENVIADO EXITOSAMENTE',
                'destinatario' => $testEmail
            ];

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorBody = $e->getResponse()->getBody()->getContents();
            $errorData = json_decode($errorBody, true);

            return [
                'exitoso' => false,
                'codigo_http' => $e->getResponse()->getStatusCode(),
                'error' => $errorData['error']['code'] ?? 'Error desconocido',
                'mensaje' => $errorData['error']['message'] ?? $e->getMessage(),
                'detalles_completos' => $errorData
            ];
        } catch (\Exception $e) {
            return [
                'exitoso' => false,
                'error' => $e->getMessage()
            ];
        }
    }

    /**
     * Limpiar caché del token
     */
    public function limpiarCache()
    {
        Cache::forget('msgraph_access_token');

        return response()->json([
            'mensaje' => 'Caché del token limpiado exitosamente',
            'timestamp' => now()->toDateTimeString()
        ]);
    }
}
