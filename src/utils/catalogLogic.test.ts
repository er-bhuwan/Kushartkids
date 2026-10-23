import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAndSortProducts,
  getEffectiveUnitPrice,
  recommendProductsFromCatalogue,
  sanitizeAIRecommendations,
  calculateCartSummary,
  validateEnquiryForm,
  buildWhatsAppEnquiryUrl,
} from './catalogLogic';
import { PRODUCTS } from '../data/products';

test('filterAndSortProducts filters by category, age group, and printable PDF format', () => {
  const coloringBooks = filterAndSortProducts(PRODUCTS, { category: 'Coloring Books' });
  assert.ok(coloringBooks.length >= 2);
  assert.ok(coloringBooks.every((p) => p.category === 'Coloring Books'));

  const toddlers = filterAndSortProducts(PRODUCTS, { ageRange: '2-4 Years' });
  assert.ok(toddlers.length >= 2);
  assert.ok(toddlers.every((p) => p.ageRange === '2-4 Years'));

  const pdfs = filterAndSortProducts(PRODUCTS, { format: 'Printable PDF' });
  assert.ok(pdfs.length >= 2);
  assert.ok(
    pdfs.every((p) => p.format === 'Printable PDF' || p.format === 'Physical + PDF Combo')
  );
});

test('getEffectiveUnitPrice applies bulk pricing only when quantity meets minBulkQty', () => {
  const returnGiftBook = PRODUCTS.find((p) => p.id === 'KAK-RET-007')!;
  assert.equal(getEffectiveUnitPrice(returnGiftBook, 5), 135);
  assert.equal(getEffectiveUnitPrice(returnGiftBook, 15), 95);
  assert.equal(getEffectiveUnitPrice(returnGiftBook, 30), 95);
});

test('recommendProductsFromCatalogue returns only verified catalogue IDs and accurate bulk totals', () => {
  const res = recommendProductsFromCatalogue({
    recipient: 'Birthday Return Gift Host',
    ageGroup: '4-6 Years',
    requirement: 'Birthday Return Gifts',
    formatPreference: 'Physical Book',
    quantity: 25,
  });

  assert.ok(res.recommendations.length > 0);
  const validIds = new Set(PRODUCTS.map((p) => p.id));
  for (const rec of res.recommendations) {
    assert.ok(validIds.has(rec.productId), `Product ID ${rec.productId} must exist in catalogue`);
    assert.equal(rec.suggestedQuantity, 25);
  }
  assert.equal(res.recommendations[0].productId, 'KAK-RET-007');
  assert.equal(res.recommendations[0].estimatedTotal, 25 * 95);
});

test('sanitizeAIRecommendations rejects hallucinated product IDs and falls back safely', () => {
  const sanitized = sanitizeAIRecommendations(
    'Here are your recommendations',
    [
      { productId: 'FAKE-INVENTED-999', matchReason: 'Hallucinated book' },
      { productId: 'KAK-SCH-010', matchReason: 'Real custom school book' },
    ],
    {
      recipient: 'Preschool / School',
      ageGroup: '4-6 Years',
      requirement: 'School Curriculum & Bulk',
      formatPreference: 'Physical Book',
      quantity: 60,
    }
  );

  assert.equal(sanitized.recommendations.length, 1);
  assert.equal(sanitized.recommendations[0].productId, 'KAK-SCH-010');
  assert.equal(sanitized.recommendations[0].estimatedTotal, 60 * 135);
});

test('calculateCartSummary computes subtotal, bulk savings, and shipping threshold', () => {
  const summary = calculateCartSummary([
    { productId: 'KAK-COL-001', quantity: 20 }, // 20 * 89 = 1780 (saves 20 * 40 = 800)
  ]);

  assert.equal(summary.totalItems, 20);
  assert.equal(summary.subtotal, 1780);
  assert.equal(summary.totalSavings, 800);
  assert.equal(summary.shippingFee, 0); // Free shipping >= 499
  assert.equal(summary.grandTotal, 1780);
});

test('validateEnquiryForm catches empty or invalid fields and passes valid data', () => {
  const invalid = validateEnquiryForm({
    name: 'A',
    phone: '123',
    email: 'not-an-email',
    quantity: 0,
    customizationDetails: 'short',
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.quantity);
  assert.ok(invalid.errors.customizationDetails);

  const valid = validateEnquiryForm({
    name: 'Priya Sharma',
    phone: '+91 9876543210',
    email: 'priya@littlelotuspreschool.in',
    quantity: 50,
    customizationDetails: 'Need 50 custom LKG handwriting books with our preschool logo.',
  });
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test('buildWhatsAppEnquiryUrl encodes product and quantity cleanly', () => {
  const url = buildWhatsAppEnquiryUrl({
    subject: 'Bulk School Enquiry',
    productName: 'Custom School Book',
    productId: 'KAK-SCH-010',
    quantity: 100,
  });
  assert.ok(url.startsWith('https://wa.me/'));
  assert.ok(url.includes('KAK-SCH-010'));
});
