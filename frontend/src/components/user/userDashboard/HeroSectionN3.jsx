import React from 'react';
import bgImage from '../../../assets/website/library.jpg'; // Assurez-vous que le chemin est correct
import { useTheme } from '../../../context/ThemeContext';

const HeroSectionN3 = () => {
    const { isDarkMode } = useTheme();

    return (
        <section className="relative h-64">
          {/* Image de fond */}
          <img
            src={bgImage}
            alt="Library background"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
    
          {/* Overlay sombre + texte */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-black bg-opacity-50' : 'bg-black bg-opacity-30'} flex flex-col justify-center items-center text-center text-white px-4`}>
            <h1 className="text-3xl font-bold font-serif mb-2">Welcome to Your Dashboard</h1>
            <p className="text-base font-serif max-w-md">
            Manage your library experience seamlessly and efficiently.
            </p>
          </div>
        </section>
  );
};

export default HeroSectionN3;