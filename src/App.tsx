import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HeroCarousel } from './components/HeroCarousel';
import { FlashSaleSection } from './components/FlashSaleSection';
import { TrendingProducts } from './components/TrendingProducts';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ReviewsCarousel } from './components/ReviewsCarousel';
import { NewsletterFAQ } from './components/NewsletterFAQ';
import { FloatingElements } from './components/FloatingElements';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { AuthModal } from './components/AuthModal';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CategoryModal } from './components/CategoryModal';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8F8F6] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 flex flex-col justify-between selection:bg-[#D4AF37] selection:text-[#0A2342] relative">
        <div className="w-full max-w-full overflow-x-hidden">
          {/* Header & Sticky Top Bar */}
          <Header />

          {/* Homepage Core Content Sections */}
          <main className="space-y-4 pb-12">
            {/* 1. Hero Banner Carousel */}
            <HeroCarousel />

            {/* 2. Flash Sale Section with Live Countdown */}
            <FlashSaleSection />

            {/* 4. Trending Products Grid */}
            <TrendingProducts />

            {/* 6. Customer Reviews & Social Proof */}
            <ReviewsCarousel />

            {/* 7. Newsletter & FAQ Section */}
            <NewsletterFAQ />
          </main>
        </div>

        {/* Footer */}
        <Footer />

        {/* Floating Utilities */}
        <FloatingElements />
        <MobileBottomNav />

        {/* Modals & Slide-over Drawers */}
        <CategoryModal />
        <ProductDetailsModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderConfirmationModal />
        <AuthModal />
        <CustomerDashboard />
        <AdminPanel />
      </div>
    </AppProvider>
  );
}
