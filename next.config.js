/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // PDFKit loads standard fonts using Node package imports. Keep the package
    // intact and explicitly include those dynamically loaded files on Vercel.
    serverComponentsExternalPackages: ["pdfkit"],
    outputFileTracingIncludes: {
      "/api/enquiry": ["./node_modules/pdfkit/**/*"],
      "/api/quote/pdf": ["./node_modules/pdfkit/**/*"]
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "api.greenfibre.org"
      }
    ]
  }
};

module.exports = nextConfig;
