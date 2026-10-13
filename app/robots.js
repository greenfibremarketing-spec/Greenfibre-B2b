export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/login",
        "/signup",
        "/forgot-password",
        "/quote",
        "/admin"
      ]
    },
    sitemap: "https://trade.greenfibre.org/sitemap.xml"
  };
}

