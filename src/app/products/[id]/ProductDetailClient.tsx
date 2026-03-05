'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Star, Truck, ShieldCheck, RefreshCw, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';

const STANDARD_COLORS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#000080' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Green', hex: '#008000' },
  { name: 'Grey', hex: '#808080' },
];

export default function ProductDetailClient({ product, relatedProducts }: { product: Product, relatedProducts: Product[] }) {
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Determine available colors from variants OR legacy colors list
  const availableColors = product.colorVariants && product.colorVariants.length > 0
    ? product.colorVariants.map(v => v.color)
    : (product.colors || []);

  // Determine images to show based on selected color
  const getDisplayImages = () => {
    let images: string[] = [];
    
    // 1. Add Variant Images (if color selected)
    if (selectedColor && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant && variant.images.length > 0) {
        images = [...variant.images];
      }
    }

    // 2. Add Main Images (General) - Append them to the list
    if (product.images && product.images.length > 0) {
        // Filter out duplicates if any
        const newImages = product.images.filter(img => !images.includes(img));
        images = [...images, ...newImages];
    } else if (product.image && !images.includes(product.image)) {
        images.push(product.image);
    }

    // If still empty, use placeholder
    if (images.length === 0) {
        return ['/placeholder.jpg'];
    }

    return images;
  };

  const displayImages = getDisplayImages();

  // Reset active image when color changes
  useEffect(() => {
    setActiveImage(0);
  }, [selectedColor]);

  const toggleAccordion = (section: string) => {
    setOpenAccordion(openAccordion === section ? null : section);
  };

  const getCheckoutUrl = () => {
    if (selectedColor && product.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant && variant.checkoutUrl) {
        return variant.checkoutUrl;
      }
    }
    return product.checkoutUrl;
  };

  const handleCheckout = (e: React.MouseEvent) => {
    if (!selectedSize && product.sizes && product.sizes.length > 1) {
      e.preventDefault();
      alert('Bitte wähle zuerst eine Größe aus.');
      return;
    }
    if (availableColors.length > 0 && !selectedColor) {
      e.preventDefault();
      alert('Bitte wähle zuerst eine Farbe aus.');
      return;
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="container mx-auto px-4 md:px-8 pt-12 md:pt-24">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-400 mb-8 uppercase tracking-widest">
          <Link href="/" className="hover:text-black transition-colors">Home</Link> / 
          <span className="mx-2">{product.category}</span> / 
          <span className="text-gray-900 ml-2">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          {/* Left: Images */}
          <div className="w-full lg:w-3/5">
            <div className="aspect-[4/5] w-full bg-gray-50 overflow-hidden mb-4 relative">
              <motion.img 
                key={`${selectedColor}-${activeImage}`} // Re-render on color change
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                src={displayImages[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {displayImages.map((img: string, idx: number) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-black' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="mb-2">
              <span className="text-sm font-bold tracking-widest uppercase text-gray-500">{product.brand}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="text-2xl font-medium text-gray-900 mb-8">
              {product.price.toFixed(2)} {product.currency}
            </div>

            {/* Size & Condition */}
            <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
              <div className="border border-gray-200 p-4 text-center">
                <span className="block text-gray-400 text-xs uppercase mb-1">Zustand</span>
                <span className="font-bold">{product.condition}</span>
              </div>
              <div className="border border-gray-200 p-4 text-center">
                <span className="block text-gray-400 text-xs uppercase mb-1">Marke</span>
                <span className="font-bold">{product.brand}</span>
              </div>
            </div>

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold uppercase tracking-widest">Farbe: {selectedColor || 'Wählen'}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map(color => (
                    <button 
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative ${selectedColor === color ? 'ring-2 ring-offset-2 ring-black' : 'border-gray-200'}`}
                      style={{ backgroundColor: STANDARD_COLORS.find(sc => sc.name === color)?.hex || 'gray' }}
                      title={color}
                    >
                      {selectedColor === color && <Check size={16} className={`absolute inset-0 m-auto ${color === 'White' || color === 'Beige' ? 'text-black' : 'text-white'}`} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold uppercase tracking-widest">Größe Wählen</span>
                  <span className="text-xs text-gray-400 underline cursor-pointer">Größentabelle</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => {
                    const isAvailable = product.sizes.includes(size);
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => isAvailable && setSelectedSize(size)}
                        className={`
                          relative py-3 border text-sm font-bold transition-all duration-200 overflow-hidden
                          ${!isAvailable 
                            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50' 
                            : isSelected 
                              ? 'bg-black text-white border-black shadow-md scale-105' 
                              : 'bg-white text-gray-900 border-gray-200 hover:border-black hover:bg-gray-50'
                          }
                        `}
                      >
                        {size}
                        {!isAvailable && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-[120%] h-[1px] bg-gray-300 -rotate-45 transform origin-center absolute"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <a 
              href={getCheckoutUrl()} 
              target="_blank"
              onClick={handleCheckout}
              className={`w-full py-4 text-center uppercase tracking-widest font-bold transition-colors mb-4 ${
                (!selectedSize && product.sizes && product.sizes.length > 1) || (availableColors.length > 0 && !selectedColor)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              In den Warenkorb
            </a>
            <p className="text-xs text-center text-gray-400 mb-12">
              Nur 1 verfügbar. Wenn weg, dann weg.
            </p>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              {/* Description */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('description')}
                  className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors px-2"
                >
                  <span className="font-bold uppercase text-xs tracking-widest">Beschreibung</span>
                  {openAccordion === 'description' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openAccordion === 'description' ? 'auto' : 0, opacity: openAccordion === 'description' ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 px-2 text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </div>
                </motion.div>
              </div>

              {/* Authenticity */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('authenticity')}
                  className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors px-2"
                >
                  <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-2"><ShieldCheck size={16}/> Authentizität</span>
                  {openAccordion === 'authenticity' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openAccordion === 'authenticity' ? 'auto' : 0, opacity: openAccordion === 'authenticity' ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 px-2 text-sm text-gray-600 leading-relaxed">
                    Ja! Unsere Kleidung ist selbstverständlich authentisch. Es ist uns sehr wichtig, dass wir nur Vintage-Kleidung in sehr gutem Zustand verkaufen. Wir empfehlen dir, die Beschreibung und alle Fotos genau anzusehen.
                  </div>
                </motion.div>
              </div>

              {/* Shipping */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors px-2"
                >
                  <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-2"><Truck size={16}/> Versand</span>
                  {openAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openAccordion === 'shipping' ? 'auto' : 0, opacity: openAccordion === 'shipping' ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 px-2 text-sm text-gray-600 leading-relaxed">
                    Alle Pakete werden sofort am gleichen oder nächsten Werktag nach Bestellung mit DHL versendet.<br/><br/>
                    🇩🇪 Deutschland: 2-4 Werktage<br/>
                    🇪🇺 Europa: 2-8 Werktage<br/>
                    🌍 Weltweit: 7-21 Werktage
                  </div>
                </motion.div>
              </div>

              {/* Returns */}
              <div className="border-b border-gray-200">
                <button 
                  onClick={() => toggleAccordion('returns')}
                  className="w-full py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors px-2"
                >
                  <span className="font-bold uppercase text-xs tracking-widest flex items-center gap-2"><RefreshCw size={16}/> Rücksendungen</span>
                  {openAccordion === 'returns' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <motion.div 
                  initial={false}
                  animate={{ height: openAccordion === 'returns' ? 'auto' : 0, opacity: openAccordion === 'returns' ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 px-2 text-sm text-gray-600 leading-relaxed">
                    Ja, wir bieten ein 14-tägiges Rückgaberecht für alle Kunden an. Wir stellen keine Fragen. :)
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-32">
            <h3 className="text-2xl font-light text-center mb-12 uppercase tracking-widest">Das könnte dir auch gefallen</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id} onClick={() => window.location.href = `/products/${p.id}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
