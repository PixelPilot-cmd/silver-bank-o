import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function POST(request) {
    const { email, password } = await request.json();
    const users = await getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Return user info excluding password
        const { password, ...userInfo } = user;
        return NextResponse.json({ success: true, user: userInfo });
    }

    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
