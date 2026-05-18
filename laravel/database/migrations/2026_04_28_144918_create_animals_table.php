<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    Schema::create('animals', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->foreignId('especie_id')->constrained('especies')->onDelete('cascade');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('raza')->nullable();
        $table->string('estado'); 
        $table->text('descripcion')->nullable(); // Verifica que se llame igual que en el modelo
        $table->string('imagen_url')->nullable(); 
        $table->timestamps();
    });
}

    public function down(): void
    {
        Schema::dropIfExists('animals');
    }
};
