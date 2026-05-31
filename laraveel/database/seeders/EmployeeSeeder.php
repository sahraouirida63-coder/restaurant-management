<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        // FK-safe truncate
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Employee::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $staff = [
            [
                'name'          => 'Sophie Laurent',
                'email'         => 'sophie.laurent@restaurant.com',
                'role'          => 'manager',
                'phone'         => '+1 (555) 201-4432',
                'profile_image' => 'https://i.pravatar.cc/150?u=sophie.laurent@restaurant.com',
            ],
            [
                'name'          => 'Marco Ricci',
                'email'         => 'marco.ricci@restaurant.com',
                'role'          => 'chef',
                'phone'         => '+1 (555) 302-8871',
                'profile_image' => 'https://i.pravatar.cc/150?u=marco.ricci@restaurant.com',
            ],
            [
                'name'          => 'Aisha Ndiaye',
                'email'         => 'aisha.ndiaye@restaurant.com',
                'role'          => 'waiter',
                'phone'         => '+1 (555) 403-5519',
                'profile_image' => 'https://i.pravatar.cc/150?u=aisha.ndiaye@restaurant.com',
            ],
            [
                'name'          => 'Carlos Mendez',
                'email'         => 'carlos.mendez@restaurant.com',
                'role'          => 'cashier',
                'phone'         => '+1 (555) 504-6630',
                'profile_image' => 'https://i.pravatar.cc/150?u=carlos.mendez@restaurant.com',
            ],
            [
                'name'          => 'Emma Thompson',
                'email'         => 'emma.thompson@restaurant.com',
                'role'          => 'stock',
                'phone'         => '+1 (555) 605-7741',
                'profile_image' => 'https://i.pravatar.cc/150?u=emma.thompson@restaurant.com',
            ],
            [
                'name'          => 'James Okafor',
                'email'         => 'james.okafor@restaurant.com',
                'role'          => 'waiter',
                'phone'         => '+1 (555) 706-8852',
                'profile_image' => 'https://i.pravatar.cc/150?u=james.okafor@restaurant.com',
            ],
            [
                'name'          => 'Yuki Tanaka',
                'email'         => 'yuki.tanaka@restaurant.com',
                'role'          => 'chef',
                'phone'         => '+1 (555) 807-9963',
                'profile_image' => 'https://i.pravatar.cc/150?u=yuki.tanaka@restaurant.com',
            ],
            [
                'name'          => 'Lena Fischer',
                'email'         => 'lena.fischer@restaurant.com',
                'role'          => 'delivery',
                'phone'         => '+1 (555) 908-1174',
                'profile_image' => 'https://i.pravatar.cc/150?u=lena.fischer@restaurant.com',
            ],
        ];

        $defaultPassword = Hash::make('password123');

        foreach ($staff as $person) {
            // Upsert User account so they can log in
            User::updateOrCreate(
                ['email' => $person['email']],
                [
                    'name'     => $person['name'],
                    'password' => $defaultPassword,
                    'role'     => $person['role'],
                ]
            );

            // Insert Employee record directly (bypass model boot to avoid double-hashing)
            DB::table('employees')->updateOrInsert(
                ['email' => $person['email']],
                [
                    'name'          => $person['name'],
                    'email'         => $person['email'],
                    'password'      => $defaultPassword,
                    'role'          => $person['role'],
                    'phone'         => $person['phone'],
                    'profile_image' => $person['profile_image'],
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]
            );
        }

        $this->command->info('✅  8 employees seeded successfully (default password: password123).');
    }
}