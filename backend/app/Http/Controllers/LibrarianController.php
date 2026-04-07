<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class LibrarianController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'message' => 'Librarian Dashboard Data',
            'stats' => [
                'users' => 100,
                'books' => 500
            ]
        ]);
    }
}
