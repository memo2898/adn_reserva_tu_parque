<?php

namespace App\Services;

use Dcblogdev\MicrosoftGraph\Facades\MsGraph;
use Illuminate\Support\Facades\Log;

class MicrosoftGraphMailService
{
    /**
     * Enviar correo electrónico usando Microsoft Graph API
     *
     * @param string $to Destinatario del correo
     * @param string $subject Asunto del correo
     * @param string $htmlBody Cuerpo del correo en HTML
     * @param array $attachments Archivos adjuntos (opcional)
     * @return array
     */
    public function sendEmail($to, $subject, $htmlBody, $attachments = [])
    {
        try {
            // Obtener el token de acceso
            $token = $this->getAccessToken();

            if (!$token) {
                throw new \Exception('No se pudo obtener el token de acceso de Microsoft Graph');
            }

            // Preparar el cuerpo del mensaje
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
                'saveToSentItems' => 'true'
            ];

            // Agregar archivos adjuntos si los hay
            if (!empty($attachments)) {
                $message['message']['attachments'] = $this->prepareAttachments($attachments);
            }

            // Enviar el correo usando Microsoft Graph API
            $response = MsGraph::post('me/sendMail', $message);

            Log::info('Correo enviado exitosamente', [
                'destinatario' => $to,
                'asunto' => $subject
            ]);

            return [
                'success' => true,
                'message' => 'Correo enviado exitosamente',
                'destinatario' => $to
            ];

        } catch (\Exception $e) {
            Log::error('Error al enviar correo con Microsoft Graph', [
                'error' => $e->getMessage(),
                'destinatario' => $to
            ]);

            return [
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage(),
                'destinatario' => $to
            ];
        }
    }

    /**
     * Obtener el token de acceso de Microsoft Graph
     *
     * @return string|null
     */
    private function getAccessToken()
    {
        try {
            // Obtener token usando Client Credentials Flow
            $response = MsGraph::getAccessToken();
            return $response;
        } catch (\Exception $e) {
            Log::error('Error al obtener token de acceso', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Preparar archivos adjuntos para Microsoft Graph
     *
     * @param array $attachments
     * @return array
     */
    private function prepareAttachments($attachments)
    {
        $graphAttachments = [];

        foreach ($attachments as $attachment) {
            $graphAttachments[] = [
                '@odata.type' => '#microsoft.graph.fileAttachment',
                'name' => $attachment['name'],
                'contentType' => $attachment['type'] ?? 'application/octet-stream',
                'contentBytes' => base64_encode(file_get_contents($attachment['path']))
            ];
        }

        return $graphAttachments;
    }

    /**
     * Enviar correo desde un Mailable de Laravel
     *
     * @param string $to Destinatario
     * @param \Illuminate\Mail\Mailable $mailable Instancia de Mailable
     * @return array
     */
    public function sendMailable($to, $mailable)
    {
        try {
            // Renderizar el contenido del mailable
            $rendered = $mailable->render();
            $subject = $mailable->subject ?? 'Sin asunto';

            return $this->sendEmail($to, $subject, $rendered);
        } catch (\Exception $e) {
            Log::error('Error al enviar Mailable con Microsoft Graph', [
                'error' => $e->getMessage(),
                'destinatario' => $to
            ]);

            return [
                'success' => false,
                'message' => 'Error al enviar el correo: ' . $e->getMessage()
            ];
        }
    }
}
