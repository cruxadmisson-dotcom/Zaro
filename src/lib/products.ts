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

import { saveProductsGitHub, getProductsFromGitHub } from './githubStorage';

export async function getProducts(): Promise<Product[]> {
  // If we are on Vercel AND have a GitHub Token, fetch LIVE data from GitHub
  // This ensures the Admin Panel sees changes immediately even before redeploy finishes
  if (process.env.GITHUB_TOKEN) {
    try {
      const ghProducts = await getProductsFromGitHub();
      if (ghProducts) return ghProducts;
    } catch (error) {
      console.error('GitHub fetch failed, falling back to local', error);
    }
  }

  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
}

export async function saveProducts(products: Product[]): Promise<void> {
  // If we are on Vercel (process.env.VERCEL) AND have a GitHub Token, use GitHub API
  if (process.env.GITHUB_TOKEN) {
    try {
      console.log('Saving products to GitHub...');
      await saveProductsGitHub(products);
      return;
    } catch (error) {
      console.error('GitHub save failed, falling back to local (which will fail on Vercel readonly fs)', error);
    }
  }

  try {
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving products locally:', error);
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
