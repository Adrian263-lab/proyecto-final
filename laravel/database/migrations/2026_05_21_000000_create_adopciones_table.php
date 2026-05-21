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
        Schema::create('adopciones', function (Blueprint $table) {
            $table->id();
            
            // Relaciones con Usuario y Animal
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('animal_id')->constrained('animals')->onDelete('cascade');
            
            // Campos del cuestionario de adopción
            $table->string('tipo_vivienda');
            $table->boolean('tiene_jardin');
            $table->string('otras_mascotas');
            $table->integer('horas_solo');
            $table->text('motivo');
            
            // Estado de la solicitud
            $table->enum('estado', ['Pendiente', 'Aprobada', 'Rechazada'])->default('Pendiente');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adopciones');
    }
};