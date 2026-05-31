<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use App\Models\Stock;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StockSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create stock for all existing ingredients
        $ingredients = Ingredient::all();

        foreach ($ingredients as $ingredient) {
            Stock::factory()->create([
                'ingredient_id' => $ingredient->id,
                'quantity' => fake()->randomFloat(2, 5, 100),
            ]);
        }
    }
}