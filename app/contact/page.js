import ContactClient from "@/components/ContactClient";

export const metadata = {
  title: "Contact Us | Greenfibre B2B Corporate Desk & Factory Inquiries",
  description:
    "Connect with Greenfibre for wholesale inquiries, custom Pantone color-matching, bespoke compression molds, corporate hampers, and physical sample requests."
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Unified Page Header */}
      <div className="space-y-1.5 sm:space-y-2">
        <div className="badge-green">
          Get in Touch
        </div>
        <h1 className="page-title">
          Looking for the Right Supplier? Let&apos;s Talk
        </h1>
        <p className="page-desc">
          Share your requirement, whether it is bulk orders, custom colors, logo branding or packaging, and our team will get back to you with the right solution and pricing.
        </p>
      </div>

      {/* Main Interactive Contact Section */}
      <ContactClient />
    </div>
  );
}
