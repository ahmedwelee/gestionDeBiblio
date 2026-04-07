<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Can;

class CategoryController extends Controller
{

    public function index()
    {
        return response()->json(Category::all());
    }


    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
        ]);
        if ($validator->fails()) {
             return response()->json(['error' => $validator->messages()], 422);
        }

        $category = Category::create($request->all());

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ]);
    }


    public function show(Category $category)
    {

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        return response()->json($category);
    }


    public function update(Request $request,Category $category)
    {

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'description' => 'required|string',
        ]);
        if ($validator->fails()) {
          return response()->json(['errors' => $validator->messages()], 422);
        }

        $category->update($request->all());

        return response()->json([
            'message' => 'Category updated successfully',
            'category' => $category
        ]);
    }


    public function destroy(Category $category)
    {

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }

    public function books($categoryId)
    {
        $category = Category::findOrFail($categoryId);

        return response()->json(['category' => $category, 'books' => $category->books]);
    }
}
