export type ProductCategory =
  | 'Coloring Books'
  | 'Scribbling Books'
  | 'Handwriting Practice'
  | 'Festival Activity'
  | 'Printable PDFs'
  | 'Return Gift Books'
  | 'Customized School Books';

export type AgeGroup =
  | '2-4 Years'
  | '4-6 Years'
  | '6-8 Years'
  | '8-10 Years';

export type LearningRequirement =
  | 'Fine Motor & Scribbling'
  | 'Creative Coloring'
  | 'Handwriting & Tracing'
  | 'Festival & Culture Learning'
  | 'Screen-Free Activity & Logic'
  | 'Birthday Return Gifts'
  | 'School Curriculum & Bulk';

export type BookFormat =
  | 'Physical Book'
  | 'Printable PDF'
  | 'Physical + PDF Combo';

export type PageRoute =
  | 'home'
  | 'shop-all'
  | 'shop-by-age'
  | 'shop-by-requirement'
  | 'printable-pdfs'
  | 'school-solutions'
  | 'return-gifts'
  | 'custom-request'
  | 'about'
  | 'contact';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  ageRange: AgeGroup;
  requirements: LearningRequirement[];
  description: string;
  pageCount: number;
  format: BookFormat;
  price: number;
  coverImage: string;
  purchaseUrl: string;
  bulkOrderAvailable: boolean;
  minBulkQty: number;
  bulkPricePerUnit: number;
  isSampleData: boolean;
  paperQuality: string;
  insideTopics: string[];
  coverPalette: {
    bgFrom: string;
    bgTo: string;
    accent: string;
    motif: 'jungle' | 'scribble' | 'alphabet' | 'festival' | 'mandala' | 'return-gift' | 'school' | 'numbers' | 'vehicles' | 'dino';
  };
}

export interface CartItem {
  productId: string;
  quantity: number;
  customNote?: string;
}

export interface AIBookFinderCriteria {
  recipient: 'Parent for Child' | 'Birthday Return Gift Host' | 'Preschool / School' | 'Teacher / Tutor' | '';
  ageGroup: AgeGroup | '';
  requirement: LearningRequirement | '';
  formatPreference: 'Physical Book' | 'Printable PDF' | 'Either' | '';
  quantity: number;
  freeformNotes?: string;
}

export interface AIBookFinderRecommendation {
  productId: string;
  matchReason: string;
  suggestedQuantity: number;
  estimatedTotal: number;
}

export interface AIBookFinderResponse {
  assistantMessage: string;
  recommendations: AIBookFinderRecommendation[];
  source: 'gemini-ai' | 'catalogue-engine';
}

export interface EnquirySubmission {
  id: string;
  type: 'bulk-school' | 'return-gift' | 'custom-quote' | 'general-contact';
  createdAt: string;
  name: string;
  organizationOrChildName: string;
  phone: string;
  email: string;
  quantity: number;
  productIdOrCategory: string;
  customizationDetails: string;
  status: 'Saved Locally — Ready for WhatsApp/Email Follow-up';
}
