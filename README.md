# Green Fibre B2B (Next.js 14, App Router)
Run: `cp .env.example .env.local`, fill MONGODB_URI (+ SMTP_*), `npm i && npm run dev`.

## Website SEO editor

Sign in with `greenfibre.marketing@gmail.com` and open **Status** in the desktop navigation or mobile menu (`/status`). The account must already exist, or be registered using the email OTP flow. Customer accounts cannot read or change SEO settings.

The editor supports the homepage, all public content pages, categories, and products: SEO title, description, keywords, canonical URL, social image upload or URL, Open Graph and Twitter titles/descriptions, noindex, nofollow, and an editorial focus keyword. Saved settings are rendered in the HTML head on the server using Next.js `generateMetadata`. Blank text fields retain the page's default metadata. Titles entered in the editor are used exactly as entered. Filtered catalog results stay noindex. Pages marked noindex or canonicalized to another URL are excluded from the sitemap. The editor itself is noindex and excluded from robots/sitemap.

Configuration:

- `SEO_ADMIN_EMAILS=greenfibre.marketing@gmail.com` (default; comma-separated emails can be configured on the server).
- `JWT_SECRET` must be a private random value of at least 32 characters. The old public fallback secret and example placeholder cannot access the SEO editor. Changing the secret requires signing in again.
- Production requires a working `MONGODB_URI` and uses `MONGODB_DB` (default `greenfibre_b2b`). Settings are stored in `seo_settings`, images in `seo_images`. A failed database connection returns a save error; public pages retain their default SEO during an outage.
- Development stores SEO in `.data/seo` and uses the existing development user database. Development SEO is separate from production MongoDB data. `SEO_DATA_DIR` and `B2B_DATA_DIR` can isolate test fixtures. Local data is ignored by Git.

Upload PNG, JPEG or WebP images (up to 5 MB; 1200 × 630 recommended), then click **Save SEO**. Uploaded images are served publicly for social crawlers. Search/social previews are illustrative; the focus keyword is not emitted as a ranking tag.

Deploy the application changes and configure the production environment before using the editor at `https://trade.greenfibre.org/status`. Existing page-specific SEO and structured data remain the defaults until settings are saved.

Validation: `npm run build`; `node --test tests/seo-config.test.mjs`; `node tests/seo-integration.mjs` (starts an isolated local development server and mock catalog; does not change production or the existing local database).

## Built
Home, catalogue (search/category filters in URL), product pages (SSR, metadata, JSON-LD), persistent quote basket, enquiry API (server validation, MOQ check, honeypot, rate limit, saved to MongoDB before success, optional email), sitemap, robots.

## To connect
- Backend catalogue: replace lib/products.js getProducts/getProduct. Needed fields: slug, sku, name, unit (piece/set), category, size, colours, moq, B2B price + tiers, images, branding options, lead time, B2B stock.
- Real product photos + official logo; verified contact details (footer).
## Not built yet
Buyer login/registration (NextAuth + Mongo), admin/quotations, Razorpay (needs keys + order-confirmation flow), Shiprocket (API creds), gift builder, logo uploads, price tiers, inventory reservation.
