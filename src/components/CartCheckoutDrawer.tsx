import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { CartItem, Product } from '../types/catalog';
import {
  calculateCartSummary,
  buildWhatsAppEnquiryUrl,
} from '../utils/catalogLogic';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const summary = calculateCartSummary(cartItems);

  const handlePlaceOrderPreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (summary.lines.length === 0) return;

    if (customerName.trim().length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    const cleanPhone = customerPhone.replace(/[\s\-+()]/g, '');
    if (!/^\d{10,15}$/.test(cleanPhone)) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (customerAddress.trim().length < 5) {
      setFormError('Please enter your delivery city/address or email for PDF delivery.');
      return;
    }

    setFormError(null);
    const newId = `KAK-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderPlacedId(newId);
  };

  const whatsappCartSummaryUrl = buildWhatsAppEnquiryUrl({
    subject: 'Cart Order & Checkout Request',
    customerName: customerName || 'Customer',
    quantity: summary.totalItems,
    notes: summary.lines
      .map((l) => `${l.product.id} (${l.product.name.replace(' (Sample)', '')}) x ${l.quantity} = ₹${l.lineTotal}`)
      .join('; ') + ` | Grand Total: ₹${summary.grandTotal}`,
  });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-title"
    >
      <div className="bg-[#FFFDF9] w-full max-w-lg h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-slate-200">
        {/* Top Bar */}
        <div className="p-5 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
            <h2 id="cart-drawer-title" className="font-display text-xl font-bold text-slate-900">
              Your Kush Art Kids Bag ({summary.totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="clay-btn-secondary p-2 rounded-full text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {orderPlacedId ? (
            <div className="clay-pastel-mint p-6 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>Order Summary Generated ({orderPlacedId})</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Thank you, <strong>{customerName}</strong>! Your order summary for{' '}
                <strong>{summary.totalItems} item(s)</strong> totaling{' '}
                <strong className="tabular-nums">₹{summary.grandTotal}</strong> is ready.
              </p>
              <div className="p-3 bg-white/90 rounded-2xl border border-amber-200 text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Transparent MVP Checkout Status</span>
                </p>
                <p>
                  Live payment gateway processing and automated email dispatch are not yet
                  connected in this MVP preview. Use the direct product purchase links below or send
                  your pre-filled order directly to our team via WhatsApp.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <a
                  href={whatsappCartSummaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="clay-btn-primary w-full py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order {orderPlacedId} on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setOrderPlacedId(null);
                    onClearCart();
                    onClose();
                  }}
                  className="clay-btn-secondary w-full py-2.5 px-4 text-xs font-semibold cursor-pointer"
                >
                  Clear Bag & Continue Browsing
                </button>
              </div>
            </div>
          ) : summary.lines.length === 0 ? (
            <div className="clay-card p-8 text-center space-y-3 my-8">
              <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-slate-800">
                Your Book Bag is Empty
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Explore our coloring books, scribbling pads, handwriting workbooks, printable PDFs,
                or birthday return gifts.
              </p>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div className="space-y-3">
                {summary.lines.map((line) => (
                  <div
                    key={line.product.id}
                    className="clay-card p-4 flex flex-col gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-500">
                          {line.product.id} · {line.product.format}
                        </span>
                        <h4 className="font-display text-sm font-bold text-slate-900">
                          {line.product.name}
                        </h4>
                        {line.customNote && (
                          <p className="text-xs text-orange-700 font-medium mt-0.5">
                            {line.customNote}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(line.product.id)}
                        aria-label={`Remove ${line.product.name} from bag`}
                        className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(line.product.id, line.quantity - 1)
                          }
                          aria-label={`Decrease quantity of ${line.product.name}`}
                          className="clay-btn-secondary w-7 h-7 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateQuantity(line.product.id, line.quantity + 1)
                          }
                          aria-label={`Increase quantity of ${line.product.name}`}
                          className="clay-btn-secondary w-7 h-7 flex items-center justify-center text-xs font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right tabular-nums">
                        <span className="text-sm font-bold text-slate-900">
                          ₹{line.lineTotal}
                        </span>
                        <span className="block text-[11px] text-slate-500">
                          ₹{line.unitPrice}/unit{' '}
                          {line.isBulkApplied && (
                            <strong className="text-emerald-700">(Bulk Rate)</strong>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Direct Purchase URL Link per item */}
                    <div className="flex items-center justify-between text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl">
                      <span className="text-slate-600 truncate">
                        Direct Checkout Link:
                      </span>
                      <a
                        href={line.product.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 shrink-0"
                      >
                        <span>Open Purchase URL</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile-Friendly Checkout Form */}
              <form
                onSubmit={handlePlaceOrderPreview}
                className="clay-pastel-peach p-4 rounded-2xl space-y-3"
              >
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Quick Checkout & Order Verification
                </h3>

                {formError && (
                  <p className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5">
                    {formError}
                  </p>
                )}

                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Parent or School Coordinator Name"
                    className="clay-input w-full px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="clay-input w-full px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-slate-800 mb-1"
                  >
                    Delivery Address & Email (for Printable PDFs) *
                  </label>
                  <input
                    id="checkout-address"
                    type="text"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    placeholder="City, Pincode & Email Address"
                    className="clay-input w-full px-3 py-2 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="clay-btn-primary w-full py-3 px-4 text-xs font-bold cursor-pointer"
                >
                  Generate Order Summary (₹{summary.grandTotal})
                </button>
              </form>
            </>
          )}
        </div>

        {/* Bottom Subtotal Footer */}
        {summary.lines.length > 0 && !orderPlacedId && (
          <div className="p-5 bg-white border-t border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 tabular-nums">
              <span>Subtotal ({summary.totalItems} items)</span>
              <span>₹{summary.subtotal}</span>
            </div>
            {summary.totalSavings > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold tabular-nums">
                <span>Bulk Order Discount Applied</span>
                <span>-₹{summary.totalSavings}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 tabular-nums">
              <span>Shipping (Free on PDFs & orders ₹499+)</span>
              <span>{summary.shippingFee === 0 ? 'FREE' : `₹${summary.shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-100 tabular-nums">
              <span>Total Amount</span>
              <span>₹{summary.grandTotal}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
