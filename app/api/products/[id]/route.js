import { NextResponse } from 'next/server';
import { updateProduct, deleteProduct } from '@/lib/db';

export async function PUT(request, { params }) {
    const data = await request.json();
    const updated = await updateProduct(params.id, data);

    if (!updated) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
    const success = await deleteProduct(params.id);

    if (!success) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
}
