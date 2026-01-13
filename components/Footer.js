'use client';

import Link from 'next/link';
import { MapPin, Phone, Facebook, Package, ShieldCheck, Gem } from 'lucide-react';

import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();
    return (
        <footer className="bg-black/90 text-white border-t border-white/10 mt-48 relative overflow-hidden backdrop-blur-lg">

            {/* Background Decor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="container mx-auto px-4 pt-60 pb-20 text-center">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    {/* Brand & Bio */}
                    <div className="space-y-4 flex flex-col items-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-tr from-primary to-black rounded-full flex items-center justify-center font-bold text-xl text-white border border-white/20">
                                3
                            </div>
                            <span className="text-2xl font-bold font-serif tracking-wide">{t('siteName')}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            {t('footer.desc')}
                        </p>
                        <div className="flex justify-center gap-4 mt-6">
                            <SocialIcon icon={<Facebook size={18} />} href="https://www.facebook.com/share/187bc83Cyd/?mibextid=wwXIfr" target="_blank" />
                            <SocialIcon
                                icon={
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                }
                                href="https://www.tiktok.com/@silverbank3r?_r=1&_t=ZS-92z9OHh5DC4"
                                target="_blank"
                            />
                        </div>
                    </div>

                    {/* Contact Info (Requested) */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">{t('footer.contactUs')}</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex flex-col items-center justify-center gap-2 hover:text-primary transition-colors cursor-pointer">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span className="whitespace-pre-line">{t('footer.address')}</span>
                            </li>
                            <li className="flex items-center justify-center gap-3 hover:text-primary transition-colors cursor-pointer">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span dir="ltr">+970 594675988</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">{t('footer.quickLinks')}</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <FooterLink href="/" label={t('home')} />
                            <FooterLink href="/cart" label={t('cart')} />
                            <FooterLink href="/login" label={t('myAccount')} />
                            <FooterLink href="/track" label={t('trackOrder')} />
                            <FooterLink href="/admin/login" label={t('admin')} />
                        </ul>
                    </div>

                    {/* Features */}
                    <div className="space-y-4 flex flex-col items-center">
                        <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2 inline-block">{t('footer.whyUs')}</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li className="flex items-center justify-center gap-3">
                                <Gem className="w-5 h-5 text-gold" />
                                <span>{t('footer.sterlingSilver')}</span>
                            </li>
                            <li className="flex items-center justify-center gap-3">
                                <Package className="w-5 h-5 text-gold" />
                                <span>{t('footer.freeGiftWrapping')}</span>
                            </li>
                            <li className="flex items-center justify-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-gold" />
                                <span>{t('footer.guarantee')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
                    <p>{t('footer.rightsReserved')}</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white">{t('footer.privacyPolicy')}</Link>
                        <Link href="#" className="hover:text-white">{t('footer.termsConditions')}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialIcon({ icon, href, target }) {
    return (
        <a href={href} target={target} rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/10">
            {icon}
        </a>
    )
}

function FooterLink({ href, label }) {
    return (
        <li>
            <Link href={href} className="block hover:translate-x-[-5px] transition-transform hover:text-white">
                {label}
            </Link>
        </li>
    )
}
