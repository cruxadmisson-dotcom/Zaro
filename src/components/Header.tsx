'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Search, X, Menu, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { useRouter } from 'next/navigation';
import AnnouncementBar from './AnnouncementBar';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false); // New state for mobile language dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  
  const { language, toggleLanguage, t } = useShop();
  const router = useRouter();

  // Load products when search opens
  useEffect(() => {
    if (isSearchOpen && products.length === 0) {
      fetch('/api/admin/products')
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(console.error);
    }
  }, [isSearchOpen]);

  // Live Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) || 
      p.brand.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery)
    );
    setSearchResults(filtered);
  }, [searchQuery, products]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Translation Helper for Menu Data
  const getTranslatedMenu = () => {
    // Deep copy first to avoid mutating original
    const data = JSON.parse(JSON.stringify(MENU_DATA));
    
    // Translate headers if possible (this is a simplified approach)
    // In a real app, you might restructure MENU_DATA to be fully dynamic
    return data;
  };

  return (
    <>
      {/* Sticky Container */}
      <div className="sticky top-0 z-50">
        <AnnouncementBar />
        <header 
          className="bg-white text-black border-b border-gray-100 relative"
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="container mx-auto px-6 h-16 md:h-20 flex justify-between items-center">
            
            {/* Mobile: Hamburger Menu (Left) */}
            <div className="md:hidden flex-1">
              <button onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Logo (Centered on Mobile, Left on Desktop) */}
            <div className="flex-1 text-center md:text-left md:flex-none">
              <Link href="/" className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                ZARO<span className="font-light">FASHION</span>
              </Link>
            </div>
            
            {/* Desktop Nav (Center) */}
            <nav className="hidden md:flex h-full items-center justify-center flex-1 space-x-12 text-sm font-bold uppercase tracking-wider">
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

            {/* Icons (Right) */}
            <div className="flex-1 flex justify-end items-center space-x-4 md:space-x-6 text-sm font-medium">
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
              
              {/* Mobile Search Icon */}
              <button 
                 onClick={() => setIsSearchOpen(true)} 
                 className="lg:hidden hover:text-black transition-colors"
               >
                 <Search className="w-5 h-5" />
               </button>

              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* Mega Menu Dropdown (Desktop) */}
          <AnimatePresence>
            {activeMenu && !isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl py-12 hidden md:block"
                onMouseEnter={() => setActiveMenu(activeMenu)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <div className="container mx-auto px-6">
                  <div className="flex gap-16">
                    {/* ... (Existing Mega Menu Logic) ... */}
                    {activeMenu !== 'Marken' ? (
                        <div className="w-48">
                          <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">{t('nav.clothing')}</h3>
                          <ul className="space-y-3 text-sm text-gray-600">
                            {MENU_DATA[activeMenu]?.Kleidung?.map((item) => (
                              <li key={item}>
                                <Link href={`/category/${item.toLowerCase()}`} className="hover:text-black hover:underline transition-colors block">
                                  {t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) !== `categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}` ? t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) : item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                         <div className="w-48">
                          <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">{t('nav.brands')}</h3>
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

                      {activeMenu !== 'Marken' && (
                        <div className="w-48">
                          <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">{t('nav.accessories')}</h3>
                          <ul className="space-y-3 text-sm text-gray-600">
                            {MENU_DATA[activeMenu]?.Accessories?.map((item) => (
                              <li key={item}>
                                <Link href={`/category/${item.toLowerCase()}`} className="hover:text-black hover:underline transition-colors block">
                                  {t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) !== `categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}` ? t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) : item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeMenu !== 'Marken' && (
                        <div className="w-48">
                          <h3 className="font-bold text-xs uppercase tracking-widest mb-6 border-b pb-2">{t('nav.highlights')}</h3>
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
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-[60]"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b flex justify-between items-center">
                 <span className="font-black text-xl uppercase">{t('nav.menu')}</span>
                 <button onClick={() => setIsMobileMenuOpen(false)}>
                   <X className="w-6 h-6" />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {['Herren', 'Damen', 'Marken'].map(category => (
                  <div key={category}>
                    <button 
                      onClick={() => setActiveMenu(activeMenu === category ? null : category)}
                      className="flex justify-between items-center w-full text-left font-bold text-lg uppercase py-2"
                    >
                      {t(`nav.${category === 'Herren' ? 'men' : category === 'Damen' ? 'women' : 'brands'}`)}
                      <ChevronRight className={`w-5 h-5 transition-transform ${activeMenu === category ? 'rotate-90' : ''}`} />
                    </button>
                    
                    {/* Submenu for Mobile */}
                    <AnimatePresence>
                      {activeMenu === category && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-4"
                        >
                          <div className="py-2 space-y-4">
                            {category === 'Marken' ? (
                                MENU_DATA.Marken.Brands?.map(brand => (
                                  <Link key={brand} href={`/brand/${brand.toLowerCase()}`} className="block text-gray-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                                    {brand}
                                  </Link>
                                ))
                            ) : (
                              <>
                                <div>
                                  <p className="font-bold text-xs uppercase text-gray-400 mb-2">{t('nav.clothing')}</p>
                                  {MENU_DATA[category]?.Kleidung?.slice(0, 8).map(item => (
                                     <Link key={item} href={`/category/${item.toLowerCase()}`} className="block text-gray-600 py-1" onClick={() => setIsMobileMenuOpen(false)}>
                                      {t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) !== `categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}` ? t(`categories.${item.toLowerCase().replace(/ & /g, '').replace(/ /g, '')}`) : item}
                                    </Link>
                                  ))}
                                   <Link href={`/category/all`} className="block text-black font-bold py-1 underline">{t('categories.all')}</Link>
                                </div>
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t bg-gray-50">
                 <div className="relative">
                   <button 
                     onClick={() => setIsMobileLangOpen(!isMobileLangOpen)} 
                     className="w-full bg-black text-white py-3 px-4 flex justify-between items-center font-bold uppercase tracking-widest rounded"
                   >
                     <span className="flex items-center gap-2">
                       {language === 'de' ? '🇩🇪 Deutsch' : '🇺🇸 English'}
                     </span>
                     <ChevronRight className={`transition-transform duration-300 ${isMobileLangOpen ? '-rotate-90' : 'rotate-90'}`} />
                   </button>
                   
                   <AnimatePresence>
                      {isMobileLangOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-1 bg-black border border-gray-800 rounded shadow-lg"
                        >
                          <button 
                            onClick={() => { toggleLanguage('de'); setIsMobileLangOpen(false); }}
                            className={`w-full text-left px-4 py-3 border-b border-gray-800 flex items-center gap-2 font-bold text-white hover:bg-gray-900`}
                          >
                            <span className="text-xl">🇩🇪</span> Deutsch
                          </button>
                          <button 
                            onClick={() => { toggleLanguage('en'); setIsMobileLangOpen(false); }}
                            className={`w-full text-left px-4 py-3 flex items-center gap-2 font-bold text-white hover:bg-gray-900`}
                          >
                            <span className="text-xl">🇺🇸</span> English
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Overlay (Live Search) - Same as before */}
      <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed inset-0 bg-white z-[100] flex flex-col pt-10" // Full screen white overlay
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full z-50"
              >
                <X className="w-8 h-8" />
              </button>

              {/* Announcement Bar inside Overlay (Optional, but looks nice) */}
              <div className="hidden md:flex absolute top-0 left-0 right-0 h-10 bg-black text-white items-center justify-center text-xs font-bold tracking-widest uppercase">
                KOSTENLOSE STANDARDLIEFERUNG FÜR ALLE BESTELLUNGEN
              </div>

              {/* Search Input */}
              <div className="container mx-auto px-6 mt-4 md:mt-8 mb-8">
                <div className="flex justify-center">
                  <div className="relative w-full max-w-xl group">
                    <Search className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-black transition-colors" />
                    <input 
                      type="text" 
                      placeholder={t('search.placeholder')}
                      className="w-full text-lg bg-white border-b border-gray-200 focus:border-black outline-none py-3 pl-10 pr-4 transition-colors placeholder-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearch}
                      autoFocus
                    />
                  </div>
                </div>
              </div>

              {/* Live Results Grid */}
              <div className="container mx-auto px-6 h-[calc(100vh-200px)] overflow-y-auto pb-20 scrollbar-hide">
                {searchQuery && searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                    {searchResults.map(product => (
                       <Link 
                         key={product.id} 
                         href={`/products/${product.id}`}
                         onClick={() => { setIsSearchOpen(false); }}
                       >
                          <ProductCard product={product} />
                       </Link>
                    ))}
                  </div>
                ) : searchQuery && searchResults.length === 0 ? (
                  <div className="space-y-12">
                    <p className="text-center text-gray-500 text-sm uppercase tracking-widest">Keine Treffer gefunden.</p>
                    
                    {/* Recommendations Fallback */}
                    <div>
                      <h3 className="text-center font-bold text-xl mb-8">Das könnte dir auch gefallen</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
                        {[...products]
                          .sort(() => 0.5 - Math.random())
                          .slice(0, 4)
                          .map(product => (
                            <Link 
                              key={product.id} 
                              href={`/products/${product.id}`}
                              onClick={() => { setIsSearchOpen(false); }}
                            >
                              <ProductCard product={product} />
                            </Link>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                ) : (
                  // Default State (Empty)
                  <div className="text-center text-gray-400 mt-12 text-sm uppercase tracking-widest">
                    Tippe, um Produkte zu suchen...
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
}
