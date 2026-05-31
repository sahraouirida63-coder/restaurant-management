<?php

namespace Database\Factories;

use App\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MenuItem>
 */
class MenuItemFactory extends Factory
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
                'Margherita Pizza', 'Pepperoni Pizza', 'Chicken Burger', 'Beef Burger',
                'Caesar Salad', 'Greek Salad', 'Spaghetti Carbonara', 'Chicken Alfredo',
                'Grilled Salmon', 'Steak Frites', 'Chicken Wings', 'Fish and Chips',
                'Tiramisu', 'Chocolate Cake', 'Ice Cream Sundae', 'Cheesecake',
                'French Fries', 'Onion Rings', 'Mozzarella Sticks', 'Garlic Bread'
            ]),
            'price' => fake()->randomFloat(2, 5.99, 25.99),
            'category' => fake()->randomElement(['pizza', 'burger', 'salad', 'pasta', 'seafood', 'meat', 'dessert', 'appetizer']),
        ];
    }
}