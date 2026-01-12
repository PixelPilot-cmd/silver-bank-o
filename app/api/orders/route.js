import { getOrders, saveOrder, getUsers, updateUser } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const orders = await getOrders();
    return NextResponse.json(orders);
}

export async function POST(request) {
    const data = await request.json();
    const { customerEmail, customerPhone, usePoints, discountAmount } = data;

    // Handle Loyalty Points Redemption
    if (usePoints && discountAmount > 0) {
        const users = await getUsers();
        const user = users.find(u => u.email === customerEmail || u.phone === customerPhone);

        if (user && user.points >= 1000) {
            // Deduct 1000 points (cost for the discount)
            await updateUser(user.id, {
                points: user.points - 1000
            });
        } else if (usePoints) {
            // Revert discount if user doesn't have enough points
            data.total = (data.total || 0) + discountAmount;
            delete data.discountAmount;
            delete data.usePoints;
        }
    }

    const newOrder = {
        id: uuidv4(),
        status: 'pending', // pending, preparing, ready, delivered, picked_up
        createdAt: new Date().toISOString(),
        ...data
    };
    await saveOrder(newOrder);
    return NextResponse.json(newOrder);
}
