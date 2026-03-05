'use client';

import { motion } from 'framer-motion';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group bg-white overflow-hidden cursor-pointer"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Sold Out Badge logic could go here */}
      </div>

      <div className="text-center">
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          {product.brand}
        </div>
        <h3 className="text-sm font-normal text-gray-900 mb-2 leading-relaxed uppercase tracking-wider">
          {product.name}
        </h3>
        <div className="text-sm font-bold text-gray-900">
          {product.price.toFixed(2)} {product.currency}
        </div>
        <div className="text-xs text-gray-400 mt-1 uppercase">
           {product.sizes.join(', ')} • {product.condition.split(' ')[0]}
        </div>
      </div>
    </motion.div>
  );
}
