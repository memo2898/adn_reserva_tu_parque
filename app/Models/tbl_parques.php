<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tbl_parques extends Model
{
    use HasFactory;
        /**
     * The connection name for the model.
     *
     * @var string
     */


    protected $connection = 'ADN_reservaciones';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nombre_parque',
        'id_parque_ADN',
        'descripcion',
        'correo',
        'provincia',
        'municipio',
        'sector',
        'circunscripcion',
        'coordenadas_maps',
        'direccion',
        'portada_url',
        'portada_size',
        'portada_formato',
        'espera',
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
