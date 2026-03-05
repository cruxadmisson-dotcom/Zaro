'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          Zaro<span className="text-blue-600">Fashion</span>
        </Link>
        
        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-black transition-colors">Startseite</Link>
          <Link href="#products" className="hover:text-black transition-colors">Kollektion</Link>
          <Link href="#about" className="hover:text-black transition-colors">Über uns</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ShoppingBag className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
