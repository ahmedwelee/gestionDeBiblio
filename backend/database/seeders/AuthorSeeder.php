<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Author::insert([
            ['name' => 'George Orwell', 'piography' => 'English novelist.'],
            ['name' => 'Jane Austen', 'piography' => 'British author.'],
            ['name' => 'Chinua Achebe', 'piography' => 'Nigerian writer.'],
        ]);
    }
}
