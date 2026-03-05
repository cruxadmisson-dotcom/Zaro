'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X } from 'lucide-react';
import { useState } from 'react';
import { useShop } from '@/context/ShopContext';

// Menu Data Structure
interface MenuCategory {
  Kleidung?: string[];
  Accessories?: string[];
  Highlights?: string[];
  Brands?: string[];
  Images: { src: string; title: string }[];
}

const MENU_DATA: Record<string, MenuCategory> = {
  Herren: {
    Kleidung: [
      'Jacken', 'Daunenjacken', 'Hybrid', 'Bomberjacken', 'Knitwear', 
      'Polos & T-Shirts', 'Fleeces', 'Hosen', 'Overshirts', 'Westen', 
      'Lederjacken', 'Regenjacken', 'Parka-Jacke', 'Ski', 'Alles anzeigen'
    ],
    Accessories: [
      'Taschen & Rucksäcke', 'Mütze', 'Handschuhe', 'Schals', 'Alles anzeigen'
    ],
    Highlights: [
      'A Family Portrait', 'Cold Comforts', 'Urban Tech', 'Ready to Wear', 'Icons'
    ],
    Images: [
      { src: '/images/100155723917002_0_1768176000000.webp', title: 'A FAMILY PORTRAIT' },
      { src: '/images/100155723912000_0_1768953600000.webp', title: 'COLD COMFORTS' },
      { src: '/images/100155723913000_0_1704286931723.webp', title: 'VOGUE KOREA X PARAJUMPERS' }
    ]
  },
  Damen: {
    Kleidung: [
      'Jacken', 'Daunenjacken', 'Mäntel', 'Westen', 'Kleider', 
      'Röcke', 'Hosen', 'Strick', 'Blusen', 'T-Shirts', 
      'Sportswear', 'Ski', 'Alles anzeigen'
    ],
    Accessories: [
      'Handtaschen', 'Schals', 'Mützen', 'Gürtel', 'Alles anzeigen'
    ],
    Highlights: [
      'New Arrivals', 'Best Sellers', 'Sustainable', 'Gift Guide'
    ],
    Images: [
      { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop', title: 'NEW SEASON' },
      { src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop', title: 'EDITORIAL' },
      { src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop', title: 'SUMMER VIBES' }
    ]
  },
  Marken: {
    Brands: [
      'Parajumpers', 'Stone Island', 'Moncler', 'Canada Goose', 
      'Woolrich', 'Nike', 'Adidas', 'Carhartt', 'Ralph Lauren', 
      'The North Face', 'Patagonia', 'Alles anzeigen'
    ],
    Images: [
       { src: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop', title: 'NIKE' },
       { src: 'https://images.unsplash.com/photo-1617611413968-65efd64b395d?q=80&w=600&auto=format&fit=crop', title: 'ADIDAS' }
    ]
  }
};

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { language, toggleLanguage, t } = useShop();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white text-black border-b border-gray-100"
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="container mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-3xl font-black tracking-tighter uppercase">
          ZARO<span className="font-light">FASHION</span>
        </Link>
        
        {/* Main Nav */}
        <nav className="hidden md:flex h-full items-center space-x-12 text-sm font-bold uppercase tracking-wider">
          {['Herren', 'Damen', 'Marken'].map((item) => (
            <div 
              key={item}
              className="h-full flex items-center cursor-pointer relative group"
              onMouseEnter={() => setActiveMenu(item)}
            >
              <span className={`transition-colors ${activeMenu === item ? 'text-black' : 'text-gray-600 hover:text-black'}`}>
                {t(`nav.${item === 'Herren' ? 'men' : item === 'Damen' ? 'women' : 'brands'}`)}
              </span>
              {activeMenu === item && (
                <motion.div 
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-black" 
                />
              )}
            </div>
          ))}
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          <div className="hidden lg:flex items-center gap-4 text-gray-500">
             {/* Search Icon */}
             <button 
               onClick={() => setIsSearchOpen(true)} 
               className="hover:text-black transition-colors"
             >
               <Search className="w-5 h-5" />
             </button>

             <span>|</span>

             {/* Language Selector */}
             <div className="relative">
               <button 
                 onClick={() => setIsLangOpen(!isLangOpen)}
                 className="hover:text-black flex items-center gap-2 text-lg"
               >
                 {language === 'de' ? '🇩🇪' : '🇺🇸'}
               </button>
               
               {isLangOpen && (
                 <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-lg p-2 min-w-[120px] flex flex-col gap-1">
                   <button 
                     onClick={() => { toggleLanguage('de'); setIsLangOpen(false); }}
                     className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 ${language === 'de' ? 'bg-gray-50 font-bold' : ''}`}
                   >
                     <span className="text-xl">🇩🇪</span> Deutsch
                   </button>
                   <button 
                     onClick={() => { toggleLanguage('en'); setIsLangOpen(false); }}
                     className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 ${language === 'en' ? 'bg-gray-50 font-bold' : ''}`}
                   >
                     <span className="text-xl">🇺🇸</span> English
                   </button>
                 </div>
               )}
             </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-0 left-0 right-0 h-24 bg-white z-50 flex items-center border-b border-gray-100"
          >
            <div className="container mx-auto px-6 flex items-center gap-4">
              <Search className="w-6 h-6 text-gray-400" />
              <input 
                type="text" 
                placeholder={t('search.placeholder')}
                className="flex-1 text-2xl font-light outline-none placeholder-gray-300"
                autoFocus
              />
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mega Menu Dropdown */}
      <AnimatePresence>
        {activeMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-12"
            onMouseEnter={() => setActiveMenu(activeMenu)}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="container mx-auto px-6">
              <div className="flex gap-16">
                
                {/* Column 1: Kleidung (or Brands for Marken) */}
                {activeMenu !== 'Marken' ? (
                  <div className="w-48">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">Kleidung</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {MENU_DATA[activeMenu]?.Kleidung?.map((item) => (
                        <li key={item}>
                          <Link href={`/category/${item.toLowerCase()}`} className="hover:text-black hover:underline transition-colors block">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                   <div className="w-48">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">Top Marken</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {MENU_DATA[activeMenu]?.Brands?.map((item) => (
                        <li key={item}>
                          <Link href={`/brand/${item.toLowerCase()}`} className="hover:text-black hover:underline transition-colors block">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Column 2: Accessories (Only for Herren/Damen) */}
                {activeMenu !== 'Marken' && (
                  <div className="w-48">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">Accessories</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {MENU_DATA[activeMenu]?.Accessories?.map((item) => (
                        <li key={item}>
                          <Link href={`/category/${item.toLowerCase()}`} className="hover:text-black hover:underline transition-colors block">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Column 3: Highlights (Only for Herren/Damen) */}
                {activeMenu !== 'Marken' && (
                  <div className="w-48">
                    <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">Highlights</h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      {MENU_DATA[activeMenu]?.Highlights?.map((item) => (
                        <li key={item}>
                          <Link href="#" className="hover:text-black hover:underline transition-colors block">
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Column 4: Images */}
                <div className="flex-1 grid grid-cols-3 gap-6">
                  {MENU_DATA[activeMenu]?.Images?.map((img, idx) => (
                    <div key={idx} className="group cursor-pointer">
                      <div className="aspect-[3/4] overflow-hidden mb-3 bg-gray-100">
                        <img 
                          src={img.src} 
                          alt={img.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <h4 className="font-bold text-xs uppercase tracking-widest group-hover:underline">{img.title}</h4>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
