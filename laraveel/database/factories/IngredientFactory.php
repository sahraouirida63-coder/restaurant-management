<?php

namespace Database\Factories;

use App\Models\Ingredient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Ingredient>
 */
class IngredientFactory extends Factory
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
                'Tomato', 'Mozzarella Cheese', 'Fresh Basil', 'Olive Oil', 'Pepperoni',
                'Ground Beef', 'Chicken Breast', 'Lettuce', 'Cucumber', 'Feta Cheese',
                'Spaghetti', 'Heavy Cream', 'Parmesan Cheese', 'Salmon Fillet',
                'Beef Steak', 'Potatoes', 'Flour', 'Eggs', 'Milk', 'Butter',
                'Onions', 'Garlic', 'Bell Peppers', 'Mushrooms', 'Black Olives'
            ]),
            'quantity' => fake()->randomFloat(2, 0.5, 10),
        ];
    }
}