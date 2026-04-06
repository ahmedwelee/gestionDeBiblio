<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:admin,librarian,user',
            'phone' => 'nullable|string|max:15',

        ]);
        if ($validator->fails()) {

            return response()->json(['error' => $validator->messages()], 422);


        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ], 201);
    }


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            // Return validation errors keyed by input names
            return response()->json(['errors' => $validator->messages()], 422);
        }

        $credentials = $validator->validated();
        $user = User::where('email', $credentials['email'])->first();
        if ($user->is_active == 0) {
            return response()->json(['message' => 'Your account is inactive. Please contact the administrator.'], 403);
        }

        if (!Auth::attempt($credentials)) {
            // Return a generic error, don't specify if email or password is wrong
            return response()->json(['message' => 'Incorrect email or password.'], 401);
        }

        $request->session()->regenerate();

        return response()->json(Auth::user());
    }


    public function logout(Request $request)
    {
        auth()->guard('web')->logout();
        return response()->json(['message' => 'Logged out']);

    }
}
