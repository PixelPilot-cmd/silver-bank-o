import { NextResponse } from 'next/server';
import { getProducts, saveProduct } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const products = await getProducts();
    return NextResponse.json(products);
}

export async function POST(request) {
    const data = await request.json();
    const newProduct = {
        id: uuidv4(),
        ...data,
        createdAt: new Date().toISOString()
    };
    await saveProduct(newProduct);
    return NextResponse.json(newProduct);
}
