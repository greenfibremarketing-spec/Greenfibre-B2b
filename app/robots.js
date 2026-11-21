export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/products",
          "/products/",
          "/category/",
          "/story",
          "/contact",
          "/terms",
          "/privacy",
          "/corporate-gifting",
          "/custom-branded-water-bottles",
          "/diwali-corporate-gifts",
          "/wholesale-kitchenware",
          "/eco-lunch-boxes",
          "/bulk-tableware",
          "/wholesale-drinkware",
          "/api/seo/image/"
        ],
        disallow: [
          "/api/",
          "/login",
          "/signup",
          "/forgot-password",
          "/quote",
          "/admin",
          "/status"
        ]
      }
    ],
    sitemap: "https://trade.greenfibre.org/sitemap.xml",
    host: "https://trade.greenfibre.org"
  };
}
