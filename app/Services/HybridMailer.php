<?php

namespace App\Services;

use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

/**
 * Servicio de correo híbrido que intenta usar Microsoft Graph
 * y si falla, usa SMTP como fallback
 */
class HybridMailer
{
    private $graphMailer;

    public function __construct()
    {
        $this->graphMailer = new GraphMailer();
    }

    /**
     * Enviar correo con fallback automático
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
        // Intentar enviar con Microsoft Graph primero
        $graphResult = $this->graphMailer->sendFromView($to, $subject, $view, $data, $options);

        // Si Microsoft Graph funciona, retornar el resultado
        if ($graphResult['success']) {
            Log::info('Correo enviado exitosamente vía Microsoft Graph', [
                'destinatario' => $to,
                'metodo' => 'Microsoft Graph'
            ]);
            return $graphResult;
        }

        // Si Microsoft Graph falla, usar SMTP como fallback
        Log::warning('Microsoft Graph falló, usando SMTP como fallback', [
            'error_graph' => $graphResult['message'],
            'destinatario' => $to
        ]);

        return $this->sendViaSMTP($to, $subject, $view, $data, $options);
    }

    /**
     * Enviar correo usando SMTP (Laravel Mail)
     *
     * @param string $to Destinatario
     * @param string $subject Asunto
     * @param string $view Nombre de la vista
     * @param array $data Datos para la vista
     * @param array $options Opciones adicionales
     * @return array
     */
    private function sendViaSMTP($to, $subject, $view, $data = [], $options = [])
    {
        try {
            Mail::send($view, $data, function ($message) use ($to, $subject, $options) {
                $message->to($to)
                        ->subject($subject);

                // Agregar CC si existe
                if (!empty($options['cc'])) {
                    $cc = is_array($options['cc']) ? $options['cc'] : [$options['cc']];
                    foreach ($cc as $ccEmail) {
                        $message->cc($ccEmail);
                    }
                }

                // Agregar BCC si existe
                if (!empty($options['bcc'])) {
                    $bcc = is_array($options['bcc']) ? $options['bcc'] : [$options['bcc']];
                    foreach ($bcc as $bccEmail) {
                        $message->bcc($bccEmail);
                    }
                }

                // Agregar adjuntos si existen
                if (!empty($options['attachments'])) {
                    foreach ($options['attachments'] as $attachment) {
                        if (isset($attachment['path']) && file_exists($attachment['path'])) {
                            $message->attach($attachment['path'], [
                                'as' => $attachment['name'] ?? basename($attachment['path']),
                                'mime' => $attachment['type'] ?? mime_content_type($attachment['path'])
                            ]);
                        }
                    }
                }
            });

            Log::info('Correo enviado exitosamente vía SMTP', [
                'destinatario' => $to,
                'asunto' => $subject,
                'metodo' => 'SMTP (Fallback)'
            ]);

            return [
                'success' => true,
                'message' => 'Correo enviado exitosamente vía SMTP',
                'destinatario' => $to,
                'metodo' => 'SMTP'
            ];

        } catch (\Exception $e) {
            Log::error('Error al enviar correo vía SMTP', [
                'error' => $e->getMessage(),
                'destinatario' => $to
            ]);

            return [
                'success' => false,
                'message' => 'Error al enviar correo por ambos métodos: ' . $e->getMessage(),
                'destinatario' => $to
            ];
        }
    }

    /**
     * Enviar correo directamente con HTML
     *
     * @param string $to Destinatario
     * @param string $subject Asunto
     * @param string $htmlBody Cuerpo HTML
     * @param array $options Opciones adicionales
     * @return array
     */
    public function sendEmail($to, $subject, $htmlBody, $options = [])
    {
        // Intentar con Microsoft Graph primero
        $graphResult = $this->graphMailer->sendEmail($to, $subject, $htmlBody, $options);

        if ($graphResult['success']) {
            return $graphResult;
        }

        // Fallback a SMTP
        try {
            Mail::html($htmlBody, function ($message) use ($to, $subject, $options) {
                $message->to($to)
                        ->subject($subject);

                if (!empty($options['cc'])) {
                    $cc = is_array($options['cc']) ? $options['cc'] : [$options['cc']];
                    foreach ($cc as $ccEmail) {
                        $message->cc($ccEmail);
                    }
                }

                if (!empty($options['bcc'])) {
                    $bcc = is_array($options['bcc']) ? $options['bcc'] : [$options['bcc']];
                    foreach ($bcc as $bccEmail) {
                        $message->bcc($bccEmail);
                    }
                }
            });

            return [
                'success' => true,
                'message' => 'Correo enviado exitosamente vía SMTP',
                'destinatario' => $to,
                'metodo' => 'SMTP'
            ];

        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Error al enviar correo: ' . $e->getMessage(),
                'destinatario' => $to
            ];
        }
    }
}
