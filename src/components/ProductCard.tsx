import React from 'react';
import { Eye, ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';
import { Product } from '../types/catalog';
import { BookCoverArt } from './BookCoverArt';
import { buildWhatsAppEnquiryUrl } from '../utils/catalogLogic';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}) => {
  const whatsappUrl = buildWhatsAppEnquiryUrl({
    subject: 'Product Enquiry',
    productName: product.name,
    productId: product.id,
    quantity: 1,
  });

  return (
    <article className="clay-card flex flex-col justify-between p-5 h-full group">
      <div>
        {/* Product Cover Image Area (65-75% visual dominance) */}
        <div
          onClick={() => onSelectProduct(product)}
          role="button"
          tabIndex={0}
          aria-label={`View details for ${product.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelectProduct(product);
            }
          }}
          className="cursor-pointer mb-4 focus-visible:outline-2 focus-visible:outline-orange-500 rounded-2xl"
        >
          <BookCoverArt product={product} className="h-60 w-full transition-transform duration-200 group-hover:scale-[1.01]" />
        </div>

        {/* Clean Unboxed Metadata with Middot Separators (Zero-Pill Rule) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-1.5">
          <span className="font-mono text-[11px] text-slate-600">{product.id}</span>
          <span aria-hidden="true">·</span>
          <span>{product.ageRange}</span>
          <span aria-hidden="true">·</span>
          <span>{product.pageCount} Pages</span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-700">{product.format}</span>
        </div>

        {/* Product Title */}
        <h3 className="font-display text-base font-bold text-slate-900 leading-snug mb-2">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-left hover:text-orange-600 transition-colors focus-visible:outline-2 focus-visible:outline-orange-500 rounded"
          >
            {product.name}
          </button>
        </h3>

        {/* Concise Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>

      {/* Pricing & Contiguous Action Footer */}
      <div className="pt-3 border-t border-slate-100">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              ₹{product.price}
            </span>
            {product.bulkOrderAvailable && (
              <span className="ml-2 text-xs text-emerald-700 font-medium tabular-nums">
                Bulk: ₹{product.bulkPricePerUnit}/unit ({product.minBulkQty}+)
              </span>
            )}
          </div>
          <span className="text-[11px] text-amber-800 font-medium">
            Sample Item
          </span>
        </div>

        {/* Primary & Secondary Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          <button
            type="button"
            onClick={() => onAddToCart(product, 1)}
            className="clay-btn-secondary py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>Add to Cart</span>
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(product)}
            className="clay-btn-primary py-2 px-3 text-xs font-semibold flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            <span>Buy Now</span>
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => onSelectProduct(product)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 py-1 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview & Specs</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp enquiry for ${product.name}`}
            className="text-xs font-medium text-emerald-700 hover:text-emerald-800 flex items-center gap-1 py-1 whitespace-nowrap shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Enquiry</span>
          </a>
        </div>
      </div>
    </article>
  );
};
