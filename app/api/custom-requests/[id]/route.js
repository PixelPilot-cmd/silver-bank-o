import { NextResponse } from 'next/server';
import { updateCustomRequest } from '@/lib/db';

export async function PUT(request, { params }) {
    const data = await request.json();
    const updated = await updateCustomRequest(params.id, data);

    if (!updated) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}
