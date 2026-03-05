import fs from 'fs/promises';
import path from 'path';

export interface ColorVariant {
  color: string;
  images: string[];
  checkoutUrl?: string; // New field for color-specific checkout
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string; // Main thumbnail
  images: string[]; // Fallback / All images
  checkoutUrl: string; // Default checkout URL
  condition: string;
  brand: string;
  sizes: string[];
  colors?: string[]; // Simple list (legacy)
  colorVariants?: ColorVariant[]; // New: Maps colors to specific images & checkout URLs
}

const dataFilePath = path.join(process.cwd(), 'src/data/products.json');

export async function getProducts(): Promise<Product[]> {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products:', error);
    throw error;
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  await saveProducts(products);
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return null;
  
  const updatedProduct = { ...products[index], ...updates };
  products[index] = updatedProduct;
  await saveProducts(products);
  return updatedProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  if (filteredProducts.length === products.length) return false;
  
  await saveProducts(filteredProducts);
  return true;
}
