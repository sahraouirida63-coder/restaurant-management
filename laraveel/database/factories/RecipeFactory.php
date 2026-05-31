<?php

namespace Database\Factories;

use App\Models\Recipe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Recipe>
 */
class RecipeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Classic Margherita Pizza', 'Pepperoni Pizza', 'Chicken Burger',
                'Spaghetti Carbonara', 'Grilled Salmon', 'Caesar Salad',
                'Chocolate Cake', 'Chicken Alfredo', 'Fish and Chips'
            ]),
            'instructions' => fake()->paragraphs(3, true),
        ];
    }
}