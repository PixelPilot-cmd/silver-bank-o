import { NextResponse } from 'next/server';
import { updateOrder } from '@/lib/db';

export async function PUT(request, { params }) {
    const data = await request.json();
    const updatedOrder = await updateOrder(params.id, data);

    if (!updatedOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
}

import { deleteOrder } from '@/lib/db';

export async function DELETE(request, { params }) {
    const deleted = await deleteOrder(params.id);

    if (!deleted) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
}
