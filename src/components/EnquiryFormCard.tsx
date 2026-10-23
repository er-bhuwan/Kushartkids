import React, { useState } from 'react';
import { Send, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { EnquirySubmission } from '../types/catalog';
import { validateEnquiryForm, buildWhatsAppEnquiryUrl } from '../utils/catalogLogic';

interface EnquiryFormCardProps {
  formType: EnquirySubmission['type'];
  title: string;
  subtitle: string;
  defaultQuantity?: number;
  defaultCategoryOrProduct?: string;
  organizationLabel?: string;
  onSaveEnquiry: (enquiry: EnquirySubmission) => void;
}

export const EnquiryFormCard: React.FC<EnquiryFormCardProps> = ({
  formType,
  title,
  subtitle,
  defaultQuantity = 25,
  defaultCategoryOrProduct = 'Customized School Books',
  organizationLabel = 'School / Organization or Birthday Child Name',
  onSaveEnquiry,
}) => {
  const [name, setName] = useState('');
  const [orgOrChild, setOrgOrChild] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState<number>(defaultQuantity);
  const [productCategory, setProductCategory] = useState(defaultCategoryOrProduct);
  const [customizationDetails, setCustomizationDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<EnquirySubmission | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEnquiryForm({
      name,
      phone,
      email,
      quantity,
      customizationDetails,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    const newSubmission: EnquirySubmission = {
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type: formType,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      name: name.trim(),
      organizationOrChildName: orgOrChild.trim() || 'Individual Customer',
      phone: phone.trim(),
      email: email.trim(),
      quantity,
      productIdOrCategory: productCategory,
      customizationDetails: customizationDetails.trim(),
      status: 'Saved Locally — Ready for WhatsApp/Email Follow-up',
    };

    onSaveEnquiry(newSubmission);
    setSubmittedEnquiry(newSubmission);
  };

  return (
    <div className="clay-surface p-6 sm:p-8">
      <div className="mb-6">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">{subtitle}</p>
      </div>

      {submittedEnquiry ? (
        <div className="clay-pastel-mint p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              Enquiry {submittedEnquiry.id} Recorded Successfully!
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Thank you, <strong>{submittedEnquiry.name}</strong> ({submittedEnquiry.organizationOrChildName}).
            We have logged your quotation request for{' '}
            <strong className="tabular-nums">{submittedEnquiry.quantity} copies</strong> of{' '}
            <strong>{submittedEnquiry.productIdOrCategory}</strong>.
          </p>
          <p className="text-xs text-slate-600 bg-white/85 p-3 rounded-xl border border-emerald-200">
            <strong>MVP Transparency Note:</strong> Your enquiry is saved in your current session
            log. Live automated email/database storage is not yet active—click below to send this
            formatted quotation directly to Kush Art Kids on WhatsApp if you wish.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={buildWhatsAppEnquiryUrl({
                subject: `${title} (${submittedEnquiry.id})`,
                productName: submittedEnquiry.productIdOrCategory,
                quantity: submittedEnquiry.quantity,
                customerName: `${submittedEnquiry.name} (${submittedEnquiry.organizationOrChildName})`,
                notes: submittedEnquiry.customizationDetails,
              })}
              target="_blank"
              rel="noopener noreferrer"
              className="clay-btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Send Enquiry via WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setSubmittedEnquiry(null);
                setCustomizationDetails('');
              }}
              className="clay-btn-secondary py-2.5 px-4 text-xs font-semibold cursor-pointer"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${formType}-name`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Your Full Name *
              </label>
              <input
                id={`${formType}-name`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Anjali Mehta"
                className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formType}-org`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                {organizationLabel}
              </label>
              <input
                id={`${formType}-org`}
                type="text"
                value={orgOrChild}
                onChange={(e) => setOrgOrChild(e.target.value)}
                placeholder="e.g., Sunshine Kids Preschool / Reyansh (Age 5)"
                className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${formType}-phone`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                WhatsApp / Mobile Number *
              </label>
              <input
                id={`${formType}-phone`}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 9876543210"
                className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formType}-email`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Email Address *
              </label>
              <input
                id={`${formType}-email`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., principal@school.edu"
                className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor={`${formType}-category`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Book Category / Package Type
              </label>
              <select
                id={`${formType}-category`}
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
              >
                <option value="Customized School Books">Customized School Books (With Logo)</option>
                <option value="Return Gift Books">Personalized Birthday Return Gift Books</option>
                <option value="Coloring Books">Coloring Books (Bulk Pack)</option>
                <option value="Scribbling Books">Toddler Scribbling Pads</option>
                <option value="Handwriting Practice">Handwriting & Cursive Workbooks</option>
                <option value="Festival Activity">Festival Activity & Cultural Books</option>
                <option value="Printable PDFs">Digital Printable PDF Licensing</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={`${formType}-qty`}
                className="block text-xs font-bold text-slate-800 mb-1"
              >
                Estimated Quantity Needed *
              </label>
              <input
                id={`${formType}-qty`}
                type="number"
                min={1}
                max={10000}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)}
                className="clay-input w-full px-3.5 py-2.5 text-xs font-bold tabular-nums text-slate-900"
              />
              {errors.quantity && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.quantity}</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor={`${formType}-details`}
              className="block text-xs font-bold text-slate-800 mb-1"
            >
              Customization, Age Group & Delivery Timeline Requirements *
            </label>
            <textarea
              id={`${formType}-details`}
              rows={3}
              value={customizationDetails}
              onChange={(e) => setCustomizationDetails(e.target.value)}
              placeholder="Tell us the target age group, page count preference, cover personalization details (child's name/theme or school logo), and required delivery date..."
              className="clay-input w-full px-3.5 py-2.5 text-xs text-slate-900"
            />
            {errors.customizationDetails && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.customizationDetails}</span>
              </p>
            )}
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              className="clay-btn-primary py-3 px-6 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Quotation Request</span>
            </button>
            <span className="text-[11px] text-slate-500">
              Response time: Within 4 business hours via WhatsApp or Email.
            </span>
          </div>
        </form>
      )}
    </div>
  );
};
