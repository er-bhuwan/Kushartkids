import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  Users,
  Sparkles,
} from 'lucide-react';
import { Product, PageRoute } from '../types/catalog';
import { BookCoverArt } from './BookCoverArt';
import { getEffectiveUnitPrice, buildWhatsAppEnquiryUrl } from '../utils/catalogLogic';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, customNote?: string) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onNavigateToPage: (route: PageRoute) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  onNavigateToPage,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [customPreviewName, setCustomPreviewName] = useState<string>('');
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  if (!product) return null;

  const effectiveUnitPrice = getEffectiveUnitPrice(product, quantity);
  const isBulkActive = product.bulkOrderAvailable && quantity >= product.minBulkQty;
  const totalAmount = effectiveUnitPrice * quantity;
  const totalSavings = (product.price - effectiveUnitPrice) * quantity;

  const whatsappUrl = buildWhatsAppEnquiryUrl({
    subject: isBulkActive ? 'Bulk Order Enquiry' : 'Product Detail Enquiry',
    productName: product.name,
    productId: product.id,
    quantity,
    notes: customPreviewName ? `Custom Cover Name: ${customPreviewName}` : undefined,
  });

  const handleAdd = () => {
    onAddToCart(
      product,
      quantity,
      customPreviewName ? `Personalization: ${customPreviewName}` : undefined
    );
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdp-modal-title"
    >
      <div className="clay-surface w-full max-w-4xl p-6 sm:p-8 my-8 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close product details"
          className="clay-btn-secondary p-2.5 rounded-full absolute top-5 right-5 text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Gallery & Inside Preview */}
          <div className="lg:col-span-5 space-y-4">
            <BookCoverArt
              product={product}
              customChildName={
                product.category === 'Return Gift Books' ? customPreviewName : undefined
              }
              customSchoolName={
                product.category === 'Customized School Books' ? customPreviewName : undefined
              }
              className="h-80 w-full"
            />

            {/* Optional Live Cover Personalization Preview */}
            {(product.category === 'Return Gift Books' ||
              product.category === 'Customized School Books' ||
              product.bulkOrderAvailable) && (
              <div className="clay-pastel-peach p-4 rounded-2xl">
                <label
                  htmlFor="cover-preview-input"
                  className="block text-xs font-semibold text-slate-800 mb-1.5"
                >
                  Live Cover Preview (Child Name or School Name):
                </label>
                <input
                  id="cover-preview-input"
                  type="text"
                  value={customPreviewName}
                  onChange={(e) => setCustomPreviewName(e.target.value)}
                  placeholder={
                    product.category === 'Customized School Books'
                      ? 'e.g., Little Lotus Preschool'
                      : "e.g., Aarav's 5th Birthday"
                  }
                  className="clay-input w-full px-3 py-2 text-xs text-slate-800"
                />
              </div>
            )}

            {/* What's Inside Topics */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-slate-800 mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-orange-600" />
                <span>Inside Worksheet & Activity Preview</span>
              </h4>
              <ul className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {product.insideTopics.map((topic) => (
                  <li key={topic} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="font-mono font-semibold text-slate-700">
                  ID: {product.id}
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.category}</span>
                <span aria-hidden="true">·</span>
                <span>Age {product.ageRange}</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-800 font-medium">Sample Catalogue Item</span>
              </div>

              <h2
                id="pdp-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3"
              >
                {product.name}
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Structured Product Catalogue Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block">Format</span>
                <span className="font-semibold text-slate-900">{product.format}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Page Count</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {product.pageCount} Pages
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Target Age</span>
                <span className="font-semibold text-slate-900">{product.ageRange}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block">Paper / File Spec</span>
                <span className="font-semibold text-slate-900">{product.paperQuality}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Bulk Orders</span>
                <span className="font-semibold text-emerald-700">
                  {product.bulkOrderAvailable
                    ? `Available (${product.minBulkQty}+ units)`
                    : 'Digital Single License'}
                </span>
              </div>
            </div>

            {/* Pricing & Quantity Calculator */}
            <div className="clay-pastel-sky p-4 sm:p-5 rounded-2xl space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-600 block mb-0.5">
                    {isBulkActive ? 'Bulk Discounted Unit Price' : 'Standard Unit Price'}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
                      ₹{effectiveUnitPrice}
                    </span>
                    {isBulkActive && (
                      <span className="text-sm text-slate-500 line-through tabular-nums">
                        ₹{product.price}
                      </span>
                    )}
                    <span className="text-xs text-slate-600">per copy</span>
                  </div>
                </div>

                {/* Quantity Selector + Quick Bulk Presets */}
                <div className="flex flex-col items-end">
                  <label
                    htmlFor="pdp-qty-input"
                    className="text-xs font-semibold text-slate-700 mb-1"
                  >
                    Quantity:
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="clay-btn-secondary w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      id="pdp-qty-input"
                      type="number"
                      min={1}
                      max={1000}
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))
                      }
                      className="clay-input w-16 h-8 text-center text-sm font-bold tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="clay-btn-secondary w-8 h-8 flex items-center justify-center font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {product.bulkOrderAvailable && (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-sky-200/70 text-xs">
                  <span className="text-slate-700">
                    Order <strong>{product.minBulkQty}+ copies</strong> for automatic ₹
                    {product.bulkPricePerUnit}/copy bulk pricing:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[1, product.minBulkQty, 50].map((presetQty) => (
                      <button
                        key={presetQty}
                        type="button"
                        onClick={() => setQuantity(presetQty)}
                        className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                          quantity === presetQty
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {presetQty === 1 ? '1 Copy' : `${presetQty} Copies`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-sky-200/70">
                <span className="text-xs font-semibold text-slate-700">
                  Total for {quantity} {quantity === 1 ? 'copy' : 'copies'}:
                </span>
                <div className="text-right">
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    ₹{totalAmount}
                  </span>
                  {totalSavings > 0 && (
                    <span className="block text-xs font-semibold text-emerald-700 tabular-nums">
                      You save ₹{totalSavings} with Bulk Tier!
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleAdd}
                className="clay-btn-secondary py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-orange-600" />
                <span>{addedFeedback ? 'Added to Cart!' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={() => onBuyNow(product, quantity)}
                className="clay-btn-primary py-3 px-5 text-sm font-bold flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>
                  {product.format === 'Printable PDF'
                    ? 'Buy & Download PDF'
                    : 'Buy Now / Fast Checkout'}
                </span>
              </button>
            </div>

            {/* WhatsApp & Bulk / Custom Form Routing */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp about {product.id}</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToPage('school-solutions');
                  }}
                  className="text-slate-600 hover:text-slate-900 underline cursor-pointer"
                >
                  Request Bulk School Quote
                </button>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-[11px] text-slate-500">
                  Link: {product.purchaseUrl.replace('https://', '')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
