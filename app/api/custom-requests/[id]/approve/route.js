import { NextResponse } from 'next/server';
import { getCustomRequests, updateCustomRequest, saveOrder } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request, { params }) {
    const { id } = params;
    const requests = await getCustomRequests();
    const customReq = requests.find(r => r.id === id);

    if (!customReq) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    if (customReq.status !== 'priced' || !customReq.price) {
        return NextResponse.json({ error: 'Request is not priced yet' }, { status: 400 });
    }

    // 1. Update custom request status
    await updateCustomRequest(id, { status: 'approved' });

    // 2. Create a official order
    const newOrder = {
        id: uuidv4(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        customer: {
            name: customReq.customerName,
            phone: customReq.customerPhone
        },
        items: [
            {
                name: `طلب تفصيل خاص: ${customReq.description.slice(0, 30)}...`,
                price: customReq.price,
                quantity: 1,
                image: customReq.image || '/placeholder-custom.jpg',
                isCustom: true,
                originalRequestId: id
            }
        ],
        subtotal: customReq.price,
        total: customReq.price,
        userId: customReq.userId,
        customerPhone: customReq.customerPhone,
        isCustomOrder: true
    };

    const savedOrder = await saveOrder(newOrder);

    return NextResponse.json({ success: true, order: savedOrder });
}
