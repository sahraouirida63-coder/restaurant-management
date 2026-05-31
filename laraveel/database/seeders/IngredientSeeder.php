<?php

namespace Database\Seeders;

use App\Models\Ingredient;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class IngredientSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ingredients = [
            ['name' => 'Tomato', 'quantity' => 50],
            ['name' => 'Mozzarella Cheese', 'quantity' => 20],
            ['name' => 'Fresh Basil', 'quantity' => 5],
            ['name' => 'Olive Oil', 'quantity' => 10],
            ['name' => 'Pepperoni', 'quantity' => 15],
            ['name' => 'Ground Beef', 'quantity' => 25],
            ['name' => 'Chicken Breast', 'quantity' => 30],
            ['name' => 'Lettuce', 'quantity' => 20],
            ['name' => 'Cucumber', 'quantity' => 15],
            ['name' => 'Feta Cheese', 'quantity' => 10],
            ['name' => 'Spaghetti', 'quantity' => 40],
            ['name' => 'Heavy Cream', 'quantity' => 12],
            ['name' => 'Parmesan Cheese', 'quantity' => 15],
            ['name' => 'Salmon Fillet', 'quantity' => 20],
            ['name' => 'Beef Steak', 'quantity' => 15],
            ['name' => 'Potatoes', 'quantity' => 50],
            ['name' => 'Flour', 'quantity' => 30],
            ['name' => 'Eggs', 'quantity' => 100],
            ['name' => 'Milk', 'quantity' => 25],
            ['name' => 'Butter', 'quantity' => 20],
            ['name' => 'Onions', 'quantity' => 30],
            ['name' => 'Garlic', 'quantity' => 15],
            ['name' => 'Bell Peppers', 'quantity' => 20],
            ['name' => 'Mushrooms', 'quantity' => 15],
            ['name' => 'Black Olives', 'quantity' => 10],
            ['name' => 'Bread', 'quantity' => 40],
            ['name' => 'Chocolate', 'quantity' => 8],
            ['name' => 'Sugar', 'quantity' => 20],
            ['name' => 'Salt', 'quantity' => 10],
            ['name' => 'Black Pepper', 'quantity' => 5],
        ];

        foreach ($ingredients as $ingredient) {
            Ingredient::create($ingredient);
        }

        // Create additional random ingredients
        Ingredient::factory(20)->create();
    }
}