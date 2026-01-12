import { NextResponse } from 'next/server';
import { getOrders } from '@/lib/db';

export async function GET(request, { params }) {
    const query = params.id;
    const orders = await getOrders();

    // Check if it's a UUID or sequential number
    const order = orders.find(o =>
        o.id === query ||
        String(o.orderNumber) === query ||
        `#${o.orderNumber}` === query ||
        query.toLowerCase() === `req #${o.orderNumber}`.toLowerCase()
    );

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ id: order.id });
}
