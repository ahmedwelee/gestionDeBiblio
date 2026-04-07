import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from "../../../axiosClient";
import styles from "../../../LibraryDashboard.module.css";

export default function BookEditForm() {
    const { id } = useParams();
    const [title, setTitle] = useState("");
    const [author_id, setAuthorId] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [category_id, setCategoryId] = useState("");
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            const response = await axiosClient.get(`/books/${id}`);
            setTitle(response.data.title);
            setAuthorId(response.data.author_id);
            setDescription(response.data.description);
            setQuantity(response.data.quantity);
            setPrice(response.data.price);
            setCategoryId(response.data.category_id);
            setExistingImage(response.data.image);
        };

        const fetchAuthors = async () => {
            const response = await axiosClient.get('/authors');
            setAuthors(response.data);
        };

        const fetchCategories = async () => {
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        };

        fetchBook();
        fetchAuthors();
        fetchCategories();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', title);
        formData.append('author_id', author_id);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        if (image instanceof File) {
            formData.append('image', image);
        }
        formData.append('category_id', category_id);

        try {
            const response = await axiosClient.post(`/books/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setError({});
            window.location.href = "/admin/dashboard/books?message=Book updated successfully";
        } catch (error) {
            if (error.response?.status === 422) {
                setError(error.response.data.errors);
            } else {
                setError({ general: "An unexpected error occurred. Please try again later." });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-6">
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="backdrop-blur-xl bg-white/60 shadow-xl rounded-3xl p-8 border border-gray-100">
                    <header className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#274e79] to-[#1a3b5c] bg-clip-text text-transparent">
                                Edit Book
                            </h2>
                            <p className="text-gray-500 mt-1">Update book information</p>
                        </div>
                        <Link 
                            to="/admin/dashboard/books" 
                            className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 2.293a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-8 8a1 1 0 01-1.414-1.414L16.586 11H3a1 1 0 110-2h13.586l-6.293-6.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </header>

                    <div className="space-y-6">
                        {loading && (
                            <div className="flex items-center justify-center py-4 bg-white/80 rounded-xl backdrop-blur">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-[3px] border-current border-t-transparent text-[#274e79] transition-colors duration-200"></div>
                                <p className="ml-3 text-[#274e79] font-medium">Processing...</p>
                            </div>
                        )}

                        {error.general && (
                            <div className="bg-red-50/50 backdrop-blur border-l-4 border-red-400 p-4 rounded-lg">
                                <p className="text-red-700 text-sm">{error.general}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                    />
                                </div>
                                {error.title && <p className="text-red-500 text-xs mt-1">{error.title[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <select
                                        id="author_id"
                                        value={author_id}
                                        onChange={(e) => setAuthorId(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                    >
                        <option value="">Select Author</option>
                        {authors.map(author => (
                            <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                    </select>
                                </div>
                                {error.author_id && <p className="text-red-500 text-xs mt-1">{error.author_id[0]}</p>}
                            </div>

                            <div className="relative">
                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <select
                                        id="category_id"
                                        value={category_id}
                                        onChange={(e) => setCategoryId(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                {error.category_id && <p className="text-red-500 text-xs mt-1">{error.category_id[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                    />
                                </div>
                                {error.quantity && <p className="text-red-500 text-xs mt-1">{error.quantity[0]}</p>}
                </div>

                            <div className="relative">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <input
                                        type="number"
                                        id="price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.valueAsNumber)}
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200"
                                    />
                                </div>
                                {error.price && <p className="text-red-500 text-xs mt-1">{error.price[0]}</p>}
                </div>

                            <div className="relative md:col-span-2">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#274e79] to-[#1a3b5c] rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-200"></div>
                                    <textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="4"
                                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300 bg-white/70 backdrop-blur focus:bg-white focus:ring-2 focus:ring-[#274e79] focus:border-transparent transition duration-200 resize-none"
                                    />
                                </div>
                                {error.description && <p className="text-red-500 text-xs mt-1">{error.description[0]}</p>}
                </div>

                            <div className="relative md:col-span-2">
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Book Cover</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#274e79] transition-colors duration-200">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-[#274e79] hover:text-[#1a3b5c] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#274e79]">
                                                <span>Upload a file</span>
                                                <input
                                                    id="image"
                                                    type="file"
                                                    onChange={(e) => setImage(e.target.files[0])}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                                {image && <img src={URL.createObjectURL(image)} alt="preview" className="mt-4 h-32 w-32 object-cover rounded-lg" />}
                    {!image && existingImage && (
                        <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/storage/${existingImage}`}
                            alt="Current"
                                        className="mt-4 h-32 w-32 object-cover rounded-lg"
                        />
                    )}
                                {error.image && <p className="text-red-500 text-xs mt-1">{error.image[0]}</p>}
                            </div>
                </div>

                        <div className="flex justify-end pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="relative inline-flex items-center px-6 py-3 overflow-hidden text-white rounded-xl group bg-gradient-to-r from-[#274e79] to-[#1a3b5c] hover:from-[#1a3b5c] hover:to-[#274e79] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/80 border-t-transparent"></div>
                                        <span className="ml-2">Updating Book...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                        </svg>
                                        <span className="ml-2">Update Book</span>
                                    </>
                                )}
                            </button>
                        </div>
                </div>
        </form>
            </div>
        </div>
    );
}

