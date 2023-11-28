<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservacionMaker_qr extends Mailable
{
    use Queueable, SerializesModels;

    public $datosReservacion;

    /**
     * Create a new message instance.
     *
     * @param  array  $datosReservacion
     * @return void
     */
    public function __construct(array $datosReservacion)
    {
        $this->datosReservacion = $datosReservacion;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        //return $this->view('email_view')
        return $this->view('Stripo')
        //return $this->view('stripo_confirmacion')
            ->subject('Asunto del correo')
            ->with('datosReservacion', $this->datosReservacion);
    }
}
