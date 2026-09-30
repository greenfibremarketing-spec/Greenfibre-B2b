# Green Fibre B2B (Next.js 14, App Router)
Run: `cp .env.example .env.local`, fill MONGODB_URI (+ SMTP_*), `npm i && npm run dev`.

## Built
Home, catalogue (search/category filters in URL), product pages (SSR, metadata, JSON-LD), persistent quote basket, enquiry API (server validation, MOQ check, honeypot, rate limit, saved to MongoDB before success, optional email), sitemap, robots.

## To connect
- Backend catalogue: replace lib/products.js getProducts/getProduct. Needed fields: slug, sku, name, unit (piece/set), category, size, colours, moq, B2B price + tiers, images, branding options, lead time, B2B stock.
- Real product photos + official logo; verified contact details (footer).
## Not built yet
Buyer login/registration (NextAuth + Mongo), admin/quotations, Razorpay (needs keys + order-confirmation flow), Shiprocket (API creds), gift builder, logo uploads, price tiers, inventory reservation.
