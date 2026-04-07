<?php

namespace App\Http\Controllers;

use App\Models\RegistrationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;


class RegistrationRequestController extends Controller
{

public function store(Request $request)
{
    // Validate the request with corrected regex handling
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'gmail' => 'required|email|max:255',
        'phone' => [
            'required',
            'regex:/^(\+212|0)([ \-]?[0-9]{2,3}){3}$/',
            'max:15',
        ],
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->messages()], 422);
    }

    $data = $request->all();

    // Normalize the phone number
    $cleanPhone = preg_replace('/[^0-9]/', '', $data['phone']); // remove spaces, dashes, etc.
    if (preg_match('/^0[0-9]{9}$/', $cleanPhone)) {
        $data['phone'] = '+212' . substr($cleanPhone, 1);
    }

    RegistrationRequest::create($data);

    return response()->json(['message' => 'Request sent successfully. We will contact you soon.'], 201);
}


    public function index()
    {
        $requests = RegistrationRequest::all();
        return response()->json($requests, 200);
    }

    public function approve(Request $request, $id)
    {
        $registration = RegistrationRequest::findOrFail($id);

        $generatedPassword = Str::random(8);
        $nameWithoutSpaces = str_replace(' ', '', $registration->name);
        $baseEmail = $nameWithoutSpaces . '@library.com';
        $email = $baseEmail;

        $existingUser = User::where('email', $email)->first();
        if ($existingUser) {
            $i = 1;
            while (User::where('email', substr($email, 0, strpos($email, '@')) . $i . '@' . substr(strrchr($email, '@'), 1))->first()) {
                $i++;
            }
            $email = substr($email, 0, strpos($email, '@')) . $i . '@' . substr(strrchr($email, '@'), 1);
        }

        $user = User::create([
            'name' => $nameWithoutSpaces,
            'email' => $email,
            'phone' => $registration->phone,
            'gmail' => $registration->gmail,
            'password' => Hash::make($generatedPassword),
        ]);

        Mail::to($registration->gmail)->send(new \App\Mail\SendCredentials($user, $generatedPassword));

        $registration->delete();

        return response()->json(['message' => 'User created and password sent to Gmail']);
    }

    public function reject($id)
    {
        $registration = RegistrationRequest::findOrFail($id);
        $registration->delete();

        return response()->json(['message' => 'Registration request rejected']);
    }

}

