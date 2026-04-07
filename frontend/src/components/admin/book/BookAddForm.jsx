import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../../../axiosClient";
import styles from "../../../LibraryDashboard.module.css";

export default function BookAddForm() {
    const [title, setTitle] = useState("");
    const [author_id, setAuthorId] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0); 
    const [image, setImage] = useState(null);
    const [category_id, setCategoryId] = useState("");
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAuthors = async () => {
            const response = await axiosClient.get('/authors');
            setAuthors(response.data);
        };

        const fetchCategories = async () => {
            const response = await axiosClient.get('/categories');
            setCategories(response.data);
        };

        fetchAuthors();
        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('author_id', author_id);
        formData.append('description', description);
        formData.append('quantity', quantity);
        formData.append('price', price);
        formData.append('image', image);
        formData.append('category_id', category_id);

        try {
            const response = await axiosClient.post("/books/create", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setError({});
            window.location.href = "/admin/dashboard/books?message=Book added successfully";
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setError(error.response.data.error || {});
            } else {
                setError({ general: "An unexpected error occurred. Please try again later." });
                console.log(error);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-midnight-card p-8 rounded-xl shadow-xl dark:shadow-glass-lg border border-slate-200 dark:border-midnight-border transition-colors duration-500">
            <header className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-midnight-border">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-primary to-brand-primary-dark bg-clip-text text-transparent">Add Book</h2>
                <Link to="/admin/dashboard/books" className="p-2 hover:bg-slate-100 dark:hover:bg-midnight-border rounded-full transition-all duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-slate-400 transition-colors duration-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 2.293a1 1 0 011.414 0l8 8a1 1 0 010 1.414l-8 8a1 1 0 01-1.414-1.414L16.586 11H3a1 1 0 110-2h13.586l-6.293-6.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </Link>
            </header>
            
            <div className="space-y-6">
                {loading && (
                    <div className="text-center py-4 bg-white/80 dark:bg-midnight-card/80 rounded-xl backdrop-blur">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                        <p className="mt-2 text-gray-500 dark:text-slate-400 font-medium">Processing...</p>
                    </div>
                )}
                
                {error.general && (
                    <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 dark:border-red-600 p-4 rounded-md">
                        <p className="text-red-700 dark:text-red-400 text-sm">{error.general}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                        placeholder="Enter book title"
                    />
                        {error.title && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.title[0]}</p>}
                </div>

                    <div className="space-y-2">
                        <label htmlFor="author_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Author</label>
                    <select
                        id="author_id"
                        name="author_id"
                        value={author_id}
                        onChange={(e) => setAuthorId(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                    >
                        <option value="">Select Author</option>
                            {authors.map(author => (
                            <option key={author.id} value={author.id}>{author.name}</option>
                        ))}
                    </select>
                        {error.author_id && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.author_id[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Category</label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={category_id}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {error.category_id && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.category_id[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Quantity</label>
                        <input
                            type="number"
                            id="quantity"
                            name="quantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                            placeholder="Enter quantity"
                        />
                        {error.quantity && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.quantity[0]}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                            placeholder="Enter price"
                        />
                        {error.price && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.price[0]}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-midnight-border bg-white dark:bg-midnight-800 text-gray-900 dark:text-slate-200 focus:ring-2 focus:ring-brand-primary dark:focus:ring-brand-primary focus:border-transparent transition duration-200"
                        placeholder="Enter book description"
                    />
                    {error.description && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.description[0]}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-slate-300 transition-colors duration-500">Book Cover</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-midnight-border rounded-lg hover:border-brand-primary dark:hover:border-brand-primary bg-gray-50 dark:bg-midnight-800/50 transition-colors duration-200">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-600 dark:text-slate-400">
                                <label htmlFor="image" className="relative cursor-pointer bg-white dark:bg-midnight-card rounded-md font-medium text-brand-primary dark:text-brand-primary hover:text-brand-primary-dark dark:hover:text-brand-light focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-primary transition-colors duration-300">
                                    <span>Upload a file</span>
                    <input
                        id="image"
                        name="image"
                        type="file"
                        onChange={(e) => setImage(e.target.files[0])}
                        className="sr-only"
                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-slate-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                    {error.image && <p className="text-red-500 dark:text-red-400 text-xs mt-1">{error.image[0]}</p>}
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-primary-dark hover:from-brand-primary-dark hover:to-brand-primary text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-midnight-card focus:ring-brand-primary transition duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                <span>Adding Book...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Add Book</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}

