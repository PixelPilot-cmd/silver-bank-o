import { NextResponse } from 'next/server';
import { saveUser } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
    try {
        const data = await request.json();
        const newUser = {
            id: uuidv4(),
            name: data.name,
            email: data.email,
            password: data.password, // In a real app, hash this!
            createdAt: new Date().toISOString()
        };

        await saveUser(newUser);
        return NextResponse.json({ success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
