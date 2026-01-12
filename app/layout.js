import './globals.css';

export const metadata = {
    title: 'Silver Bank 3 | بنك الفضة',
    description: 'المتجر الإلكتروني الرسمي لبنك الفضة - مجوهرات وساعات',
};

import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import OrderNotifications from '@/components/OrderNotifications';

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="cursor-none relative overflow-x-hidden">
                <Preloader />
                <CustomCursor />
                <OrderNotifications />

                {/* Background Marquee Text */}
                <div className="marquee-text animate-marquee select-none" dir="ltr">
                    SILVER BANK LUXURY . TIMELESS ELEGANCE . SILVER BANK LUXURY . TIMELESS ELEGANCE .
                </div>

                <div className="relative z-10">
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
