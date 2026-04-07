<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'phone' => '+212612345678',
            'role' => 'admin',
        ]);
        User::create([
            'name' => ' User',
            'email' => 'user@example.com',
            'password' => Hash::make('password'),
            'phone' => '+212612345679',
            'role' => 'user',
        ]);



        User::factory()->count(10)->create();
    }
}
