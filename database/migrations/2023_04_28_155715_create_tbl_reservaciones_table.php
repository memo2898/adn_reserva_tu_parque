<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_reservaciones', function (Blueprint $table) {
            $table->increments('id');
            $table->integer("id_solicitante");
            $table->string("id_parque");
            $table->string("id_zona");
            $table->double("evento");
            $table->string("fecha_evento");
            $table->string("hora_inicio");
            $table->string("hora_fin");
            $table->string("descripcion_evento");
            $table->string("responsables");
            $table->integer("cantidad_participantes_adultos");
            $table->integer("cantidad_participantes_niños");
            $table->string("codigo_reservacion");
            $table->string("estado");
            $table->timestamps();        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_reservaciones');
    }
};
