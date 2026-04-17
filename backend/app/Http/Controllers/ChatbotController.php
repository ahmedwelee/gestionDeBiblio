<?php

namespace App\Http\Controllers;

use App\Services\ChatbotService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatbotController extends Controller
{
    /**
     * Process chatbot message
     */
    public function message(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'message' => 'required|string|max:500',
        ]);

        $language = $user->language_preference ?? 'en';
        $chatbotService = new ChatbotService($user, $language);
        $response = $chatbotService->processMessage($validated['message']);

        return response()->json([
            'success' => true,
            'message' => $validated['message'],
            'response' => $response,
            'language' => $language,
        ]);
    }

    /**
     * Update user language preference
     */
    public function setLanguage(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validated = $request->validate([
            'language' => 'required|string|in:en,ar,fr',
        ]);

        $user->update([
            'language_preference' => $validated['language'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Language preference updated',
            'language' => $user->language_preference,
        ]);
    }

    /**
     * Get library context data for chatbot
     */
    public function getContext(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $borrowRecords = $user->borrowRecords()
            ->with('book')
            ->where('return_date', null)
            ->get()
            ->map(function ($record) {
                return [
                    'book_title' => $record->book->title,
                    'borrowed_at' => $record->borrowed_date,
                    'due_date' => $record->due_date,
                ];
            });

        $reservations = $user->reservations()
            ->with('book')
            ->get()
            ->map(function ($reservation) {
                return [
                    'book_title' => $reservation->book->title,
                    'reserved_at' => $reservation->created_at,
                ];
            });

        return response()->json([
            'success' => true,
            'context' => [
                'user_name' => $user->name,
                'current_borrows' => $borrowRecords,
                'reservations' => $reservations,
                'language' => $user->language_preference ?? 'en',
            ],
        ]);
    }
}

