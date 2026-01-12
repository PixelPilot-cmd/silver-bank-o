import { updateOrder, deleteOrder, getUsers, updateUser } from '@/lib/db';

export async function PUT(request, { params }) {
    const data = await request.json();

    // Get the order before updating to compare status
    const oldOrders = await import('@/lib/db').then(m => m.getOrders());
    const orderBefore = oldOrders.find(o => o.id === params.id);

    const updatedOrder = await updateOrder(params.id, data);

    if (!updatedOrder) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Logic for Loyalty Points: If status changed to 'delivered'
    if (data.status === 'delivered' && orderBefore?.status !== 'delivered') {
        const users = await getUsers();
        // Link by email or phone (using email here as primary identifier)
        const user = users.find(u => u.email === updatedOrder.customerEmail || u.phone === updatedOrder.customerPhone);

        if (user) {
            const currentPoints = user.points || 0;
            const pointsToAdd = Math.floor(updatedOrder.total || 0);
            await updateUser(user.id, {
                points: currentPoints + pointsToAdd,
                totalOrdersCompleted: (user.totalOrdersCompleted || 0) + 1
            });
        }
    }

    return NextResponse.json(updatedOrder);
}

export async function DELETE(request, { params }) {
    const deleted = await deleteOrder(params.id);

    if (!deleted) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order deleted successfully' });
}
