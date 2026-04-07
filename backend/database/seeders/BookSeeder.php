<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void{
    // Create books with dummy images
    $authors = Author::all();
    $categories = Category::all();

    $dummyImages = ['book1.jpg', 'book2.jpg', 'book3.jpg', 'book4.jpg', 'book5.jpg', 'book6.jpg', 'book7.jpg', 'book8.jpg', 'book9.jpg', 'book10.jpg'];

    foreach (range(1, 10) as $i) {
        $filename = Str::random(40) . '.jpg';
        $source = database_path('seeders/images/' . $dummyImages[array_rand($dummyImages)]);
        $destination = 'images/books/' . $filename;

        Storage::disk('public')->put($destination, file_get_contents($source));

        // Set specific quantities for Book 1 and Book 2
        $quantity = match($i) {
            1 =>0 ,  // Book 1 will have quantity 0
            2 => 1,  // Book 2 will have quantity 1
            default => rand(1, 50)  // Other books will have random quantities
        };

        Book::create([
            'title' => "Book $i",
            'description' => "Description for Book $i",
            'author_id' => $authors->random()->id,
            'price' => rand(1,10),
            'category_id' => $categories->random()->id,
            'quantity' => $quantity,
            'image' => $destination,
        ]);
    }

    }
}



