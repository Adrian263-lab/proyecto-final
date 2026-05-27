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
        Schema::create('valoraciones', function (Blueprint $table) {
            $table->id();
            
            // Usuario que realiza la valoración (Particular)
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            
            // Protectora que recibe la valoración
            $table->foreignId('protectora_id')->constrained('users')->onDelete('cascade');
            
            // Puntuación del 1 al 5
            $table->integer('puntuacion')->unsigned()->default(5);
            
            // Comentario opcional
            $table->text('comentario')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('valoraciones');
    }
};