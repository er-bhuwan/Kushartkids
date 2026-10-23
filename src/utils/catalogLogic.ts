import {
  Product,
  ProductCategory,
  AgeGroup,
  LearningRequirement,
  BookFormat,
  AIBookFinderCriteria,
  AIBookFinderRecommendation,
  AIBookFinderResponse,
  CartItem,
} from '../types/catalog';
import { PRODUCTS, BRAND_INFO } from '../data/products';

export interface ProductFilterOptions {
  searchQuery?: string;
  category?: ProductCategory | 'All';
  ageRange?: AgeGroup | 'All';
  requirement?: LearningRequirement | 'All';
  format?: BookFormat | 'All';
  bulkOnly?: boolean;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'pages-desc';
}

export function filterAndSortProducts(
  products: Product[],
  options: ProductFilterOptions
): Product[] {
  const {
    searchQuery = '',
    category = 'All',
    ageRange = 'All',
    requirement = 'All',
    format = 'All',
    bulkOnly = false,
    sortBy = 'featured',
  } = options;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = products.filter((product) => {
    if (category !== 'All' && product.category !== category) {
      return false;
    }
    if (ageRange !== 'All' && product.ageRange !== ageRange) {
      return false;
    }
    if (requirement !== 'All' && !product.requirements.includes(requirement)) {
      return false;
    }
    if (format !== 'All') {
      if (format === 'Printable PDF') {
        if (product.format !== 'Printable PDF' && product.format !== 'Physical + PDF Combo') {
          return false;
        }
      } else if (product.format !== format) {
        return false;
      }
    }
    if (bulkOnly && !product.bulkOrderAvailable) {
      return false;
    }
    if (normalizedQuery) {
      const searchableText = [
        product.id,
        product.name,
        product.category,
        product.ageRange,
        product.description,
        ...product.requirements,
        ...product.insideTopics,
      ]
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(normalizedQuery)) {
        return false;
      }
    }
    return true;
  });

  const sorted = [...filtered];
  if (sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'pages-desc') {
    sorted.sort((a, b) => b.pageCount - a.pageCount);
  }

  return sorted;
}

export function getEffectiveUnitPrice(product: Product, quantity: number): number {
  if (product.bulkOrderAvailable && quantity >= product.minBulkQty) {
    return product.bulkPricePerUnit;
  }
  return product.price;
}

export function recommendProductsFromCatalogue(
  criteria: AIBookFinderCriteria,
  catalogue: Product[] = PRODUCTS
): AIBookFinderResponse {
  const reqQty = Math.max(1, Number(criteria.quantity) || 1);

  const scored = catalogue.map((product) => {
    let score = 0;
    const reasons: string[] = [];

    // 1. Age match
    if (criteria.ageGroup && product.ageRange === criteria.ageGroup) {
      score += 35;
      reasons.push(`Designed for ${product.ageRange}`);
    }

    // 2. Learning or activity requirement match
    if (criteria.requirement && product.requirements.includes(criteria.requirement)) {
      score += 40;
      reasons.push(`Directly supports ${criteria.requirement}`);
    }

    // 3. Recipient context match
    if (criteria.recipient === 'Birthday Return Gift Host') {
      if (product.category === 'Return Gift Books') {
        score += 45;
        reasons.push('Dedicated personalized birthday return-gift edition');
      } else if (product.requirements.includes('Birthday Return Gifts')) {
        score += 25;
        reasons.push('Ideal for birthday return gifts');
      }
    } else if (criteria.recipient === 'Preschool / School' || criteria.recipient === 'Teacher / Tutor') {
      if (product.category === 'Customized School Books') {
        score += 45;
        reasons.push('Dedicated custom co-branded school edition');
      } else if (product.requirements.includes('School Curriculum & Bulk')) {
        score += 25;
        reasons.push('Aligned with preschool & school classroom packs');
      }
    }

    // 4. Format preference match
    if (criteria.formatPreference === 'Printable PDF') {
      if (product.format === 'Printable PDF' || product.format === 'Physical + PDF Combo') {
        score += 25;
        reasons.push(`Available as ${product.format}`);
      } else {
        score -= 20;
      }
    } else if (criteria.formatPreference === 'Physical Book') {
      if (product.format === 'Physical Book' || product.format === 'Physical + PDF Combo') {
        score += 20;
        reasons.push(`Printed on ${product.paperQuality.split('(')[0].trim()}`);
      } else {
        score -= 20;
      }
    }

    // 5. Quantity & bulk suitability
    if (reqQty >= 15) {
      if (product.bulkOrderAvailable) {
        score += 20;
        if (reqQty >= product.minBulkQty) {
          reasons.push(`Qualifies for bulk rate of ₹${product.bulkPricePerUnit}/book (min ${product.minBulkQty})`);
        } else {
          reasons.push(`Bulk-ready (discounted rate starts at ${product.minBulkQty} copies)`);
        }
      } else {
        score -= 15;
      }
    }

    // Freeform keyword bonus
    if (criteria.freeformNotes && criteria.freeformNotes.trim().length > 0) {
      const notes = criteria.freeformNotes.toLowerCase();
      const text = `${product.name} ${product.description} ${product.insideTopics.join(' ')}`.toLowerCase();
      const words = notes.split(/\s+/).filter((w) => w.length > 2);
      for (const word of words) {
        if (text.includes(word)) {
          score += 10;
        }
      }
    }

    const unitPrice = getEffectiveUnitPrice(product, reqQty);
    return {
      product,
      score,
      matchReason:
        reasons.length > 0
          ? reasons.join(' · ')
          : `Popular ${product.category} choice for ${product.ageRange}`,
      suggestedQuantity: reqQty,
      estimatedTotal: unitPrice * reqQty,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const topPicks = scored.slice(0, 3);

  const recommendations: AIBookFinderRecommendation[] = topPicks.map((item) => ({
    productId: item.product.id,
    matchReason: item.matchReason,
    suggestedQuantity: item.suggestedQuantity,
    estimatedTotal: item.estimatedTotal,
  }));

  const summaryParts: string[] = [];
  if (criteria.recipient) summaryParts.push(`for a ${criteria.recipient.toLowerCase()}`);
  if (criteria.ageGroup) summaryParts.push(`age group ${criteria.ageGroup}`);
  if (criteria.requirement) summaryParts.push(`focusing on ${criteria.requirement}`);

  const assistantMessage =
    `Based on your request ${summaryParts.join(', ')} (Quantity: ${reqQty}), here are the top verified matches from the Kush Art Kids catalogue. ` +
    (reqQty >= 15
      ? `Since you need ${reqQty} copies, we have prioritized books with bulk-order availability and automatic tiered pricing.`
      : `Every recommendation below uses verified catalogue pricing and direct links.`);

  return {
    assistantMessage,
    recommendations,
    source: 'catalogue-engine',
  };
}

export function sanitizeAIRecommendations(
  rawAssistantMessage: string,
  rawRecs: Array<{ productId?: string; matchReason?: string }>,
  criteria: AIBookFinderCriteria,
  catalogue: Product[] = PRODUCTS
): AIBookFinderResponse {
  const reqQty = Math.max(1, Number(criteria.quantity) || 1);
  const validMap = new Map<string, Product>(catalogue.map((p) => [p.id, p]));

  const verifiedRecs: AIBookFinderRecommendation[] = [];
  const seenIds = new Set<string>();

  for (const item of rawRecs || []) {
    if (!item?.productId || seenIds.has(item.productId)) continue;
    const realProduct = validMap.get(item.productId);
    if (!realProduct) {
      // Never allow invented or hallucinated product IDs
      continue;
    }
    seenIds.add(realProduct.id);
    const unitPrice = getEffectiveUnitPrice(realProduct, reqQty);
    verifiedRecs.push({
      productId: realProduct.id,
      matchReason:
        item.matchReason?.trim() ||
        `Verified match for ${realProduct.ageRange} (${realProduct.category})`,
      suggestedQuantity: reqQty,
      estimatedTotal: unitPrice * reqQty,
    });
  }

  if (verifiedRecs.length === 0) {
    return recommendProductsFromCatalogue(criteria, catalogue);
  }

  return {
    assistantMessage:
      rawAssistantMessage?.trim() ||
      'Here are the best matches from the official Kush Art Kids product catalogue:',
    recommendations: verifiedRecs.slice(0, 3),
    source: 'gemini-ai',
  };
}

export interface CartSummaryLine {
  product: Product;
  quantity: number;
  unitPrice: number;
  retailUnitPrice: number;
  lineTotal: number;
  lineSavings: number;
  isBulkApplied: boolean;
  customNote?: string;
}

export interface CartSummary {
  lines: CartSummaryLine[];
  totalItems: number;
  subtotal: number;
  totalSavings: number;
  shippingFee: number;
  grandTotal: number;
}

export function calculateCartSummary(
  cartItems: CartItem[],
  catalogue: Product[] = PRODUCTS
): CartSummary {
  const productMap = new Map<string, Product>(catalogue.map((p) => [p.id, p]));
  const lines: CartSummaryLine[] = [];
  let totalItems = 0;
  let subtotal = 0;
  let totalSavings = 0;
  let hasPhysicalItem = false;

  for (const item of cartItems) {
    if (item.quantity <= 0) continue;
    const product = productMap.get(item.productId);
    if (!product) continue;

    const unitPrice = getEffectiveUnitPrice(product, item.quantity);
    const isBulkApplied = product.bulkOrderAvailable && item.quantity >= product.minBulkQty;
    const lineTotal = unitPrice * item.quantity;
    const lineSavings = (product.price - unitPrice) * item.quantity;

    if (product.format !== 'Printable PDF') {
      hasPhysicalItem = true;
    }

    lines.push({
      product,
      quantity: item.quantity,
      unitPrice,
      retailUnitPrice: product.price,
      lineTotal,
      lineSavings,
      isBulkApplied,
      customNote: item.customNote,
    });

    totalItems += item.quantity;
    subtotal += lineTotal;
    totalSavings += lineSavings;
  }

  const shippingFee = !hasPhysicalItem || subtotal === 0 || subtotal >= 499 ? 0 : 49;
  const grandTotal = subtotal + shippingFee;

  return {
    lines,
    totalItems,
    subtotal,
    totalSavings,
    shippingFee,
    grandTotal,
  };
}

export interface FormValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateEnquiryForm(input: {
  name: string;
  phone: string;
  email: string;
  quantity: number;
  customizationDetails: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};

  if (!input.name || input.name.trim().length < 2) {
    errors.name = 'Please enter your full name (at least 2 characters).';
  }

  const cleanPhone = (input.phone || '').replace(/[\s\-+()]/g, '');
  if (!/^\d{10,15}$/.test(cleanPhone)) {
    errors.phone = 'Please enter a valid 10-digit mobile or WhatsApp number.';
  }

  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    errors.email = 'Please enter a valid email address for quotation delivery.';
  }

  if (!Number.isFinite(input.quantity) || input.quantity < 1) {
    errors.quantity = 'Please enter a valid quantity of at least 1 book.';
  }

  if (!input.customizationDetails || input.customizationDetails.trim().length < 8) {
    errors.customizationDetails =
      'Please share brief requirements (age group, theme, or delivery timeline).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function buildWhatsAppEnquiryUrl(params: {
  subject: string;
  productName?: string;
  productId?: string;
  quantity?: number;
  customerName?: string;
  notes?: string;
}): string {
  const parts: string[] = [
    `Hello Kush Art Kids!`,
    `Enquiry Type: ${params.subject}`,
  ];
  if (params.productName) {
    parts.push(`Product: ${params.productName} (${params.productId || 'Catalogue Item'})`);
  }
  if (params.quantity) {
    parts.push(`Required Quantity: ${params.quantity}`);
  }
  if (params.customerName) {
    parts.push(`From: ${params.customerName}`);
  }
  if (params.notes) {
    parts.push(`Details: ${params.notes}`);
  }
  const encoded = encodeURIComponent(parts.join('\n'));
  return `https://wa.me/${BRAND_INFO.whatsappNumber}?text=${encoded}`;
}
