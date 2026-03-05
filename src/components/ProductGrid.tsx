'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductGrid({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="products" className="py-24 bg-gray-50 scroll-mt-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-light mb-4 tracking-widest uppercase">Kollektion</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm uppercase tracking-widest">
            Vintage & Streetwear
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeCategory === category 
                    ? 'bg-black text-white border border-black' 
                    : 'bg-transparent text-gray-500 hover:text-black border border-gray-200 hover:border-black'
                }`}
              >
                {category === 'all' ? 'Alle' : category}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12"
        >
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="block">
              <ProductCard product={product} />
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
