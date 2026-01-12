import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
        return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.id === userId);

    if (user) {
        const { password, ...userInfo } = user;
        return NextResponse.json(userInfo);
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
