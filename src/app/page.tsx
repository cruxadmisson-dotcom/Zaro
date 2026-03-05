import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import { getProducts } from '@/lib/products';

export default async function Home() {
  const products = await getProducts();
  
  return (
    <>
      <Hero />
      <ProductGrid products={products} />
      
      <section id="about" className="py-24 bg-white scroll-mt-24">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Über Zaro Fashion</h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Wir glauben daran, dass Kleidung mehr ist als nur Stoff. Sie ist Ausdruck deiner Persönlichkeit.
            Unsere Produkte werden mit höchster Sorgfalt ausgewählt und designt, um dir das beste Tragegefühl zu bieten.
            Qualität, Nachhaltigkeit und Stil stehen bei uns an erster Stelle.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Premium Qualität</h3>
              <p className="text-gray-500">Nur die besten Materialien für langlebige Produkte.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Schneller Versand</h3>
              <p className="text-gray-500">Wir liefern deine Bestellung in Rekordzeit.</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="font-bold text-xl mb-2">Nachhaltigkeit</h3>
              <p className="text-gray-500">Wir achten auf umweltfreundliche Produktion.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
