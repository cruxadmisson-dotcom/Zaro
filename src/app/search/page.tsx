'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/lib/products';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all products
    fetch('/api/admin/products')
      .then(res => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;

    const lowerQuery = (query || '').toLowerCase();
    
    // Fuzzy Search logic
    const filtered = products.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(lowerQuery);
      const brandMatch = p.brand.toLowerCase().includes(lowerQuery);
      const descMatch = p.description.toLowerCase().includes(lowerQuery);
      const catMatch = p.category.toLowerCase().includes(lowerQuery);
      
      return nameMatch || brandMatch || descMatch || catMatch;
    });
    
    setResults(filtered);
  }, [query, products]);

  // Random products for "No Results"
  const randomProducts = products
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  if (loading) return <div className="min-h-screen pt-32 text-center">Laden...</div>;

  return (
    <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
      <h1 className="text-3xl font-light mb-8">
        {results.length > 0 
          ? `Suchergebnisse für "${query}" (${results.length})`
          : `Keine Treffer für "${query}"`
        }
      </h1>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map(product => (
            <div key={product.id} onClick={() => window.location.href = `/products/${product.id}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <p className="text-gray-400 mb-16 text-sm font-light uppercase tracking-widest text-center">
            Leider haben wir nichts gefunden. <br/>
            Aber schau mal hier:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {randomProducts.map(product => (
              <div key={product.id} onClick={() => window.location.href = `/products/${product.id}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center">Laden...</div>}>
      <SearchResults />
    </Suspense>
  );
}
