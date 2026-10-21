export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/seo/image/"],
      disallow: [
        "/api/",
        "/login",
        "/signup",
        "/forgot-password",
        "/quote",
        "/admin",
        "/status"
      ]
    },
    sitemap: "https://trade.greenfibre.org/sitemap.xml",
    host: "https://trade.greenfibre.org"
  };
}

