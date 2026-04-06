import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />

        <main className="pt-20"> 
          <Routes>
            <Route path="/" element={<Login />} />
            
            {/* On utilise uniquement des minuscules ici (Standard Web) */}
            <Route path="/register" element={<Register />} />
            
            {/* OPTIONNEL : Rediriger automatiquement /Register vers /register */}
            <Route path="/Register" element={<Navigate to="/register" replace />} />
          </Routes>
        </main>

        <footer className="text-center py-8 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
          EST Kénitra - Projet PFE 2026
        </footer>
      </div>
    </Router>
  );
}

export default App;