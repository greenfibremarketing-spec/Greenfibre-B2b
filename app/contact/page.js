import ContactClient from "@/components/ContactClient";
import JsonLd from "@/components/JsonLd";

export const metadata = {
  title: "Contact Us | Corporate Desk & Factory Inquiries",
  description:
    "Connect with Greenfibre for wholesale inquiries, custom Pantone color-matching, bespoke compression molds, corporate hampers, and physical sample requests.",
  alternates: {
    canonical: "/contact"
  },
  openGraph: {
    type: "website",
    title: "Contact Us | Greenfibre B2B Corporate Desk & Factory Inquiries",
    description:
      "Connect with Greenfibre for wholesale inquiries, custom branding, corporate hampers, and physical sample requests. Direct manufacturer based in Greater Noida.",
    url: "/contact",
    images: ["/images/hero.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Greenfibre B2B Corporate Desk",
    description:
      "Reach the Greenfibre B2B sales desk for wholesale pricing, custom laser branding, and pan-India bulk delivery inquiries.",
    images: ["/images/hero.jpg"]
  }
};

export default function ContactPage() {
  const siteUrl = "https://trade.greenfibre.org";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Green Fibre",
    url: siteUrl,
    telephone: "+919217328777",
    email: "support.greenfibre@gmail.com",
    image: `${siteUrl}/images/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Udyog Kendra 2",
      addressLocality: "Greater Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201306",
      addressCountry: "IN"
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:30",
      closes: "18:30"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact Us",
        item: `${siteUrl}/contact`
      }
    ]
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={breadcrumbSchema} />

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
