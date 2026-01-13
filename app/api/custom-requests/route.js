import { NextResponse } from 'next/server';
import { getCustomRequests, addCustomRequest } from '@/lib/db';

export async function GET() {
    const requests = await getCustomRequests();
    return NextResponse.json(requests);
}

export async function POST(request) {
    const data = await request.json();

    if (!data.description || !data.customerName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newRequest = await addCustomRequest(data);
    return NextResponse.json(newRequest);
}
