import { NextResponse } from 'next/server';
import { getCustomRequests, addCustomRequest } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    const requests = await getCustomRequests();
    return NextResponse.json(requests);
}

export async function POST(request) {
    try {
        const data = await request.json();

        if (!data.description || !data.customerName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newRequest = await addCustomRequest(data);
        return NextResponse.json(newRequest);
    } catch (error) {
        console.error('Error in custom-requests POST:', error);
        return NextResponse.json({
            error: 'Failed to create custom request',
            details: error.message
        }, { status: 500 });
    }
}
