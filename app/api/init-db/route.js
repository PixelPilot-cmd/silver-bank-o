import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Initialize with existing data from JSON files
        const existingUser = {
            id: "48afb24c-fd25-400e-9d84-0bc1877693ba",
            name: "بيلا",
            email: "moneyoof09@gmail.com",
            password: "Oo123456!",
            createdAt: "2026-01-11T14:26:14.917Z"
        };

        const existingProduct = {
            id: "628e8357-c8e1-4d5d-8054-714719806f57",
            name: "ساعة رولكس مطلية فضة ",
            price: 150,
            category: "watches",
            description: "",
            image: "https://www.bing.com/images/search?view=detailV2&ccid=FM23tCDG&id=1F2414F4A9B5C099EC1696F6F52D8733974DC191&thid=OIP.FM23tCDGpQUks8RcxM5YbAHaHc&mediaurl=https%3a%2f%2fcdn1-m.zahratalkhaleej.ae%2fstore%2farchive%2fimage%2f2023%2f1%2f25%2f06fdf1c5-ce86-409c-b03e-e697412d1ba2.jpg%3fwidth%3d1000&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.14cdb7b420c6a50524b3c45cc4ce586c%3frik%3dkcFNlzOHLfX2lg%26pid%3dImgRaw%26r%3d0&exph=999&expw=993&q=%d8%b3%d8%a7%d8%b9%d8%a9+%d8%b1%d9%88%d9%84%d9%83%d8%b3&FORM=IRPRST&ck=69A8118CAA8F3D16B0921E41C6D3A5CA&selectedIndex=0&itb=0",
            createdAt: "2026-01-11T18:14:55.394Z"
        };

        // Check if data already exists
        const existingUsers = await kv.get('users');
        const existingProducts = await kv.get('products');
        const existingOrders = await kv.get('orders');

        // Initialize only if empty
        if (!existingUsers) {
            await kv.set('users', [existingUser]);
        }

        if (!existingProducts) {
            await kv.set('products', [existingProduct]);
        }

        if (!existingOrders) {
            await kv.set('orders', []);
        }

        // Get current counts
        const users = await kv.get('users') || [];
        const products = await kv.get('products') || [];
        const orders = await kv.get('orders') || [];

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully! ✅',
            details: {
                storage: 'Vercel KV (Redis)',
                data: {
                    users: users.length,
                    products: products.length,
                    orders: orders.length
                }
            }
        });

    } catch (error) {
        console.error('Database initialization error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
            details: error.toString()
        }, { status: 500 });
    }
}
