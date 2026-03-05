import { NextResponse } from 'next/server';
import { getProducts, addProduct } from '@/lib/products';

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const product = await request.json();
    
    // Validate
    if (!product.name || !product.price) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Ensure images is array
    if (!Array.isArray(product.images)) {
      product.images = product.image ? [product.image] : [];
    }

    // Filter empty images
    product.images = product.images.filter((img: string) => img && img.trim() !== '');

    const newProduct = await addProduct(product);
    return NextResponse.json(newProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
