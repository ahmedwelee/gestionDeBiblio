import React, { useState, useEffect } from "react";
import axiosClient from "../../../axiosClient";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt, faTrash, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../LibraryDashboard.module.css";

function CategoryTableRow({ index, category, onDelete }) {
  const navigate = useNavigate();
  return (
    <div className="group flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200">
      <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{category.name}</p>
        </div>
        <div className="hidden sm:block">
          <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{category.description}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => navigate(`/admin/dashboard/categories/edit/${category.id}`)}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Edit category"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
            title="Delete category"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function CategoryTable() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get("message");
    if (message) {
      setSuccessMessage(message);
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
    setLoading(true);
      try {
        const response = await axiosClient.get("/categories");
        setCategories(response.data);
        setFilteredCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(term.toLowerCase()) ||
        category.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCategories(filtered);
    setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await axiosClient.delete(`/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
      setFilteredCategories(filteredCategories.filter((category) => category.id !== id));
      setSuccessMessage("Category deleted successfully");
    } catch (error) {
          console.error("Error deleting category:", error);
    }
  };

  const paginatedCategories = filteredCategories.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredCategories.length / perPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-flex items-center gap-2 text-[#274e79]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
          <span className="text-lg font-medium">Loading categories...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
          <svg className="h-5 w-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-sm font-medium text-green-700 dark:text-green-200">{successMessage}</p>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Categories</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage book categories</p>
          </div>
          <Link
            to="/admin/dashboard/categories/add"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors duration-200 shadow-sm hover:shadow-md"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add Category
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1 min-w-0">
          <div className="relative">
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search categories..."
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Per page:</span>
          <select
            value={perPage}
            onChange={(e) => setPerPage(parseInt(e.target.value))}
            className="px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-700 dark:text-slate-300">
          <div>Name</div>
          <div className="hidden sm:block">Description</div>
          <div className="text-right">Actions</div>
        </div>

        <div>
          {paginatedCategories.length > 0 ? (
            paginatedCategories.map((category) => (
              <CategoryTableRow
                key={category.id}
                index={categories.indexOf(category)}
                category={category}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <p className="text-slate-600 dark:text-slate-400 font-medium">No categories found</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{Math.min((page - 1) * perPage + 1, filteredCategories.length)}</span> to <span className="font-semibold text-slate-900 dark:text-white">{Math.min(page * perPage, filteredCategories.length)}</span> of <span className="font-semibold text-slate-900 dark:text-white">{filteredCategories.length}</span> categories
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Previous
          </button>
          <div className="px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white">
            Page {page} of {totalPages || 1}
          </div>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages || totalPages === 0}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

