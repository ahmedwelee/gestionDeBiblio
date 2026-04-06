import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiCheckCircle, FiArrowLeft, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'; // 👈👈👈 AJOUT FiEye, FiEyeOff, FiPhone
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
    const navigate = useNavigate();
    
    // États pour gérer la visibilité des mots de passe
    const [showPassword, setShowPassword] = useState(false); // 👈👈👈 AJOUT
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈👈👈 AJOUT

    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '', // Nouveau champ
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            return setError("Les mots de passe ne correspondent pas.");
        }

        setLoading(true);
        try {
            // Envoi des données vers le Laravel de ton ami
            await api.post('/register', formData);
            alert("Compte créé avec succès ! Connectez-vous maintenant.");
            navigate('/'); 
        } catch (err) {
            setError("Erreur : Vérifiez votre connexion ou si l'email existe déjà.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100 transition-all duration-300">
                
                {/* Header Style "EST BIBLIOTHEQUE" */}
                <div className="text-center mb-10 flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                        <FiUser size={40} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight uppercase">Créer mon profil</h2>
                        <p className="text-gray-500 mt-1 text-sm font-semibold uppercase tracking-widest text-blue-600">EST BIBLIOTHEQUE</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">Nom</label>
                            <div className="relative">
                                <FiUser className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" />
                                <input 
                                    type="text" required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    placeholder="Ex: Alami"
                                    onChange={(e) => setFormData({...formData, nom: e.target.value})}
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">Prénom</label>
                            <div className="relative">
                                <FiUser className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" />
                                <input 
                                    type="text" required
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    placeholder="Ex: Ahmed"
                                    onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">Adresse Email</label>
                        <div className="relative">
                            <FiMail className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" />
                            <input 
                                type="email" required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="nom.prenom@bib.com" // 👈👈👈 MODIFICATION placeholder
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Téléphone (Corrigé avec l'icône) */}
                    <div className="group">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">N° Téléphone</label>
                        <div className="relative">
                            <FiPhone className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" /> {/* 👈👈👈 AJOUT ICÔNE */}
                            <input 
                                type="tel" required
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="06 00 00 00 00"
                                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Passwords avec option de visibilité */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Mot de passe initial */}
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">Mot de passe</label>
                            <div className="relative">
                                <FiLock className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" />
                                <input 
                                    type={showPassword ? "text" : "password"} required // 👈👈👈 MODIFICATION type dynamique
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                />
                                {/* Bouton pour voir le password */}
                                <button 
                                    type="button"
                                    className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 transition"
                                    onClick={() => setShowPassword(!showPassword)} // 👈👈👈 AJOUT ACTION
                                >
                                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />} {/* 👈👈👈 ICÔNE DYNAMIQUE */}
                                </button>
                            </div>
                        </div>
                        {/* Confirmation de mot de passe */}
                        <div className="group">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1 tracking-wider">Confirmation</label>
                            <div className="relative">
                                <FiCheckCircle className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-blue-500" />
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} required // 👈👈👈 MODIFICATION type dynamique
                                    className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                    onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                />
                                {/* Bouton pour voir la confirmation */}
                                <button 
                                    type="button"
                                    className="absolute top-3.5 right-4 text-gray-400 hover:text-gray-600 transition"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // 👈👈👈 AJOUT ACTION
                                >
                                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />} {/* 👈👈👈 ICÔNE DYNAMIQUE */}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Bouton Inscription */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 disabled:bg-blue-300 mt-4 shadow-blue-100"
                    >
                        {loading ? "Création en cours..." : "S'inscrire maintenant"}
                    </button>

                    {/* Lien retour */}
                    <button 
                        type="button" 
                        onClick={() => navigate('/')} 
                        className="w-full flex items-center justify-center gap-2 text-xs text-gray-400 font-bold hover:text-blue-600 transition uppercase tracking-widest mt-4"
                    >
                        <FiArrowLeft size={14} /> Retour à la connexion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;