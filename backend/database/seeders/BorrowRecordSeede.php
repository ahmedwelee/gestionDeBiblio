<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BorrowRecord;
use Carbon\Carbon;

class BorrowRecordSeede extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BorrowRecord::create([
            'user_id' => 2,
            'book_id' => 1,
            'borrow_date' => Carbon::parse('2025-05-20'),
            'due_date' => Carbon::parse('2025-05-27'),
            'return_date' => null
        ]);
    }
}