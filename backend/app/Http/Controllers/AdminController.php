<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        if (auth()->user() && auth()->user()->role === 'admin') {
            return response()->json([
                'message' => 'Welcome to the admin dashboard',
                'user' => auth()->user()
            ]);
        } else {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
            }
        }
    }

