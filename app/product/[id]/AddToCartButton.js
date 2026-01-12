'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';

export default function AddToCartButton({ product }) {
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        // Get existing cart
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');

        // Check if item exists
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={added}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300
        ${added
                    ? 'bg-green-600 text-white transform scale-95'
                    : 'bg-primary text-white hover:bg-primary-hover shadow-[0_4px_20px_rgba(215,0,0,0.4)]'
                }`}
        >
            {added ? (
                <>
                    <Check size={24} />
                    تمت الإضافة
                </>
            ) : (
                <>
                    <ShoppingBag size={24} />
                    إضافة للسلة
                </>
            )}
        </button>
    );
}
