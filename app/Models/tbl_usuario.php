<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tbl_usuario extends Model
{
    use HasFactory;
        /**
     * The connection name for the model.
     *
     * @var string
     */


    protected $connection = 'ADN_reservaciones';
    protected $table = "tbl_usuario";

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id_parque',
        'id_user_type',
        'id_tipo_doc',
        'documento',
        'nombre',
        'apellido',
        'correo',
        'telefono',
        'usuario',
        'password',
        'imagen_url',
        'imagen_size',
        'imagen_formato',
        'agregado_por',
        'modificado_por',
        'estado',
    ];

    //public $timestamps = false;
    const CREATED_AT = 'agregado_en';
    const UPDATED_AT = 'modificado_en';
    public static function boot(){
        parent::boot();
        static::creating(function($model){
            $model->agregado_en = now();
        });
        static::updating(function($model){
            $model->modificado_en = now();
        });
    }
}
