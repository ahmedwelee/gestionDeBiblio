const Navbar = () => {
  return (
    <nav className="bg-white border-b p-4 flex justify-between items-center shadow-sm">
      <h1 className="font-bold text-xl text-blue-600">BIBLIOTHEQUE</h1>
      <div className="space-x-4">
        <span className="text-gray-600">Accueil</span>
        <span className="text-gray-600">Livres</span>
      </div>
    </nav>
  );
};

export default Navbar;