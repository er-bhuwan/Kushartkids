import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  Download,
  School,
  Gift,
  FileSpreadsheet,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  Info,
  Award,
  HeartHandshake,
  Printer,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  AgeGroup,
  LearningRequirement,
  BookFormat,
  PageRoute,
  EnquirySubmission,
} from '../types/catalog';
import {
  PRODUCTS,
  CATEGORIES,
  AGE_GROUPS,
  LEARNING_REQUIREMENTS,
  BRAND_INFO,
} from '../data/products';
import {
  filterAndSortProducts,
  buildWhatsAppEnquiryUrl,
} from '../utils/catalogLogic';
import { ProductCard } from './ProductCard';
import { BookCoverArt } from './BookCoverArt';
import { EnquiryFormCard } from './EnquiryFormCard';

interface PageViewsProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, customNote?: string) => void;
  onBuyNow: (product: Product, quantity?: number) => void;
  onOpenAIFinder: () => void;
  enquiries: EnquirySubmission[];
  onSaveEnquiry: (enquiry: EnquirySubmission) => void;
}

export const PageViews: React.FC<PageViewsProps> = ({
  activePage,
  onNavigate,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
  onOpenAIFinder,
  enquiries,
  onSaveEnquiry,
}) => {
  // Filter states for Shop All
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [selectedAge, setSelectedAge] = useState<AgeGroup | 'All'>('All');
  const [selectedFormat, setSelectedFormat] = useState<BookFormat | 'All'>('All');
  const [bulkOnly, setBulkOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'pages-desc'>('featured');

  // Dedicated states for Shop by Age & Shop by Requirement
  const [activeAgeTab, setActiveAgeTab] = useState<AgeGroup>('2-4 Years');
  const [activeRequirementTab, setActiveRequirementTab] = useState<LearningRequirement>(
    'Fine Motor & Scribbling'
  );

  // Interactive preview states for School & Return Gifts & Custom Builder
  const [schoolPreviewName, setSchoolPreviewName] = useState('Little Lotus International Preschool');
  const [birthdayPreviewName, setBirthdayPreviewName] = useState("Aarav's 5th Jungle Safari Party");
  const [returnGiftQty, setReturnGiftQty] = useState(25);
  const [customSpecPages, setCustomSpecPages] = useState(48);
  const [customSpecGsm, setCustomSpecGsm] = useState('120 GSM Ivory Maplitho');
  const [customSpecQty, setCustomSpecQty] = useState(100);

  // Sample Data Banner component
  const renderSampleCatalogueBanner = () => (
    <div className="clay-pastel-lemon px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800 mb-6">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0" />
        <span>
          <strong>Sample Catalogue Mode:</strong> Products are clearly marked as sample entries for
          MVP testing. Replace with verified Kush Art Kids SKUs & live payment links before launch.
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenAIFinder}
        className="font-bold text-orange-700 hover:text-orange-800 underline whitespace-nowrap shrink-0 cursor-pointer"
      >
        Try AI Book Finder →
      </button>
    </div>
  );

  // ============================================================================
  // 1. HOME PAGE (Strict 3-4 Section Discipline per E-Commerce Design Reference)
  // ============================================================================
  if (activePage === 'home') {
    const featuredBooks = PRODUCTS.slice(0, 6);

    return (
      <div className="space-y-16">
        {/* SECTION 1: Storefront Hero */}
        <section className="clay-pastel-peach rounded-3xl p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-orange-800">
                <span>Screen-Free Creative Learning</span>
                <span aria-hidden="true">·</span>
                <span>Ages 2 to 10 Years</span>
                <span aria-hidden="true">·</span>
                <span>Retail & Bulk Custom Orders</span>
              </div>

              <h1
                className="font-display font-bold text-slate-900 tracking-tight leading-[1.12]"
                style={{ fontSize: 'clamp(2.1rem, 3.8vw, 3.4rem)', textWrap: 'balance' }}
              >
                Coloring, Handwriting & Custom Activity Books That Spark Joyful Focus
              </h1>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                Thoughtfully illustrated coloring books, toddler scribbling pads, step-by-step
                handwriting workbooks, Indian festival activity kits, printable PDFs, personalized
                birthday return gifts, and co-branded school books by{' '}
                <strong>Kush Art Kids</strong>.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('shop-all')}
                  className="clay-btn-primary py-3.5 px-6 text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Shop All Books</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onOpenAIFinder}
                  className="clay-btn-secondary py-3.5 px-5 text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-orange-600" />
                  <span>Ask AI Book Finder</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('school-solutions')}
                  className="py-2.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 underline whitespace-nowrap shrink-0 cursor-pointer"
                >
                  School & Return-Gift Bulk Quotes
                </button>
              </div>
            </div>

            {/* Right Hero Showcase Card */}
            <div className="lg:col-span-5">
              <div className="clay-surface p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={BRAND_INFO.logoUrl}
                    alt="Kush Art Kids Official Brand Emblem"
                    referrerPolicy="no-referrer"
                    className="h-20 w-auto object-contain shrink-0"
                  />
                  <div>
                    <p className="text-xs font-semibold text-orange-700">
                      Official Brand Storefront
                    </p>
                    <h2 className="font-display text-lg font-bold text-slate-900">
                      Built for Parents, Preschools & Party Hosts
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Thick bleed-resistant paper · Instant PDF downloads · Custom cover printing
                    </p>
                  </div>
                </div>

                {/* Mini Preview of 2 Flagship Books */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {PRODUCTS.slice(0, 2).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onSelectProduct(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectProduct(item);
                        }
                      }}
                      className="cursor-pointer group"
                    >
                      <BookCoverArt product={item} compact className="h-44 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full-Width 4-Column Quick Pathways Strip below Hero Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-orange-200/60">
            <button
              type="button"
              onClick={() => onNavigate('shop-by-age')}
              className="clay-card p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <span className="text-xs text-slate-500 block">Ages 2–10 Years</span>
                <span className="font-display text-sm font-bold text-slate-900">
                  Shop Books by Age Group
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-600 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('printable-pdfs')}
              className="clay-card p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <span className="text-xs text-slate-500 block">Instant Download</span>
                <span className="font-display text-sm font-bold text-slate-900">
                  Printable PDF Worksheets
                </span>
              </div>
              <Download className="w-4 h-4 text-purple-600 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('return-gifts')}
              className="clay-card p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <span className="text-xs text-slate-500 block">Custom Child Name Cover</span>
                <span className="font-display text-sm font-bold text-slate-900">
                  Personalized Return Gifts
                </span>
              </div>
              <Gift className="w-4 h-4 text-pink-600 shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('school-solutions')}
              className="clay-card p-4 text-left flex items-center justify-between gap-3 cursor-pointer"
            >
              <div>
                <span className="text-xs text-slate-500 block">50+ Bulk School Packs</span>
                <span className="font-display text-sm font-bold text-slate-900">
                  Custom School Curriculum
                </span>
              </div>
              <School className="w-4 h-4 text-emerald-600 shrink-0" />
            </button>
          </div>
        </section>

        {/* SECTION 2: Featured Product Collection */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-orange-700 mb-1">
                Curated Bestsellers & Sample Catalogue
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                Explore Popular Books & Activity Kits
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('shop-by-requirement')}
                className="clay-btn-secondary py-2 px-4 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                Filter by Learning Goal
              </button>
              <button
                type="button"
                onClick={() => onNavigate('shop-all')}
                className="clay-btn-primary py-2 px-4 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer"
              >
                View All {PRODUCTS.length} Books →
              </button>
            </div>
          </div>

          {renderSampleCatalogueBanner()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredBooks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p, q) => onAddToCart(p, q)}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        </section>

        {/* SECTION 3: Craftsmanship, Educator Proof & AI Book Finder Banner */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 clay-pastel-mint p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold text-emerald-800">
                Why Parents & Schools Trust Kush Art Kids
              </p>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Thick Bleed-Resistant Paper & Child-Centric Stroke Progression
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Ordinary coloring books use thin 60 GSM paper that tears under toddler pressure.
                Our physical books use 100–140 GSM natural-shade art paper with rounded corners and
                age-graded boundary outlines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <blockquote className="bg-white/90 p-4 rounded-2xl text-xs text-slate-700 space-y-2">
                <p className="italic">
                  &ldquo;Before switching to Kush Art Kids, our Nursery students struggled with cramped
                  tracing lines. With the 64-page Step-by-Step Alphabet Workbook, 92% of our batch
                  achieved confident pencil grip within 8 weeks.&rdquo;
                </p>
                <footer className="font-semibold text-slate-900">
                  — Meera Deshmukh, Academic Head, Blooming Buds Preschool (Pune)
                </footer>
              </blockquote>

              <blockquote className="bg-white/90 p-4 rounded-2xl text-xs text-slate-700 space-y-2">
                <p className="italic">
                  &ldquo;We ordered 35 personalized Jungle Safari coloring books for my son’s 4th
                  birthday return gifts. Every parent messaged us saying the custom cover with his
                  name was the most thoughtful plastic-free gift!&rdquo;
                </p>
                <footer className="font-semibold text-slate-900">
                  — Rohini & Vikram Nair, Parents of Vivaan (Bengaluru)
                </footer>
              </blockquote>
            </div>
          </div>

          <div className="lg:col-span-5 clay-pastel-lavender p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-800">
                <Sparkles className="w-4 h-4" />
                <span>Guided Book Recommendation Assistant</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Not Sure Which Book Fits Your Child or Event?
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Answer 5 simple questions—who it&apos;s for, child&apos;s age, learning goal,
                physical vs PDF format, and required quantity—and get instant, verified matches
                from our catalogue.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={onOpenAIFinder}
                className="clay-btn-primary w-full py-3.5 px-5 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch AI Book Finder</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('custom-request')}
                className="clay-btn-secondary w-full py-3 px-5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-purple-700" />
                <span>Request Custom Book Quotation</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ============================================================================
  // 2. SHOP ALL BOOKS PAGE
  // ============================================================================
  if (activePage === 'shop-all') {
    const filteredProducts = filterAndSortProducts(PRODUCTS, {
      searchQuery,
      category: selectedCategory,
      ageRange: selectedAge,
      format: selectedFormat,
      bulkOnly,
      sortBy,
    });

    return (
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-orange-700 mb-1">
              Complete Kush Art Kids Catalogue
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Shop All Children&apos;s Books & Printable Packs
            </h1>
          </div>
          <button
            type="button"
            onClick={onOpenAIFinder}
            className="clay-btn-secondary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Need Help Choosing? Ask AI Finder</span>
          </button>
        </div>

        {renderSampleCatalogueBanner()}

        {/* Search & Filter Control Bar */}
        <div className="clay-surface p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                aria-label="Search books by title, topic, ID, or skill"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, skill, festival, or ID (e.g., cursive, mandala)..."
                className="clay-input w-full pl-10 pr-4 py-2.5 text-xs text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filter by age group"
                value={selectedAge}
                onChange={(e) => setSelectedAge(e.target.value as AgeGroup | 'All')}
                className="clay-input w-full px-3 py-2.5 text-xs font-medium text-slate-800"
              >
                <option value="All">All Ages (2–10 Yrs)</option>
                {AGE_GROUPS.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                aria-label="Filter by book format"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as BookFormat | 'All')}
                className="clay-input w-full px-3 py-2.5 text-xs font-medium text-slate-800"
              >
                <option value="All">All Formats</option>
                <option value="Physical Book">Physical Books</option>
                <option value="Printable PDF">Printable PDFs</option>
                <option value="Physical + PDF Combo">Physical + PDF Combo</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'pages-desc'
                  )
                }
                className="clay-input w-full px-3 py-2.5 text-xs font-medium text-slate-800"
              >
                <option value="featured">Sort: Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="pages-desc">Page Count: Most Pages</option>
              </select>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <div
              className="flex flex-wrap items-center gap-1.5"
              role="group"
              aria-label="Product category filters"
            >
              {(['All', ...CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={bulkOnly}
                onChange={(e) => setBulkOnly(e.target.checked)}
                className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <span>Bulk-Order Eligible Only</span>
            </label>
          </div>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing <strong className="text-slate-900 tabular-nums">{filteredProducts.length}</strong>{' '}
            of {PRODUCTS.length} catalogue items
          </span>
          {(searchQuery ||
            selectedCategory !== 'All' ||
            selectedAge !== 'All' ||
            selectedFormat !== 'All' ||
            bulkOnly) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedAge('All');
                setSelectedFormat('All');
                setBulkOnly(false);
              }}
              className="font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="clay-surface p-12 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              No Books Match Those Exact Filters
            </h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Try clearing one of your active filters or request a custom book tailored to your
              exact topic and age group.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedAge('All');
                  setSelectedFormat('All');
                  setBulkOnly(false);
                }}
                className="clay-btn-secondary py-2 px-4 text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={() => onNavigate('custom-request')}
                className="clay-btn-primary py-2 px-4 text-xs font-bold cursor-pointer"
              >
                Request Custom Book
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={(p, q) => onAddToCart(p, q)}
                onBuyNow={onBuyNow}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 3. SHOP BY AGE PAGE
  // ============================================================================
  if (activePage === 'shop-by-age') {
    const currentStage = AGE_GROUPS.find((a) => a.id === activeAgeTab) || AGE_GROUPS[0];
    const ageProducts = filterAndSortProducts(PRODUCTS, { ageRange: activeAgeTab });

    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-orange-700 mb-1">
            Developmental Stage Matcher
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Shop Books by Child&apos;s Age Group
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Every Kush Art Kids book is graded by line thickness, stroke complexity, and paper
            durability to match your child&apos;s fine-motor milestones.
          </p>
        </div>

        {/* 4 Developmental Stage Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {AGE_GROUPS.map((stage) => {
            const isSelected = stage.id === activeAgeTab;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveAgeTab(stage.id)}
                className={`p-5 rounded-3xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'clay-pastel-peach ring-2 ring-orange-500'
                    : 'clay-card hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-bold text-orange-700 block mb-1">
                  {stage.label}
                </span>
                <h3 className="font-display text-base font-bold text-slate-900 mb-1.5">
                  {stage.stageTitle}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{stage.subtitle}</p>
              </button>
            );
          })}
        </div>

        {/* Active Age Stage Banner */}
        <div className="clay-pastel-sky p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Showing Books for {currentStage.label}: {currentStage.stageTitle}
            </h2>
            <p className="text-xs text-slate-700">
              Key skills developed: {currentStage.skillsFocused.join(' · ')}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenAIFinder}
            className="clay-btn-primary py-2.5 px-4 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalize with AI Book Finder</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ageProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={(p, q) => onAddToCart(p, q)}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 4. SHOP BY REQUIREMENT PAGE
  // ============================================================================
  if (activePage === 'shop-by-requirement') {
    const activeReqObj =
      LEARNING_REQUIREMENTS.find((r) => r.id === activeRequirementTab) ||
      LEARNING_REQUIREMENTS[0];
    const reqProducts = filterAndSortProducts(PRODUCTS, {
      requirement: activeRequirementTab,
    });

    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs font-semibold text-orange-700 mb-1">
            Goal-Oriented Learning & Gifting
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Shop by Learning or Activity Requirement
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Select a specific learning skill, cultural theme, or gifting occasion below to filter
            matching books from our catalogue.
          </p>
        </div>

        {/* Requirement Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_REQUIREMENTS.map((req) => {
            const isSelected = req.id === activeRequirementTab;
            return (
              <button
                key={req.id}
                type="button"
                onClick={() => setActiveRequirementTab(req.id)}
                className={`p-5 rounded-3xl text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'clay-pastel-mint ring-2 ring-emerald-600'
                    : 'clay-card'
                }`}
              >
                <h3 className="font-display text-base font-bold text-slate-900 mb-1">
                  {req.title}
                </h3>
                <p className="text-xs text-slate-600 mb-2">{req.shortDesc}</p>
                <p className="text-[11px] font-semibold text-emerald-800">
                  Best for: {req.recommendedFor}
                </p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <h2 className="font-display text-2xl font-bold text-slate-900">
            Verified Books for &ldquo;{activeReqObj.title}&rdquo; ({reqProducts.length})
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('custom-request')}
            className="text-xs font-bold text-orange-700 hover:text-orange-800 underline cursor-pointer"
          >
            Need a Custom Topic Book? Request Quote →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reqProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={(p, q) => onAddToCart(p, q)}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 5. PRINTABLE PDFS PAGE
  // ============================================================================
  if (activePage === 'printable-pdfs') {
    const pdfProducts = filterAndSortProducts(PRODUCTS, { format: 'Printable PDF' });

    return (
      <div className="space-y-10">
        <div className="clay-pastel-lavender p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-purple-800">
              <Printer className="w-4 h-4" />
              <span>Instant Digital Downloads · 300 DPI Print-Ready PDFs</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Printable PDF Activity Packs & Digital Combo Books
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
              Print at home as many times as your child wants! Ideal for travel busy-binders,
              rainy afternoons, and repeated handwriting practice without waiting for shipping.
            </p>
          </div>

          <div className="lg:col-span-4 clay-surface p-5 space-y-2.5 text-xs">
            <h3 className="font-display text-sm font-bold text-slate-900">
              How Printable PDFs Work:
            </h3>
            <p className="text-slate-600">1. Choose any Printable PDF or Combo pack below.</p>
            <p className="text-slate-600">
              2. Format: Standard A4 & US Letter compatible (300 DPI vector outlines).
            </p>
            <p className="text-slate-600">
              3. Print single pages on 80–120 GSM paper or laminate for reusable dry-erase marker play.
            </p>
          </div>
        </div>

        {renderSampleCatalogueBanner()}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {pdfProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onAddToCart={(p, q) => onAddToCart(p, q)}
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 6. SCHOOL SOLUTIONS PAGE
  // ============================================================================
  if (activePage === 'school-solutions') {
    const schoolBook = PRODUCTS.find((p) => p.id === 'KAK-SCH-010') || PRODUCTS[0];
    const bulkBooks = PRODUCTS.filter((p) => p.bulkOrderAvailable);

    return (
      <div className="space-y-12">
        {/* Hero & Live Co-Branded Cover Simulator */}
        <div className="clay-pastel-sky p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-900">
              <School className="w-4 h-4" />
              <span>B2B Preschool & Primary School Partner Program</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Customized School Workbooks with Your Institution&apos;s Logo & Syllabus
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Partner with <strong>Kush Art Kids</strong> for your annual book kits. We customize
              front & back covers with your school crest, Principal&apos;s message, academic
              calendar, and NEP-2020 aligned skill assessment pages for Playgroup, Nursery, LKG,
              UKG, and Grades 1–4.
            </p>

            <div className="clay-surface p-4 max-w-md">
              <label
                htmlFor="school-live-preview"
                className="block text-xs font-bold text-slate-800 mb-1.5"
              >
                Try Live School Cover Co-Branding Preview:
              </label>
              <input
                id="school-live-preview"
                type="text"
                value={schoolPreviewName}
                onChange={(e) => setSchoolPreviewName(e.target.value)}
                placeholder="Type your Preschool or School Name..."
                className="clay-input w-full px-3 py-2 text-xs font-semibold text-slate-900"
              />
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-xs">
              <BookCoverArt
                product={schoolBook}
                customSchoolName={schoolPreviewName}
                className="h-72 w-full"
              />
              <p className="text-center text-xs text-slate-600 mt-2 font-medium">
                Live Preview: Co-Branded Cover for {schoolPreviewName || 'Your School'}
              </p>
            </div>
          </div>
        </div>

        {/* School Bulk Tier Table & Enquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 clay-surface p-6 space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              School Bulk Pricing Tiers (Sample Rates)
            </h2>
            <p className="text-xs text-slate-600">
              All bulk school orders include complimentary cover layout design and pan-India
              institutional dispatch.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-2 pr-2 font-semibold">Catalogue Book</th>
                    <th className="py-2 px-2 font-semibold tabular-nums">Min Qty</th>
                    <th className="py-2 px-2 font-semibold tabular-nums">MRP</th>
                    <th className="py-2 pl-2 font-semibold text-emerald-700 tabular-nums">
                      School Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bulkBooks.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2.5 pr-2 font-medium text-slate-800">
                        {b.name.replace(' (Sample)', '')}
                      </td>
                      <td className="py-2.5 px-2 tabular-nums text-slate-600">
                        {b.minBulkQty}+
                      </td>
                      <td className="py-2.5 px-2 tabular-nums text-slate-500 line-through">
                        ₹{b.price}
                      </td>
                      <td className="py-2.5 pl-2 font-bold text-emerald-700 tabular-nums">
                        ₹{b.bulkPricePerUnit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryFormCard
              formType="bulk-school"
              title="School & Institutional Bulk Order Enquiry Form"
              subtitle="Request a formal institutional quotation, sample specimen copies, or custom syllabus mapping."
              defaultQuantity={100}
              defaultCategoryOrProduct="Customized School Books"
              organizationLabel="Preschool / School Name & City *"
              onSaveEnquiry={onSaveEnquiry}
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 7. PERSONALIZED RETURN GIFTS PAGE
  // ============================================================================
  if (activePage === 'return-gifts') {
    const returnGiftBook = PRODUCTS.find((p) => p.id === 'KAK-RET-007') || PRODUCTS[0];
    const unitRate = returnGiftQty >= 15 ? returnGiftBook.bulkPricePerUnit : returnGiftBook.price;
    const estimatedTotal = unitRate * returnGiftQty;

    return (
      <div className="space-y-12">
        <div className="clay-pastel-peach p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-pink-800">
              <Gift className="w-4 h-4" />
              <span>Zero-Plastic, Meaningful Birthday Party Favors</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Personalized Birthday Return-Gift Activity Books
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Delight every little guest at your child&apos;s birthday party with a custom-printed
              coloring and activity book featuring your child&apos;s name, party theme (Jungle,
              Space, Unicorn, Dinosaur, or Festival), and a warm thank-you note inside.
            </p>

            {/* Live Birthday Cover Customizer & Budget Estimator */}
            <div className="clay-surface p-5 space-y-4 max-w-xl">
              <div>
                <label
                  htmlFor="bday-name-preview"
                  className="block text-xs font-bold text-slate-800 mb-1"
                >
                  1. Type Birthday Child&apos;s Name & Party Theme for Live Cover Preview:
                </label>
                <input
                  id="bday-name-preview"
                  type="text"
                  value={birthdayPreviewName}
                  onChange={(e) => setBirthdayPreviewName(e.target.value)}
                  className="clay-input w-full px-3 py-2 text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label
                    htmlFor="bday-qty-calc"
                    className="block text-xs font-bold text-slate-800 mb-1"
                  >
                    2. Number of Kids / Return Gift Packs:
                  </label>
                  <input
                    id="bday-qty-calc"
                    type="number"
                    min={5}
                    max={500}
                    value={returnGiftQty}
                    onChange={(e) =>
                      setReturnGiftQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                    }
                    className="clay-input w-24 px-3 py-1.5 text-xs font-bold tabular-nums"
                  />
                </div>

                <div className="text-right tabular-nums">
                  <span className="text-xs text-slate-500 block">
                    Estimated Package Total ({returnGiftQty} copies @ ₹{unitRate}/book)
                  </span>
                  <span className="text-2xl font-bold text-slate-900">₹{estimatedTotal}</span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAddToCart(
                      returnGiftBook,
                      returnGiftQty,
                      `Birthday Cover: ${birthdayPreviewName}`
                    )
                  }
                  className="clay-btn-primary py-2.5 px-4 text-xs font-bold cursor-pointer"
                >
                  Add {returnGiftQty} Gift Books to Cart
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-xs">
              <BookCoverArt
                product={returnGiftBook}
                customChildName={birthdayPreviewName}
                className="h-72 w-full"
              />
              <p className="text-center text-xs text-slate-600 mt-2 font-medium">
                Live Cover Preview: &ldquo;{birthdayPreviewName}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* Return Gift Enquiry Form */}
        <EnquiryFormCard
          formType="return-gift"
          title="Personalized Return-Gift Customization & Bulk Enquiry"
          subtitle="Share your party date, theme preference, and guest count. We share a digital cover proof before printing."
          defaultQuantity={25}
          defaultCategoryOrProduct="Return Gift Books"
          organizationLabel="Birthday Child's Name & Age"
          onSaveEnquiry={onSaveEnquiry}
        />
      </div>
    );
  }

  // ============================================================================
  // 8. CUSTOM BOOK REQUEST PAGE
  // ============================================================================
  if (activePage === 'custom-request') {
    const estimatedPerCopy =
      customSpecPages <= 32 ? 85 : customSpecPages <= 48 ? 105 : 130;
    const estimatedCustomQuote = estimatedPerCopy * customSpecQty;

    return (
      <div className="space-y-10">
        <div>
          <p className="text-xs font-semibold text-orange-700 mb-1">
            Bespoke Publishing & White-Label Activity Books
          </p>
          <h1 className="font-display text-3xl font-bold text-slate-900">
            Custom Book Quotation Request
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Need a completely custom coloring book, corporate family-day kit, hospital pediatric
            activity pad, or regional language handwriting workbook? Configure your specs below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Specification Estimator */}
          <div className="lg:col-span-5 clay-pastel-lemon p-6 rounded-3xl space-y-4">
            <h2 className="font-display text-xl font-bold text-slate-900">
              Interactive Custom Spec Estimator
            </h2>

            <div>
              <span className="block text-xs font-bold text-slate-800 mb-1.5">
                1. Target Page Count (Inner Pages):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[32, 48, 64].map((pCount) => (
                  <button
                    key={pCount}
                    type="button"
                    onClick={() => setCustomSpecPages(pCount)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold tabular-nums cursor-pointer ${
                      customSpecPages === pCount
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-800'
                    }`}
                  >
                    {pCount} Pages
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="custom-gsm-select"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                2. Paper Stock Quality:
              </label>
              <select
                id="custom-gsm-select"
                value={customSpecGsm}
                onChange={(e) => setCustomSpecGsm(e.target.value)}
                className="clay-input w-full px-3 py-2 text-xs font-medium text-slate-800"
              >
                <option value="100 GSM High-Opacity Maplitho">
                  100 GSM High-Opacity Maplitho (Handwriting & Tracing)
                </option>
                <option value="120 GSM Ivory Maplitho">
                  120 GSM Ivory Maplitho (Crayon & Sketch Coloring)
                </option>
                <option value="140 GSM Premium Art Cartridge">
                  140 GSM Premium Art Cartridge (Water-Color & Brush Pen)
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="custom-qty-input"
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                3. Print Run Quantity:
              </label>
              <input
                id="custom-qty-input"
                type="number"
                min={25}
                max={10000}
                value={customSpecQty}
                onChange={(e) =>
                  setCustomSpecQty(Math.max(25, parseInt(e.target.value, 10) || 25))
                }
                className="clay-input w-full px-3 py-2 text-xs font-bold tabular-nums"
              />
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1">
              <span className="text-xs text-slate-500 block">
                Indicative Ballpark Estimate (Sample Guide):
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-xl font-bold text-slate-900 tabular-nums">
                  ₹{estimatedCustomQuote}
                </span>
                <span className="text-xs font-semibold text-emerald-800 tabular-nums">
                  ~₹{estimatedPerCopy}/copy ({customSpecPages}p · {customSpecQty} units)
                </span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Submit the quotation form on the right for an exact print & shipping quote.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryFormCard
              formType="custom-quote"
              title="Custom Book Quotation Request Form"
              subtitle="Provide your custom book specifications and our editorial team will prepare a formal quotation."
              defaultQuantity={customSpecQty}
              defaultCategoryOrProduct={`Custom ${customSpecPages}-Page Book (${customSpecGsm})`}
              organizationLabel="School / Brand / Event Name"
              onSaveEnquiry={onSaveEnquiry}
            />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 9. ABOUT KUSH ART KIDS PAGE
  // ============================================================================
  if (activePage === 'about') {
    return (
      <div className="space-y-12">
        <div className="clay-pastel-peach p-6 sm:p-10 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <p className="text-xs font-semibold text-orange-800">
              About Our Brand & Pedagogical Philosophy
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
              Nurturing Creative Confidence in Every Child, One Page at a Time
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              <strong>Kush Art Kids</strong> was founded with a clear mission: to replace passive
              screen time with tactile, joyful, and developmentally structured books. From a
              2-year-old&apos;s very first jumbo crayon scribble to an 8-year-old&apos;s mindful
              Indian folk-art mandala, every page is designed to build fine-motor confidence,
              handwriting fluency, and cultural pride.
            </p>
          </div>
          <div className="lg:col-span-4 flex justify-center">
            <div className="clay-surface p-6 text-center space-y-3">
              <img
                src={BRAND_INFO.logoUrl}
                alt="Kush Art Kids Logo"
                referrerPolicy="no-referrer"
                className="h-28 w-auto mx-auto object-contain"
              />
              <p className="font-display text-sm font-bold text-slate-900">
                Designed for Curious Young Artists
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="clay-card p-6 space-y-2">
            <Award className="w-6 h-6 text-orange-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Child-Safe, Bleed-Resistant Paper
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We print on 100 GSM to 140 GSM glare-free ivory and cartridge paper so wax crayons,
              color pencils, and sketch pens stay vibrant without tearing pages.
            </p>
          </div>

          <div className="clay-card p-6 space-y-2">
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Occupational-Therapy Aligned Progression
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toddlers start with 4mm thick outlines and open scribble paths before moving to
              guided stroke arrows, 4-line phonics grids, and joined cursive sentences.
            </p>
          </div>

          <div className="clay-card p-6 space-y-2">
            <HeartHandshake className="w-6 h-6 text-purple-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Flexible for Parents, Party Hosts & Schools
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether you need a single instant Printable PDF at home, 25 personalized birthday
              return gifts, or 500 co-branded preschool workbooks, we support your order size.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 10. CONTACT US PAGE (Plus Saved Session Enquiries Log)
  // ============================================================================
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 space-y-6">
          <div className="clay-pastel-mint p-6 rounded-3xl space-y-4">
            <p className="text-xs font-semibold text-emerald-800">
              Direct Parent & Institutional Support
            </p>
            <h1 className="font-display text-3xl font-bold text-slate-900">
              Contact Kush Art Kids
            </h1>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Have a question about an order, custom birthday return gifts, or school bulk
              pricing? Reach out via WhatsApp or submit the enquiry form.
            </p>

            <div className="space-y-2.5 pt-2 text-xs text-slate-800">
              <div>
                <span className="text-slate-500 block">WhatsApp & Direct Helpline</span>
                <span className="font-mono font-bold">+{BRAND_INFO.whatsappNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Email Support</span>
                <span className="font-semibold">{BRAND_INFO.supportEmail}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Service Coverage</span>
                <span className="font-semibold">{BRAND_INFO.location}</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppEnquiryUrl({
                  subject: 'General Website Enquiry',
                  notes: 'Hello Kush Art Kids! I would like to enquire about your books.',
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn-primary w-full py-3 px-4 text-xs font-bold flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Us on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Saved Enquiries in Current Session */}
          <div className="clay-surface p-6 space-y-3">
            <h2 className="font-display text-base font-bold text-slate-900">
              Your Recent Enquiries ({enquiries.length})
            </h2>
            {enquiries.length === 0 ? (
              <p className="text-xs text-slate-500">
                Any bulk order, return gift, or custom book quotation requests you submit during
                this session will appear here for easy reference.
              </p>
            ) : (
              <div className="space-y-2.5">
                {enquiries.map((enq) => (
                  <div
                    key={enq.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                      <span>{enq.id}</span>
                      <span>{enq.createdAt}</span>
                    </div>
                    <p className="font-bold text-slate-900">
                      {enq.productIdOrCategory} · Qty: {enq.quantity}
                    </p>
                    <p className="text-slate-600">
                      {enq.name} ({enq.organizationOrChildName})
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium">{enq.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <EnquiryFormCard
            formType="general-contact"
            title="Send Us a Message or Bulk Enquiry"
            subtitle="Fill in your details below and we will get back to you promptly."
            defaultQuantity={10}
            defaultCategoryOrProduct="Coloring Books"
            organizationLabel="City / Institution (Optional)"
            onSaveEnquiry={onSaveEnquiry}
          />
        </div>
      </div>
    </div>
  );
};
