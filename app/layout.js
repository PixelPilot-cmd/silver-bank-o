import './globals.css';
import ClientProviders from '@/components/ClientProviders';

export const metadata = {
    title: 'Silver Bank 3 | بنك الفضة',
    description: 'المتجر الإلكتروني الرسمي لبنك الفضة - مجوهرات وساعات',
};

import Footer from '@/components/Footer';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';
import BackgroundMarquee from '@/components/BackgroundMarquee';

export default function RootLayout({ children }) {
    return (
        <html lang="ar" dir="rtl">
            <head>
                <meta name="theme-color" content="#000000" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="cursor-none relative overflow-x-hidden bg-black text-white">
                <ClientProviders>
                    <Preloader />
                    <CustomCursor />

                    <BackgroundMarquee />

                    <main className="relative z-10 min-h-screen">
                        {children}
                    </main>

                    <Footer />
                </ClientProviders>
            </body>
        </html>
    );
}
