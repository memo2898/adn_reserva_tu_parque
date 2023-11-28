<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class tbl_imagenes_por_parque extends Model
{
    use HasFactory;
        /**
     * The connection name for the model.
     *
     * @var string
     */
    //protected $connection = 'Reservaciones_p';
    //protected $table = "tbl_reservaciones";


    protected $connection = 'ADN_reservaciones';
    protected $table = "tbl_imagenes_por_parque";


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
