<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\BorrowRecord;
use App\Models\RegistrationRequest;
use App\Models\Reservation;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\WaitingList;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function index()
    {
        return response()->json(User::all());
    }

    public function destroy(User $user)
    {
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }
    public function update(Request $request, User $user)
    {
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|in:admin,librarian,user',
            'phone' => 'nullable|string|max:15',
         


        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->messages()], 400);
        }

        if ($request->has('password')) {
            $request->merge(['password' => Hash::make($request->password)]);
        }

        $user->update($request->all());

        return response()->json($user);
    }


    public function getUserById($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }
        return response()->json($user);
    }


    public function updateOwnProfile(Request $request)
{
    $user = $request->user();

    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $user->id,
        'phone' => 'nullable|string|max:20',
       
    ]);

    $user->update($validated);

    return response()->json($user, 200);
}
    public function userStats(Request $request)
    {
        $user = $request->user();
        $activeLoans = $user->borrowRecords()->whereNull('return_date')->count();
        $overdue = $user->borrowRecords()
            ->whereNull('return_date')
            ->where('due_date', '<', now())
            ->count();
        $borrowedBooks = $user->borrowRecords()->whereNotNull('return_date')->count();
        $reservedBooks = $user->reservations()->count();

        return response()->json([
            'active_loans' => $activeLoans,
            'overdue' => $overdue,
            'borrowed_books' => $borrowedBooks,
            'reservation_books' => $reservedBooks,
        ]);
    }

    public function Stats()
    {
        $totalUsers = User::count();
        $totalBooks = Book::count();
        $totalReservations = Reservation::count();
        $overdue = BorrowRecord::whereNull('return_date')
            ->where('due_date', '<', now())
            ->count();
        $activeLoans = BorrowRecord::whereNull('return_date')->count();
        $waitingList = WaitingList::count();


        return response()->json([
            'totalUsers' => $totalUsers,
            'totalBooks' => $totalBooks,
            'totalReservations' => $totalReservations,
            'overdue' => $overdue,
            'activeLoans' => $activeLoans,
            'waitingList' => $waitingList,
        ]);
    }


    public function toggleUser($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();
        return response()->json($user, 200);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect'
            ], 422);
        }

        DB::table('users')->where('id', $user->id)->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
}


