export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  images: string[];
  checkoutUrl: string;
  condition: string;
  brand: string;
  sizes: string[];
  colors?: string[]; // Optional: Available colors
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Nike Spellout Sweatshirt',
    description: 'Original 90er Jahre Nike Sweatshirt in Navy Blue. Gesticktes Logo auf der Brust. Sehr weicher Stoff und perfekter Boxy Fit.',
    price: 89.99,
    currency: 'EUR',
    category: 'sweatshirts',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    checkoutUrl: 'https://buy.stripe.com/test_12345',
    condition: '9/10 - Sehr guter Vintage Zustand',
    brand: 'Nike',
    sizes: ['L'],
    colors: ['Navy'],
  },
  {
    id: '2',
    name: 'Carhartt Detroit Jacket Beige',
    description: 'Klassische Carhartt Arbeitsjacke in Beige. Leichte Gebrauchsspuren am Ärmel, die den Charakter unterstreichen. Innen gefüttert.',
    price: 149.99,
    currency: 'EUR',
    category: 'jackets',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1591047139130-136f7aa5973c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    checkoutUrl: 'https://buy.stripe.com/test_67890',
    condition: '8/10 - Leichte Patina',
    brand: 'Carhartt',
    sizes: ['XL'],
    colors: ['Beige'],
  },
  {
    id: '3',
    name: 'Classic White Tee',
    description: 'Ein hochwertiges weißes T-Shirt aus 100% Bio-Baumwolle. Perfekt für jeden Anlass.',
    price: 29.99,
    currency: 'EUR',
    category: 't-shirts',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    checkoutUrl: 'https://buy.stripe.com/test_abcde',
    condition: 'Neu',
    brand: 'Zaro Fashion',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White'],
  },
  {
    id: '4',
    name: 'Adidas Firebird Trackpant',
    description: 'Klassische Trainingshose von Adidas in Schwarz mit weißen Streifen. Reißverschlüsse an den Knöcheln.',
    price: 49.99,
    currency: 'EUR',
    category: 'pants',
    image: 'https://images.unsplash.com/photo-1552248984-702a99d08831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1552248984-702a99d08831?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    ],
    checkoutUrl: 'https://buy.stripe.com/test_fghij',
    condition: '9/10',
    brand: 'Adidas',
    sizes: ['S'],
    colors: ['Black'],
  },
];
