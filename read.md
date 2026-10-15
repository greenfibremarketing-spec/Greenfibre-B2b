# Green Fibre: SEO Editor User Guide

Website: https://trade.greenfibre.org/

SEO editor: https://trade.greenfibre.org/status

Administrator sign-in: https://trade.greenfibre.org/status/login

## 1. Is it live and working?

Yes, the SEO editor is deployed on the live website. Your screenshot shows the authenticated editor with the Kitchen & Dining category loaded.

Public checks on **14 October 2026 (India time)** confirmed:

| Check | Result |
| --- | --- |
| Open `/status` without a session | Redirects to `/status/login` |
| Open the old `/signup?redirect=%2Fstatus` link | Redirects to SEO sign-in |
| Open `/status/login` | Loads SEO Administrator Sign In successfully |
| Open `/category/kitchen-dining` | Loads successfully with SEO tags already in the server HTML |
| Open `/sitemap.xml` | Loads successfully and includes the Kitchen & Dining category |

The live category currently outputs this title:

> Wholesale Kitchenware & Sustainable Dining Sets | Green Fibre B2B

Its canonical URL is:

```text
https://trade.greenfibre.org/category/kitchen-dining
```

The editor's save, persistence, permissions, image upload and metadata behavior previously passed automated checks in an isolated local environment. This documentation check did not submit changes through your signed-in production session. Use the verification steps below to confirm your next live save.

## 2. How to sign in

1. Open https://trade.greenfibre.org/status/login.
2. Enter `greenfibre.marketing@gmail.com` and the existing **Green Fibre website account password**.
3. Click **Sign in to SEO**.
4. The website opens the SEO editor at `/status`.

This is your website account password, not your Gmail password. No default administrator password was created. The approved website account must already exist. If you forget its password, use the website's [Forgot password page](https://trade.greenfibre.org/forgot-password).

Only approved administrator emails can access the editor. A customer account cannot manage SEO. An expired session returns to SEO sign-in.

## 3. Edit and publish a page's SEO

1. Use **Page to edit** to select the homepage, a content page, a category, or a product.
2. Check that the selected URL is the page you want to update.
3. Edit the fields explained below. The search and social previews update while you type.
4. If you upload an image, wait for the upload-success message.
5. Click **Save SEO**.
6. Wait for the success message and updated **Last saved** time.
7. Click **View page** and follow the verification steps in section 7.

Changes apply to the selected page. Editing Kitchen & Dining does not change the homepage or every product. Repeat the process for each page you want to optimize.

The editor and public pages use the same metadata resolver. The source label identifies current website defaults versus a saved administrator override. Defaults are real website metadata, but they are not a separate saved database record until you save. Product entries use the same catalog as the website; category/content descriptions are the website's editorial SEO copy. SEO titles may intentionally differ from visible page headings. Use **Refresh records** after product data changes to reload the current metadata.

Blank-field previews use the same fallback rules as the server, including Twitter inheritance from Open Graph. Relative image paths resolve to the live website URL. This synchronizes metadata; it does not independently verify physical product certifications or manufacturing claims.

You do **not** need a code deployment for each successful SEO save. A new request to the public page uses the saved settings. The **Save SEO** button is disabled until there are changes or while a save/upload is running.

## 4. What each field does

| Field | Purpose and how to use it |
| --- | --- |
| **SEO Title** | Sets the page's HTML title. Write a specific title for that page. The editor uses your text exactly, so include the brand once if desired. |
| **Meta Description** | Sets the description meta tag. Summarize what the page offers using accurate, page-specific wording. |
| **Keywords** | Stores keyword phrases and emits a keywords meta tag. Enter one per line; identical duplicates are removed on save. |
| **Canonical URL** | Identifies the preferred URL for the page. Normally use that page's full live URL, not the homepage URL for every page. |
| **Social Share Image URL** | Sets the image for Open Graph and Twitter cards. Use an uploaded image, a full HTTP/HTTPS image URL, or an existing site path such as `/images/bento-box.jpg`. |
| **Open Graph Title** | Sets the social-sharing title for services that read Open Graph tags. |
| **Open Graph Description** | Sets the corresponding social-sharing description. |
| **Twitter Title** | Sets the title for services that read Twitter card tags. |
| **Twitter Description** | Sets the corresponding Twitter card description. |
| **Hide from Google (noindex)** | Requests that supporting search engines do not index this page. Leave unchecked for public pages you want discoverable in search. |
| **Disable Link Following (nofollow)** | Adds a page-level instruction not to follow its links. Leave unchecked for normal public pages. |
| **Focus Keyword** | Saves an editorial target phrase. The status card checks whether the phrase appears in the title and description. It is not emitted as a special ranking tag. |

Search and social titles/descriptions are separate fields. If you want the same wording in each, update each populated field. A blank social title or description can fall back to the main SEO title or description; otherwise the page's defaults remain available. Blank text fields do not erase the page's existing default SEO.

Google does not use the keywords meta tag for indexing or ranking. Use meaningful phrases in the actual page content as well. See [Google's supported meta tags documentation](https://developers.google.com/search/docs/crawling-indexing/special-tags).

The editor currently accepts up to 200 characters for titles/focus keyword, 1,000 for descriptions, 5,000 for the keywords field, and 2,048 for URL fields. These are application limits, not promises about how much text a search result will display.

## 5. Example: Kitchen & Dining

Use this as a starting point and adjust it to the actual products on the page:

| Field | Example |
| --- | --- |
| Page | `/category/kitchen-dining` |
| SEO Title | Wholesale Kitchenware & Sustainable Dining Sets \| Green Fibre B2B |
| Meta Description | Explore rice-husk kitchenware, serving bowls and sustainable dining sets for hospitality and cafeteria bulk orders from Green Fibre. |
| Canonical URL | `https://trade.greenfibre.org/category/kitchen-dining` |
| Social Share Image URL | `/images/bento-box.jpg` |
| Focus Keyword | `wholesale kitchenware` |
| noindex / nofollow | Both unchecked |

Example keywords, one per line:

```text
wholesale kitchenware
sustainable dining sets
rice husk kitchenware
bulk tableware India
Green Fibre B2B
```

Enter appropriate Open Graph and Twitter descriptions too, then click **Save SEO**. Examples in this guide have not been automatically applied to the live site.

## 6. Upload a social image

1. Click **Choose File** under **Upload a social share image**.
2. Select a PNG, JPEG or WebP image, up to 5 MB.
3. A recommended image size is **1200 x 630 pixels**.
4. Wait for the preview and upload-success message. The image URL field updates automatically.
5. Click **Save SEO** to associate that image with the selected page.

Uploading alone does not publish the image as that page's social image. Uploaded images are publicly accessible so social crawlers can retrieve them. Existing image URLs are previewed directly; the editor does not upload a separate copy of an external image.

## 7. Verify a live save

### Confirm it was saved

After clicking **Save SEO**, check the success message and **Last saved** time. Reload the editor and select the same page: the saved values should still be present.

### Confirm the public page uses it

Open the selected public page, then use your browser's **View Page Source** (usually `Ctrl+U` on Windows). Search for:

```html
<title>
name="description"
rel="canonical"
property="og:title"
property="og:description"
property="og:image"
name="twitter:title"
name="twitter:description"
name="robots"
```

Compare those values with the settings you saved. Checking page source confirms that the tags arrive in the server HTML, rather than relying only on the editor preview. The canonical URL may contain normal HTML escaping, such as `&amp;` for `&`.

### Check search discovery

The [live sitemap](https://trade.greenfibre.org/sitemap.xml) excludes pages saved with noindex and pages canonicalized to a different URL. Filtered catalog URLs remain noindex even if the base catalog is indexable. The administrator pages are excluded from the sitemap and have noindex/nofollow metadata.

Google search results do not update immediately after a save. Google says recrawling can take days to weeks; an authorized Search Console user can request indexing through URL Inspection. See [Google's recrawl instructions](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Search engines may select a different title or description, and social services may retain older previews in their caches.

## 8. How server-side SEO works

```text
Administrator edits a selected page
    -> Save SEO validates administrator access and field values
    -> Production MongoDB stores settings keyed by the page path
    -> The server invalidates the page and sitemap cache
    -> A visitor or crawler requests the public page
    -> Next.js generateMetadata reads the saved settings
    -> The response includes the SEO tags in its HTML head
```

The editor updates metadata and indexing instructions. It does not rewrite visible headings, product descriptions, page layout, or existing structured-data content.

Production uses MongoDB collections `seo_settings` and `seo_images`. Development uses `.data/seo`, which is separate from production. Each settings save records its update time and administrator email. The editor has no built-in version history or one-click undo; keep a copy of old wording if you may want to restore it.

## 9. Troubleshooting

| Problem | What to do |
| --- | --- |
| Sign-in fails | Check the approved website account email and its website password. Use Forgot password if needed. |
| SEO administrator configuration error | The developer should check `SEO_ADMIN_EMAILS` and a private `JWT_SECRET` of at least 32 characters in Vercel. |
| Settings unavailable or save fails | Check the production MongoDB connection and access permissions. Do not assume changes were published after an error. |
| Upload fails | Check the file format and size, then try again. |
| Old values appear on the public page | Confirm the correct page was selected, Save SEO succeeded, and a fresh page-source request contains the new tags. |
| The preview changed but the website did not | Preview edits are unsaved until **Save SEO** succeeds. |
| Google or social previews still show old text | Verify the live source first, then allow recrawling or refresh the relevant service's cached preview. |

Production deployment follows the repository's `main` branch on Vercel. The editor and administrator sign-in fix are already deployed; routine SEO saves do not require another deployment.

## Quotation PDF emails

The order enquiry generates a quotation PDF before sending the customer and internal team emails. Both messages include `GreenFibre_Quotation.pdf` as an attachment. If PDF generation fails, submission reports an error and retains the quote basket instead of sending an email without its attachment. If email sending fails after the enquiry is received, the confirmation shows a delivery warning and retains the quotation reference.

PDFKit is configured as a server external package, with its runtime files and standard fonts explicitly included in the deployment. PDF amounts use `INR` so currency remains readable with the standard font.

Developer verification:

```text
node --test tests/quotation-email.test.mjs
npm run build
node tests/quotation-production.mjs
```

The production test starts a local build and a loopback SMTP capture server. It checks both email attachments and the failure response without sending messages to real inboxes. Its sample PDF and logs are stored under Git-ignored `tmp/pdfs/`.
