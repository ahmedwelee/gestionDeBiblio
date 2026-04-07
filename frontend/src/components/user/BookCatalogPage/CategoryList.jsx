import React, { useEffect, useState } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Ajout de l'icône de chargement
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../../../axiosClient'; // Assurez-vous que le chemin est correct

// Importation des images
import image1 from '../../../assets/website/image1.png';
import image2 from '../../../assets/website/image2.png';
import image3 from '../../../assets/website/image3.png';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // État pour le chargement
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get('/categories')
      .then(response => {
        console.log('RESPONSE API :', response.data);
        setCategories(response.data.slice(0, 3)); // Limite à 3 catégories
        setLoading(false); // Fin du chargement
      })
      .catch(error => {
        console.error("ERROR API :", error);
        setLoading(false); // En cas d'erreur, on arrête le chargement
      });
  }, []);

  const images = [image1, image2, image3];

  // Si le contenu est en cours de chargement
  if (loading) {
    return (
      <div className="text-center py-10 text-lg text-gray-500">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto" /> {/* Icône de chargement */}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white dark:from-midnight-950 dark:to-slate-900 py-10 px-6 font-serif transition-colors duration-500">
      <div className="max-w-screen-lg mx-auto text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-midnight-text mb-4 transition-colors duration-500">Browse Categories</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 transition-colors duration-500">
          Explore a variety of books across different categories to find what interests you.
        </p>

        <div className="flex justify-center space-x-6 mb-0">
          {categories.map((category, index) => (
            <div key={category.id} className="bg-white dark:bg-midnight-card rounded-lg shadow-sm dark:shadow-glass-md hover:shadow-md dark:hover:shadow-glass-lg transition-all duration-300 w-56 border border-slate-200 dark:border-midnight-border/30 hover:border-primary-200 dark:hover:border-primary-500/30">
              <img
                src={images[index % images.length]}
                alt={category.name}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="p-3">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-midnight-text mb-2 transition-colors duration-500">{category.name}</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs mb-3 transition-colors duration-500">{category.description}</p>

                <Link
                  to={`/categories/${category.id}/books`}
                  className="inline-block bg-primary-500 hover:bg-primary-600 text-white py-1 px-2 rounded-md text-sm font-medium transition-all duration-200"
                  onClick={() => navigate(`/categories/${category.id}/books`)}
                >
                  Explore Books
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
