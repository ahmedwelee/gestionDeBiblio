<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        
        Category::insert([
            ['name' => 'Fiction', 'description' => 'Fictional books'],
            ['name' => 'History', 'description' => 'Historical content'],
            ['name' => 'Philosophy', 'description' => 'Philosophical ideas'],
            ['name' => 'Science', 'description' => 'Scientific research'],
        ]);
    }
}
