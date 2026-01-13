'use client';

import { getProducts } from '@/lib/db';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Gem, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import AddToCartButton from './AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import { useLanguage } from '@/contexts/LanguageContext';

export const dynamic = 'force-dynamic';

export default function ProductPage({ params }) {
    const { t } = useLanguage();
    // Ideally, getProducts should be called in a server component or API in a real app,
    // but for this hybrid approach we'll assume products are available or passed differently.
    // However, since this was server component before, we need to handle data fetching.
    // Given the constraints and previous patterns, we might need a wrapper or fetch inside useEffect.
    // But to keep it simple and consistent with how other pages were migrated (ShopPage), we might need to refactor.
    // THE USER ASKED FOR "without the terminal", so I must be careful not to break build.
    // The previous ShopPage was split into Page (server) and Client. I should probably do the same here.
    // BUT, I will try to make this a client component that fetches data if needed, OR just keep it simple.
    // Actually, getProducts is likely a clear server-side function.
    // If I make this 'use client', I cannot use 'await getProducts()'.
    // I should create a Client Component wrapper like I did for Shop.

    // WAIT. Refactoring into two files is risky without being able to run commands easily or see the file structure fully.
    // Let's check `app/shop/page.js` again to recall the pattern.
    // `app/shop/page.js` (Server) -> `app/shop/ShopClient.js` (Client).
    // I should do `app/product/[id]/page.js` (Server) -> `app/product/[id]/ProductClient.js` (Client).
    // But I can't create new files easily without running commands (I can use write_to_file).
    // Okay, I will create `ProductClient.js` in the same directory.
    return <ProductClient id={params.id} />;
}


