<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('apadrinamientos', function (Blueprint $table) {
            $table->id();
            // El usuario que pone el dinero
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            // El animal que recibe la ayuda
            $table->foreignId('animal_id')->constrained('animals')->onDelete('cascade');
            
            $table->decimal('cuota_mensual', 8, 2); // Ejemplo: 20.50
            $table->date('fecha_inicio');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('apadrinamientos');
    }
};
