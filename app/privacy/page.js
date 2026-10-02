import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Building2,
  ChevronRight,
  Eye,
  Server,
  UserCheck,
  Ban
} from "lucide-react";

export const metadata = {
  title: "Privacy & Replacement Policy • B2B Enterprise Protection | Green Fibre",
  description:
    "Official Privacy, Data Protection, and Transit Damage Replacement Policy for Green Fibre B2B wholesale buyers, enterprise clients, and institutional partners."
};

export default function PrivacyPage() {
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
            <span className="text-slate-900 font-bold">Privacy &amp; Replacement Policy</span>
          </nav>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-700" />
              <span>Data Protection &amp; Replacement Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Privacy &amp; Replacement Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              At <strong>Green Fibre</strong> (Powered by Charvik Moulds and Product Private Limited), we maintain rigorous corporate data confidentiality, enterprise procurement privacy, and clear transparent policies for item replacements and damage resolution.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Legal Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">

            {/* REPLACEMENT & CANCELLATION POLICY BOX */}
            <div className="bg-emerald-50/70 border-2 border-emerald-300 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center flex-shrink-0 font-bold shadow-2xs">
                  <RefreshCw className="w-5 h-5 text-emerald-700" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                    B2B Replacement &amp; Order Amendment Policy
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-900/90 leading-relaxed">
                    Transparent, fair, and binding standards regarding transit damage, item replacements, and order locking:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                {/* Rule 1: Transit Damage */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Damage in Transit</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    Any damaged or defective item is <strong>replaced free of charge</strong> upon photo verification within 48h of delivery.
                  </p>
                </div>

                {/* Rule 2: Pre-PO Item Change */}
                <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                    <RefreshCw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Pre-PO Changes</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    If you don&apos;t want an item, <strong>we will replace/swap it</strong> before final Purchase Order (PO) sign-off.
                  </p>
                </div>

                {/* Rule 3: Post-Payment Lock */}
                <div className="bg-white p-4 rounded-2xl border border-amber-200 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                    <Ban className="w-4 h-4 text-amber-700 flex-shrink-0" />
                    <span>Post-Payment Lock</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                    Once payment is made or factory inventory/raw materials are blocked, <strong>no cancellations or changes are allowed</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Privacy & Data Collection */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  01
                </span>
                <span>Corporate Information We Collect</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  To prepare official GST quotations, coordinate custom laser mockups, and execute Pan-India logistics, we collect corporate contact details submitted during registration or quote requests:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
                  <li>Enterprise Authorized Representative Name, Corporate Email, and Phone/WhatsApp Number</li>
                  <li>Company Legal Name, Delivery City, Pincode, and GSTIN (for B2B Tax Invoicing)</li>
                  <li>Vector Logo Artwork and Laser Engraving Customization Files</li>
                </ul>
              </div>
            </div>

            {/* Section 2: How We Use Your Data */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  02
                </span>
                <span>How We Protect &amp; Utilize Your Data</span>
              </h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  Your information is utilized strictly for commercial quotation processing, sample distribution, artwork proofing, production scheduling, and GST compliance.
                </p>
                <p>
                  <strong>No Data Selling:</strong> We never sell, rent, or trade your corporate information, customer lists, or proprietary branding artwork to third parties or marketing brokers.
                </p>
              </div>
            </div>

            {/* Section 3: Artwork & Confidentiality */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  03
                </span>
                <span>Proprietary Logo &amp; Artwork Confidentiality</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All client vector logos, corporate trademarks, slogans, and employee recipient lists uploaded for laser engraving or customized packaging are treated as strictly confidential. Digital proofs and CAD files are stored on encrypted internal servers accessible solely to our dedicated optical engraving technicians.
              </p>
            </div>

            {/* Section 4: Security Standards */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  04
                </span>
                <span>Enterprise Security &amp; Encryption</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                All communication across our portal is secured with 256-bit TLS encryption. Corporate account passwords utilize one-way SHA-256 cryptographic hashing. One-Time Passwords (OTPs) generated for password resets expire automatically within 10 minutes.
              </p>
            </div>

            {/* Section 5: Policy Amendments */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-brand-100 text-brand-800 font-extrabold text-xs flex items-center justify-center border border-brand-200">
                  05
                </span>
                <span>Policy Updates &amp; Regulatory Compliance</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We regularly review our privacy practices to comply with applicable Indian IT Acts, GST billing mandates, and data protection guidelines. Continued use of the portal after policy publication signifies acceptance of the updated terms.
              </p>
            </div>

          </div>

          {/* Sidebar Highlights (4 cols) */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Quick Contact Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Support &amp; Claims Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                For transit replacement claims, order inquiries, or privacy questions:
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
                  <span>Udyog Kendra 2, Greater Noida 201306</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <Link
                  href="/terms"
                  className="btn-secondary w-full py-2 text-xs font-bold text-center block"
                >
                  View Terms &amp; Conditions →
                </Link>
              </div>
            </div>

            {/* Policy Summary Callout */}
            <div className="bg-[#FAF7F0] p-6 rounded-3xl border border-[#E5DAC8] space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-brand-700" />
                <span>Our Assurance to You</span>
              </h4>
              <p className="text-slate-600 leading-relaxed">
                We are committed to long-term trust with corporate clients, fair replacement guarantees on all shipments, and strict enterprise confidentiality.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
