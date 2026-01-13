import { updateCustomRequest, deleteCustomRequest } from '@/lib/db';

export async function PUT(request, { params }) {
    const data = await request.json();
    const updated = await updateCustomRequest(params.id, data);

    if (!updated) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
    const success = await deleteCustomRequest(params.id);
    if (!success) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
}
