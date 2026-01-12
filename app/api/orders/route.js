import { NextResponse } from 'next/server';
import { getOrders, saveOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}

export async function POST(request) {
    const data = await request.json();
    const newOrder = {
        id: uuidv4(),
        status: 'pending', // pending, preparing, ready, delivered, picked_up
        createdAt: new Date().toISOString(),
        ...data
    };
    await saveOrder(newOrder);
    return NextResponse.json(newOrder);
}
