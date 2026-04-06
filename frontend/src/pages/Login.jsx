import React, { useState } from 'react';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // 👈 AJOUTE CETTE LIGNE (Import)
import api from '../api/axios';

const Login = () => {
    const navigate = useNavigate(); // 👈 AJOUTE CETTE LIGNE (Initialisation)
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const response = await api.post('/login', { email, password });
            console.log("Connecté !", response.data);
            navigate('/dashboard'); // Rediriger après succès
        } catch (err) {
            setError("Les identifiants ne sont pas valides.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100 transition-all duration-300">
                
                <div className="text-center mb-10 flex flex-col items-center gap-4">
                    <div className="relative">
                        <img 
                            src="https://secure.gravatar.com/avatar/60ac2946c6b4539828236d39691b0c03?s=128&d=mm&r=g" 
                            alt="Profil" 
                            className="w-24 h-24 rounded-full shadow-md object-cover border-4 border-blue-50"
                        />
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow">✔</div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">BIBLIOTHEQUE</h2>
                        <p className="text-gray-500 mt-2 text-sm max-w-xs">Connectez-vous pour accéder à votre espace universitaire.</p>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-center gap-2 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-2.5 ml-1">Email</label>
                        <div className="relative">
                            <FiMail className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                                type="email" required
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                placeholder="prenom.nom@bib.com"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="group">
                        <div className="flex justify-between items-center mb-2.5 ml-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mot de passe</label>
                            <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition">Oublié ?</a>
                        </div>
                        <div className="relative">
                            <FiLock className="absolute top-4 left-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                            <input 
                                type={showPassword ? "text" : "password"} required
                                className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                type="button"
                                className="absolute top-4 right-4 text-gray-400"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-blue-100"
                    >
                        {loading ? "Vérification..." : "Se connecter"}
                        {!loading && <FiLogIn size={18} />}
                    </button>

                    <div className="mt-8 text-center pt-6 border-t border-gray-50">
                        <p className="text-xs text-gray-400 mb-2 uppercase font-bold tracking-widest">Nouveau ici ?</p>
                        <button 
                            type="button" 
                            onClick={() => navigate('/register')} // 👈 Maintenant ça va marcher !
                            className="text-blue-600 font-extrabold hover:text-blue-800 transition-colors uppercase text-sm tracking-tighter underline-offset-4 hover:underline"
                        >
                            Créer mon profil utilisateur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;