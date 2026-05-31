<?php

namespace Database\Seeders;

use App\Models\Recipe;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RecipeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $recipes = [
            [
                'name' => 'Classic Margherita Pizza',
                'instructions' => '1. Preheat oven to 475°F. 2. Roll out pizza dough. 3. Spread tomato sauce. 4. Add mozzarella cheese. 5. Top with fresh basil. 6. Bake for 12-15 minutes.',
            ],
            [
                'name' => 'Spaghetti Carbonara',
                'instructions' => '1. Cook spaghetti in salted water. 2. Cook pancetta until crispy. 3. Whisk eggs with parmesan. 4. Combine hot pasta with egg mixture. 5. Add pancetta and black pepper. 6. Serve immediately.',
            ],
            [
                'name' => 'Grilled Salmon',
                'instructions' => '1. Season salmon with salt and pepper. 2. Heat grill to medium-high. 3. Grill salmon skin-side down for 4-5 minutes. 4. Flip and cook for another 4-5 minutes. 5. Serve with lemon and herbs.',
            ],
            [
                'name' => 'Caesar Salad',
                'instructions' => '1. Wash and chop romaine lettuce. 2. Make dressing with garlic, anchovies, egg yolk, parmesan, and olive oil. 3. Toss lettuce with dressing. 4. Add croutons and more parmesan. 5. Serve chilled.',
            ],
            [
                'name' => 'Chocolate Cake',
                'instructions' => '1. Preheat oven to 350°F. 2. Mix flour, sugar, cocoa, baking powder. 3. Add eggs, milk, oil, vanilla. 4. Bake for 30-35 minutes. 5. Cool and frost with chocolate icing.',
            ],
        ];

        foreach ($recipes as $recipe) {
            Recipe::create($recipe);
        }

        // Create additional random recipes
        Recipe::factory(15)->create();
    }
}