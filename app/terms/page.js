import Link from "next/link";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Lock,
  Truck,
  Building2,
  Phone,
  Mail,
  ChevronRight,
  BadgeCheck,
  Clock,
  Ban
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions • B2B Wholesale Supply | Green Fibre",
  description:
    "Official Terms and Conditions governing B2B wholesale orders, custom corporate branding, purchase order finalization, inventory locking, and replacement policies for Green Fibre products."
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200/90 pt-8 pb-10">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-bold">Terms &amp; Conditions</span>
          </nav>

          <div className="space-y-1.5 sm:space-y-2">
            <div className="badge-green">
              <FileText className="w-3.5 h-3.5 text-brand-700" />
              <span>B2B Commercial Terms of Supply</span>
            </div>
            <h1 className="page-title">
              Terms &amp; Conditions
            </h1>
            <p className="page-desc">
              These terms govern all wholesale quotations, purchase orders (PO), custom laser engraving, inventory allocations, and deliveries between <strong>Green Fibre</strong> (Powered by Charvik Moulds and Product Private Limited) and institutional corporate clients.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Legal Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* CRITICAL POLICY HIGHLIGHT BOX */}
            <div className="bg-amber-50/80 border-2 border-amber-200/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center justify-center flex-shrink-0 font-bold shadow-2xs">
                  <AlertTriangle className="w-5 h-5 text-amber-800" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-amber-950">
                    Important: Order Modification &amp; Inventory Lock Policy
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                    Please review our binding commercial policies regarding quotation revisions, PO finalization, and post-payment manufacturing lock:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Before PO Finalization:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    If you do not want a specific item or wish to replace it with another product or finish, <strong>we will gladly replace or adjust it</strong> prior to the finalization and countersigning of your Purchase Order (PO).
                  </p>
                </div>

                <div className="bg-white/90 p-4 rounded-2xl border border-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Ban className="w-4 h-4 text-amber-700" />
                    <span>After Payment / Inventory Block:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Once payment is received or factory inventory and raw materials are blocked/booked for your production batch, <strong>no item changes, cancellations, or substitutions can be processed</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Scope of Agreement */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  01
                </span>
                <span>Scope of Wholesale Supply</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Green Fibre manufactures and distributes sustainable homeware, tableware, drinkware, and executive gift hampers derived from agricultural rice-husk crop stubble composite. All quotations generated on this portal represent commercial wholesale pricing exclusive of applicable Goods and Services Tax (GST) unless explicitly indicated otherwise.
              </p>
            </div>

            {/* Section 2: Quotations & PO Finalization */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  02
                </span>
                <span>Quotations, PO Finalization &amp; Item Replacements</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Quotation Validity:</strong> All digital and formal GST quotations are valid for 15 calendar days from the date of issue, subject to raw material availability and production schedule slots.
                </p>
                <p>
                  <strong>Pre-PO Item Modifications &amp; Replacements:</strong> Clients are encouraged to review digital samples, 3D mockups, and product specifications carefully. If any item within the proposed bundle or quotation needs to be replaced, upgraded, or omitted, our sales team will revise the quotation without penalty prior to formal PO issuance.
                </p>
              </div>
            </div>

            {/* Section 3: Payment Terms & Production Inventory Lock */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  03
                </span>
                <span>Payment Terms &amp; Booked Inventory Lock</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Standard Payment Structure:</strong> Standard B2B orders require a 50% advance deposit upon Purchase Order confirmation to schedule machine time and block inventory, with the remaining 50% balance payable prior to factory dispatch.
                </p>
                <p>
                  <strong>Inventory &amp; Production Lock:</strong> Because custom orders involve specialized composite compounding, bespoke Kraft packaging fabrication, and computerized optical fiber laser engraving, <strong>orders become non-cancellable and non-modifiable once payment is credited or factory inventory is blocked</strong>.
                </p>
              </div>
            </div>

            {/* Section 4: Damage in Transit & Replacement Guarantee */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  04
                </span>
                <span>Transit Damage &amp; Defective Item Replacement Guarantee</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  <strong>Replacement Guarantee:</strong> We pack all tableware and gift hampers in heavy-duty FSC-certified corrugated master cartons with custom honeycomb cushioning. In the rare event that any item is damaged during transit or exhibits a manufacturing flaw, <strong>Green Fibre will replace the damaged item(s) promptly at zero additional cost</strong>.
                </p>
                <p>
                  <strong>Claim Procedure:</strong> The client must notify our B2B desk within <strong>48 hours of shipment delivery</strong> by emailing clear photos/videos of the damaged units along with the consignment bill to <a href="mailto:support.greenfibre@gmail.com" className="text-brand-700 font-bold underline">support.greenfibre@gmail.com</a>. Replacement dispatches are prioritized within 2–4 business days.
                </p>
              </div>
            </div>

            {/* Section 5: Custom Laser Branding & Artwork Approvals */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  05
                </span>
                <span>Laser Branding &amp; Digital Proof Approvals</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Clients must supply high-resolution vector artwork (.ai, .svg, .eps, or high-res .pdf). Green Fibre delivers a 3D digital proof showing exact positioning, dimensions, and finish within 4 business hours. Production begins only upon client written confirmation of the proof. Green Fibre is not liable for typographical errors present in client-approved proofs.
              </p>
            </div>

            {/* Section 6: GST Compliance & Tax Invoicing */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  06
                </span>
                <span>GST Compliance &amp; Input Tax Credit</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Official GST tax invoices are furnished with accurate HSN codes (e.g., HSN 392410 for Tableware/Kitchenware) enabling full 18% Input Tax Credit (ITC) for registered enterprise buyers under Indian tax regulations.
              </p>
            </div>

          </div>

          {/* Sidebar Highlights (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Quick Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Direct B2B Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Have questions about custom Purchase Orders, sample shipments, or volume discount tiers?
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 pt-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <a href="mailto:support.greenfibre@gmail.com" className="font-semibold hover:underline">
                    support.greenfibre@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <a href="tel:+919217328777" className="font-semibold hover:underline">
                    +91 92173 28777
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-700 flex-shrink-0" />
                  <span>Greater Noida (U.P.) 201306</span>
                </div>
              </div>
            </div>

            {/* Quality Certifications */}
            <div className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/90 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <span>Enterprise Manufacturing Standards</span>
              </h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span>100% Food-Contact Safe &amp; BPA-Free</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span>65% Natural Rice-Husk Bio Composite</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                  <span>500+ Commercial Dishwasher Cycles</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
