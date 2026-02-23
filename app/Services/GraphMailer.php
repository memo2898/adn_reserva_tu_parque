<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * Servicio para enviar correos usando Microsoft Graph API
 * con Client Credentials Flow (aplicación sin usuario)
 */
class GraphMailer
{
    private $httpClient;
    private $tenantId;
    private $clientId;
    private $clientSecret;
    private $fromEmail;

    public function __construct()
    {
        $this->httpClient = new Client();
        $this->tenantId = config('msgraph.tenantId');
        $this->clientId = config('msgraph.clientId');
        $this->clientSecret = config('msgraph.clientSecret');
        $this->fromEmail = env('MAIL_FROM_ADDRESS', 'alerts@adn.gob.do');
    }

    /**
     * Obtener token de acceso usando Client Credentials Flow
     *
     * @return string|null
     */
    private function getAccessToken()
    {
        // Cachear el token por 55 minutos (los tokens duran 60 min)
        return Cache::remember('msgraph_access_token', 3300, function () {
            try {
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
                return $data['access_token'] ?? null;

            } catch (\Exception $e) {
                Log::error('Error obteniendo token de Microsoft Graph', [
                    'error' => $e->getMessage()
                ]);
                return null;
            }
        });
    }

    /**
     * Enviar correo electrónico
     *
     * @param string $to Correo del destinatario
     * @param string $subject Asunto
     * @param string $htmlBody Cuerpo del correo en HTML
     * @param array $options Opciones adicionales (cc, bcc, attachments)
     * @return array
     */
    public function sendEmail($to, $subject, $htmlBody, $options = [])
    {
        try {
            $token = $this->getAccessToken();

            if (!$token) {
                throw new \Exception('No se pudo obtener el token de acceso');
            }

            // Construir el mensaje
            $message = [
                'message' => [
                    'subject' => $subject,
                    'body' => [
                        'contentType' => 'HTML',
                        'content' => $htmlBody
                    ],
                    'toRecipients' => [
                        [
                            'emailAddress' => [
                                'address' => $to
                            ]
                        ]
                    ]
                ],
                'saveToSentItems' => true
            ];

            // Agregar CC si existe
            if (!empty($options['cc'])) {
                $message['message']['ccRecipients'] = array_map(function($email) {
                    return ['emailAddress' => ['address' => $email]];
                }, is_array($options['cc']) ? $options['cc'] : [$options['cc']]);
            }

            // Agregar BCC si existe
            if (!empty($options['bcc'])) {
                $message['message']['bccRecipients'] = array_map(function($email) {
                    return ['emailAddress' => ['address' => $email]];
                }, is_array($options['bcc']) ? $options['bcc'] : [$options['bcc']]);
            }

            // Agregar adjuntos si existen
            if (!empty($options['attachments'])) {
                $message['message']['attachments'] = $this->prepareAttachments($options['attachments']);
            }

            // Enviar el correo usando la API de Microsoft Graph
            // Usamos el endpoint de usuarios para enviar desde el usuario configurado
            $response = $this->httpClient->post(
                "https://graph.microsoft.com/v1.0/users/{$this->fromEmail}/sendMail",
                [
                    'headers' => [
                        'Authorization' => "Bearer {$token}",
                        'Content-Type' => 'application/json'
                    ],
                    'json' => $message
                ]
            );

            Log::info('Correo enviado exitosamente vía Microsoft Graph', [
                'destinatario' => $to,
                'asunto' => $subject,
                'status' => $response->getStatusCode()
            ]);

            return [
                'success' => true,
                'message' => 'Correo enviado exitosamente',
                'destinatario' => $to
            ];

        } catch (\GuzzleHttp\Exception\ClientException $e) {
            $errorBody = $e->getResponse()->getBody()->getContents();
            Log::error('Error HTTP al enviar correo con Microsoft Graph', [
                'error' => $e->getMessage(),
                'response' => $errorBody,
                'destinatario' => $to
            ]);

            return [
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
                'details' => $errorBody
            ];

        } catch (\Exception $e) {
            Log::error('Error al enviar correo con Microsoft Graph', [
                'error' => $e->getMessage(),
                'destinatario' => $to
            ]);

            return [
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Preparar archivos adjuntos
     *
     * @param array $attachments
     * @return array
     */
    private function prepareAttachments($attachments)
    {
        $graphAttachments = [];

        foreach ($attachments as $attachment) {
            if (isset($attachment['path']) && file_exists($attachment['path'])) {
                $graphAttachments[] = [
                    '@odata.type' => '#microsoft.graph.fileAttachment',
                    'name' => $attachment['name'] ?? basename($attachment['path']),
                    'contentType' => $attachment['type'] ?? mime_content_type($attachment['path']),
                    'contentBytes' => base64_encode(file_get_contents($attachment['path']))
                ];
            } elseif (isset($attachment['content'])) {
                // Soporte para adjuntos desde contenido directo
                $graphAttachments[] = [
                    '@odata.type' => '#microsoft.graph.fileAttachment',
                    'name' => $attachment['name'],
                    'contentType' => $attachment['type'] ?? 'application/octet-stream',
                    'contentBytes' => base64_encode($attachment['content'])
                ];
            }
        }

        return $graphAttachments;
    }

    /**
     * Enviar correo desde una vista de Laravel
     *
     * @param string $to Destinatario
     * @param string $subject Asunto
     * @param string $view Nombre de la vista
     * @param array $data Datos para la vista
     * @param array $options Opciones adicionales
     * @return array
     */
    public function sendFromView($to, $subject, $view, $data = [], $options = [])
    {
        try {
            $htmlBody = view($view, $data)->render();
            return $this->sendEmail($to, $subject, $htmlBody, $options);
        } catch (\Exception $e) {
            Log::error('Error al renderizar vista para correo', [
                'error' => $e->getMessage(),
                'view' => $view
            ]);

            return [
                'success' => false,
                'message' => 'Error al renderizar la vista: ' . $e->getMessage()
            ];
        }
    }
}
