export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-bold mb-4">Zaro<span className="text-blue-600">Fashion</span></h3>
          <p className="text-gray-500 text-sm">
            Deine neue Lieblingsmarke für moderne Streetwear und Accessoires.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Kategorien</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-black">T-Shirts</a></li>
            <li><a href="#" className="hover:text-black">Hoodies</a></li>
            <li><a href="#" className="hover:text-black">Accessoires</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Rechtliches</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-black">Impressum</a></li>
            <li><a href="#" className="hover:text-black">Datenschutz</a></li>
            <li><a href="#" className="hover:text-black">AGB</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-gray-900">Newsletter</h4>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Deine E-Mail" 
              className="px-4 py-2 bg-white border border-gray-200 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
            />
            <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors">
              Anmelden
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Zaro Fashion. Alle Rechte vorbehalten.
      </div>
    </footer>
  );
}
