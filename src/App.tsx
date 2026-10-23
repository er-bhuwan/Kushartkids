/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Sparkles,
  MessageCircle,
  Menu,
  X,
} from 'lucide-react';
import {
  PageRoute,
  Product,
  CartItem,
  EnquirySubmission,
} from './types/catalog';
import { BRAND_INFO } from './data/products';
import { calculateCartSummary, buildWhatsAppEnquiryUrl } from './utils/catalogLogic';
import { PageViews } from './components/PageViews';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AIBookFinderModal } from './components/AIBookFinderModal';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';

const ALL_PAGES: { id: PageRoute; label: string; shortLabel: string }[] = [
  { id: 'home', label: 'Home', shortLabel: 'Home' },
  { id: 'shop-all', label: 'Shop All Books', shortLabel: 'Shop All' },
  { id: 'shop-by-age', label: 'Shop by Age', shortLabel: 'By Age' },
  { id: 'shop-by-requirement', label: 'Shop by Requirement', shortLabel: 'By Requirement' },
  { id: 'printable-pdfs', label: 'Printable PDFs', shortLabel: 'Printable PDFs' },
  { id: 'school-solutions', label: 'School Solutions', shortLabel: 'Schools' },
  { id: 'return-gifts', label: 'Personalized Return Gifts', shortLabel: 'Return Gifts' },
  { id: 'custom-request', label: 'Custom Book Request', shortLabel: 'Custom Book' },
  { id: 'about', label: 'About Kush Art Kids', shortLabel: 'About Us' },
  { id: 'contact', label: 'Contact Us', shortLabel: 'Contact' },
];

export default function App() {
  const [activePage, setActivePage] = useState<PageRoute>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAIFinderOpen, setIsAIFinderOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([
    { productId: 'KAK-COL-001', quantity: 1 },
  ]);

  const [enquiries, setEnquiries] = useState<EnquirySubmission[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProduct(null);
        setIsAIFinderOpen(false);
        setIsCartOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const cartSummary = calculateCartSummary(cartItems);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const handleNavigate = (page: PageRoute) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity: number, customNote?: string) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.productId === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          customNote: customNote || updated[existingIndex].customNote,
        };
        return updated;
      }
      return [...prev, { productId: product.id, quantity, customNote }];
    });
    showToast(`Added ${quantity} × "${product.name.replace(' (Sample)', '')}" to your bag.`);
  };

  const handleBuyNow = (product: Product, quantity = 1) => {
    handleAddToCart(product, quantity);
    setSelectedProduct(null);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleSaveEnquiry = (enquiry: EnquirySubmission) => {
    setEnquiries((prev) => [enquiry, ...prev]);
    showToast(`Enquiry ${enquiry.id} recorded! Ready for WhatsApp or email follow-up.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-slate-800">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (5 Concise Nav Links) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Zone 1: Brand Title (Single text wordmark) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavigate('home');
            }}
            className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Kush Art Kids
          </a>

          {/* Zone 2: 5 Primary Single-Line Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            {(
              [
                { id: 'home', label: 'Home' },
                { id: 'shop-all', label: 'Shop Books' },
                { id: 'printable-pdfs', label: 'Printable PDFs' },
                { id: 'school-solutions', label: 'School Solutions' },
                { id: 'return-gifts', label: 'Return Gifts' },
              ] as const
            ).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigate(item.id);
                }}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 py-1 ${
                  activePage === item.id
                    ? 'text-orange-600 font-semibold border-b-2 border-orange-500'
                    : ''
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: 1 Primary Action (Cart / Bag Button) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartSummary.totalItems} items`}
              className="clay-btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="tabular-nums">Bag ({cartSummary.totalItems})</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle all pages menu"
              className="md:hidden clay-btn-secondary p-2 text-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Workspace Sub-Navigation Toolbar: Direct 1-Click Access to All 10 Pages + AI Book Finder */}
      <div className="bg-slate-100/75 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 overflow-x-auto">
          <div
            className="flex items-center gap-1.5"
            role="navigation"
            aria-label="All Storefront Pages"
          >
            {ALL_PAGES.map((page) => {
              const isActive = activePage === page.id;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => handleNavigate(page.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/90'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {page.shortLabel}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setIsAIFinderOpen(true)}
            className="clay-btn-secondary px-3.5 py-1.5 text-xs font-bold text-orange-700 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>AI Book Finder</span>
          </button>
        </div>

        {/* Mobile Expandable Drawer for All 10 Pages */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-4 py-3 grid grid-cols-2 gap-2">
            {ALL_PAGES.map((page) => (
              <button
                key={page.id}
                type="button"
                onClick={() => handleNavigate(page.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                  activePage === page.id
                    ? 'bg-orange-50 text-orange-700 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Non-intrusive Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 clay-surface px-4 py-3 text-xs font-semibold text-slate-900 border border-orange-200 max-w-sm shadow-lg"
        >
          {toastMessage}
        </div>
      )}

      {/* Main Storefront Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <PageViews
          activePage={activePage}
          onNavigate={handleNavigate}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onOpenAIFinder={() => setIsAIFinderOpen(true)}
          enquiries={enquiries}
          onSaveEnquiry={handleSaveEnquiry}
        />
      </main>

      {/* Storefront Footer */}
      <footer className="bg-white border-t border-slate-200/80 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4 space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={BRAND_INFO.logoUrl}
                  alt="Kush Art Kids Logo"
                  referrerPolicy="no-referrer"
                  className="h-12 w-auto object-contain"
                />
                <span className="font-display text-lg font-bold text-slate-900">
                  Kush Art Kids
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {BRAND_INFO.tagline}. Screen-free coloring books, toddler scribbling pads,
                handwriting workbooks, festival activity kits, printable PDFs, personalized birthday
                return gifts, and custom school books.
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Shop & Discover</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('shop-all')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Shop All Books
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('shop-by-age')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Shop by Age (2–10 Yrs)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('shop-by-requirement')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Shop by Learning Goal
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('printable-pdfs')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Printable PDF Worksheets
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => setIsAIFinderOpen(true)}
                      className="text-orange-700 font-semibold hover:text-orange-800 cursor-pointer"
                    >
                      AI Book Finder Assistant
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-bold text-slate-900">Bulk & Custom Orders</h3>
                <ul className="space-y-1.5 text-slate-600">
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('school-solutions')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      School Solutions (Bulk)
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('return-gifts')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Personalized Return Gifts
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('custom-request')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Custom Book Quotation
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('about')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      About Kush Art Kids
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => handleNavigate('contact')}
                      className="hover:text-slate-900 cursor-pointer"
                    >
                      Contact Us ({enquiries.length} Saved)
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3 text-xs">
              <h3 className="font-bold text-slate-900">Direct WhatsApp Desk</h3>
              <p className="text-slate-600">
                Need sample pages or a custom quote for your preschool or child&apos;s birthday?
              </p>
              <a
                href={buildWhatsAppEnquiryUrl({
                  subject: 'Storefront Footer Enquiry',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn-secondary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-2 text-emerald-700"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Kush Art Kids. All rights reserved.</p>
            <p>{BRAND_INFO.sampleNotice}</p>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onNavigateToPage={handleNavigate}
      />

      {/* Conversational AI Book Finder Modal */}
      <AIBookFinderModal
        isOpen={isAIFinderOpen}
        onClose={() => setIsAIFinderOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
        onAddToCart={(product, qty) => handleAddToCart(product, qty)}
      />

      {/* Mobile-Friendly Cart & Checkout Drawer */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
