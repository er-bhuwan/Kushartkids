import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ShoppingBag,
  Eye,
  MessageCircle,
  RotateCcw,
  CheckCircle2,
  Send,
} from 'lucide-react';
import {
  AIBookFinderCriteria,
  AIBookFinderResponse,
  Product,
  AgeGroup,
  LearningRequirement,
} from '../types/catalog';
import { PRODUCTS, AGE_GROUPS, LEARNING_REQUIREMENTS } from '../data/products';
import {
  recommendProductsFromCatalogue,
  buildWhatsAppEnquiryUrl,
} from '../utils/catalogLogic';
import { BookCoverArt } from './BookCoverArt';

interface AIBookFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const AIBookFinderModal: React.FC<AIBookFinderModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
  onAddToCart,
}) => {
  const [criteria, setCriteria] = useState<AIBookFinderCriteria>({
    recipient: 'Parent for Child',
    ageGroup: '4-6 Years',
    requirement: 'Creative Coloring',
    formatPreference: 'Physical Book',
    quantity: 1,
    freeformNotes: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<AIBookFinderResponse | null>(() =>
    recommendProductsFromCatalogue({
      recipient: 'Parent for Child',
      ageGroup: '4-6 Years',
      requirement: 'Creative Coloring',
      formatPreference: 'Physical Book',
      quantity: 1,
    })
  );

  if (!isOpen) return null;

  const handleFindBooks = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/ai-book-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria),
      });

      if (!response.ok) {
        throw new Error('Could not reach AI assistant service');
      }

      const data: AIBookFinderResponse = await response.json();
      setResult(data);
    } catch (_err) {
      // Seamless local catalogue fallback
      const fallback = recommendProductsFromCatalogue(criteria, PRODUCTS);
      setResult(fallback);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    const initial: AIBookFinderCriteria = {
      recipient: 'Parent for Child',
      ageGroup: '4-6 Years',
      requirement: 'Creative Coloring',
      formatPreference: 'Physical Book',
      quantity: 1,
      freeformNotes: '',
    };
    setCriteria(initial);
    setResult(recommendProductsFromCatalogue(initial, PRODUCTS));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-finder-title"
    >
      <div className="clay-surface w-full max-w-5xl p-6 sm:p-8 my-8 relative max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close AI Book Finder"
          className="clay-btn-secondary p-2.5 rounded-full absolute top-5 right-5 text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="max-w-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-700 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Kush Art Kids Conversational AI Book Finder</span>
          </div>
          <h2
            id="ai-finder-title"
            className="font-display text-2xl sm:text-3xl font-bold text-slate-900"
          >
            Tell Us Who You Are Shopping For
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Answer the 5 quick questions below (or add a note). Our assistant recommends
            books strictly from the verified Kush Art Kids product catalogue—never
            invented titles or prices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5-Question Conversational Form */}
          <form onSubmit={handleFindBooks} className="lg:col-span-5 clay-pastel-peach p-5 rounded-3xl space-y-4">
            {/* Q1: Who is the product for? */}
            <div>
              <label
                htmlFor="ai-q1-recipient"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                1. Who is the product for?
              </label>
              <select
                id="ai-q1-recipient"
                value={criteria.recipient}
                onChange={(e) =>
                  setCriteria({
                    ...criteria,
                    recipient: e.target.value as AIBookFinderCriteria['recipient'],
                  })
                }
                className="clay-input w-full px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="Parent for Child">Parent shopping for my child</option>
                <option value="Birthday Return Gift Host">Birthday Return Gift Host (Bulk Favors)</option>
                <option value="Preschool / School">Preschool / School Principal or Coordinator</option>
                <option value="Teacher / Tutor">Activity Teacher / Tuition Center</option>
              </select>
            </div>

            {/* Q2: Child's age */}
            <div>
              <label
                htmlFor="ai-q2-age"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                2. What is the child&apos;s age group?
              </label>
              <select
                id="ai-q2-age"
                value={criteria.ageGroup}
                onChange={(e) =>
                  setCriteria({ ...criteria, ageGroup: e.target.value as AgeGroup })
                }
                className="clay-input w-full px-3 py-2 text-xs font-medium text-slate-800"
              >
                {AGE_GROUPS.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Q3: Learning or activity requirement */}
            <div>
              <label
                htmlFor="ai-q3-requirement"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                3. Learning or activity requirement?
              </label>
              <select
                id="ai-q3-requirement"
                value={criteria.requirement}
                onChange={(e) =>
                  setCriteria({
                    ...criteria,
                    requirement: e.target.value as LearningRequirement,
                  })
                }
                className="clay-input w-full px-3 py-2 text-xs font-medium text-slate-800"
              >
                {LEARNING_REQUIREMENTS.map((req) => (
                  <option key={req.id} value={req.id}>
                    {req.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Q4: Physical book or digital PDF */}
            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1.5">
                4. Physical book or digital Printable PDF?
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Physical Book', 'Printable PDF', 'Either'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setCriteria({ ...criteria, formatPreference: fmt })}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      criteria.formatPreference === fmt
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Q5: Required quantity */}
            <div>
              <label
                htmlFor="ai-q5-quantity"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                5. Required quantity (books or packs)?
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="ai-q5-quantity"
                  type="number"
                  min={1}
                  max={2000}
                  value={criteria.quantity}
                  onChange={(e) =>
                    setCriteria({
                      ...criteria,
                      quantity: Math.max(1, parseInt(e.target.value, 10) || 1),
                    })
                  }
                  className="clay-input w-24 px-3 py-2 text-xs font-bold tabular-nums text-slate-900"
                />
                <div className="flex items-center gap-1 text-[11px]">
                  {[1, 20, 50, 100].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setCriteria({ ...criteria, quantity: q })}
                      className={`px-2 py-1 rounded-lg font-medium cursor-pointer ${
                        criteria.quantity === q
                          ? 'bg-orange-600 text-white'
                          : 'bg-white/80 text-slate-700 hover:bg-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Optional Conversational Note */}
            <div>
              <label
                htmlFor="ai-freeform-note"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Optional Chat Note (e.g., &ldquo;My toddler loves rockets&rdquo; or &ldquo;Diwali gifts&rdquo;):
              </label>
              <input
                id="ai-freeform-note"
                type="text"
                value={criteria.freeformNotes || ''}
                onChange={(e) =>
                  setCriteria({ ...criteria, freeformNotes: e.target.value })
                }
                placeholder="Type any specific topic or question..."
                className="clay-input w-full px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="clay-btn-primary flex-1 py-2.5 px-4 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{loading ? 'Finding Best Books...' : 'Get AI Recommendations'}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                aria-label="Reset AI Book Finder answers"
                className="clay-btn-secondary py-2.5 px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </form>

          {/* Right Verified Catalogue Recommendations */}
          <div className="lg:col-span-7 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                {errorMsg}
              </div>
            )}

            {result && (
              <>
                <div className="clay-pastel-mint p-4 rounded-2xl">
                  <div className="flex items-center justify-between gap-2 text-xs text-emerald-900 font-semibold mb-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Verified Catalogue Recommendations</span>
                    </span>
                    <span className="font-mono text-[11px] text-emerald-800">
                      100% Real Catalogue Match
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {result.assistantMessage}
                  </p>
                </div>

                <div className="space-y-3">
                  {result.recommendations.map((rec, index) => {
                    const product = PRODUCTS.find((p) => p.id === rec.productId);
                    if (!product) return null;

                    const unitPrice = Math.round(rec.estimatedTotal / rec.suggestedQuantity);

                    return (
                      <div
                        key={product.id}
                        className="clay-card p-4 flex flex-col sm:flex-row gap-4 items-center"
                      >
                        <div className="w-full sm:w-32 shrink-0">
                          <BookCoverArt product={product} compact className="h-36 w-full" />
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500">
                            <span className="font-bold text-orange-600">
                              #{index + 1} Match
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono">{product.id}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.ageRange}</span>
                            <span aria-hidden="true">·</span>
                            <span>{product.format}</span>
                          </div>

                          <h3 className="font-display text-base font-bold text-slate-900">
                            {product.name}
                          </h3>

                          <p className="text-xs text-emerald-800 font-medium">
                            Why it fits: {rec.matchReason}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                            <div className="text-xs tabular-nums">
                              <span className="font-bold text-slate-900 text-sm">
                                ₹{unitPrice}/unit
                              </span>
                              <span className="text-slate-500 ml-1.5">
                                · Est. Total ({rec.suggestedQuantity} qty):{' '}
                                <strong className="text-slate-900">
                                  ₹{rec.estimatedTotal}
                                </strong>
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  onSelectProduct(product);
                                }}
                                className="clay-btn-secondary py-1.5 px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onAddToCart(product, rec.suggestedQuantity)
                                }
                                className="clay-btn-primary py-1.5 px-3 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add {rec.suggestedQuantity} to Cart</span>
                              </button>
                              <a
                                href={buildWhatsAppEnquiryUrl({
                                  subject: 'AI Book Finder Match Enquiry',
                                  productName: product.name,
                                  productId: product.id,
                                  quantity: rec.suggestedQuantity,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`WhatsApp enquiry for ${product.name}`}
                                className="clay-btn-secondary p-1.5 text-emerald-700 hover:text-emerald-800"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
