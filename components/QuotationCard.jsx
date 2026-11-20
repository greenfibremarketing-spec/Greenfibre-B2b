"use client";

import React from "react";
import styles from "./QuotationCard.module.css";

/**
 * Formats a numeric value into standard Indian currency notation (e.g. ₹16,375).
 */
const formatINR = (val) => {
  return "₹" + Math.round(Number(val) || 0).toLocaleString("en-IN");
};

/**
 * QuotationCard
 * Controlled Next.js quotation card component in plain JavaScript (JSX).
 *
 * FIX 1: All prices inclusive of 18% GST:
 * - afterDiscounts = sum(rate × qty) − bundleBonus
 * - total = afterDiscounts
 * - gst = Math.round(total × 0.18 / 1.18)   // GST contained in the price
 * - taxable = total − gst
 *
 * FIX 2: Desktop spacious layout (861px and up):
 * - Card padding: 32px to 36px
 * - Gap between products and pricing: 36px to 40px
 * - Sticky pricing column on right: 340px to 360px wide
 * - Product rows: 14px to 16px vertical padding, line-height 1.5
 * - Pricing rows: 8px to 10px vertical padding, 18px-20px green box padding
 * - Clean 2-line layout for 4+ products on desktop without horizontal scrolling
 */
export default function QuotationCard({
  items = [],
  pricing = {},
  dateLabel = "20 Nov 2026",
  supplierName = "Charvik Moulds and Products Private Limited",
  onQtyChange = () => {},
  onRemove = () => {},
  onClear = () => {},
  onAddMore = () => {},
  onDownloadPdf,
  hasGstin = false,
  isGstinValid = false,
}) {
  const itemCount = items.length;
  // Side-by-side layout condition (4 or more products)
  const isSideBySide = itemCount >= 4;

  // ── FIX 1: Inclusive GST Calculations ─────────────────────────────────
  const unitsCount =
    pricing.units ?? items.reduce((acc, it) => acc + (it.qty || 1), 0);

  // Catalog gross: sum of catalog MRP (or rate) × qty
  const catalogGross =
    pricing.catalogGross ??
    items.reduce(
      (acc, it) => acc + (it.mrp || it.rate || 0) * (it.qty || 1),
      0
    );

  // sum(rate × qty) - already inclusive of 18% GST
  const sumRateQty = items.reduce(
    (acc, it) => acc + (it.rate || 0) * (it.qty || 1),
    0
  );

  const volumeDiscount =
    pricing.volumeDiscount ?? Math.max(0, catalogGross - sumRateQty);

  const bundleBonus = pricing.bundleBonus ?? 0;
  const bundlePercent = pricing.bundlePercent ?? 5;

  // afterDiscounts = sum(rate × qty) − bundleBonus
  // total (final quotation) = afterDiscounts (GST is already included!)
  const total =
    pricing.total ?? Math.max(0, Math.round(sumRateQty - bundleBonus));

  // gst = Math.round(total × 0.18 / 1.18)   // the GST contained in the price
  const gst = pricing.gst ?? Math.round((total * 0.18) / 1.18);

  // taxable = total − gst
  const taxable = pricing.taxable ?? (total - gst);

  // "You save" = catalog gross − final quotation, with the percentage of the catalog gross
  const savings =
    pricing.savings ?? Math.max(0, catalogGross - total);

  const savingsPercent =
    pricing.savingsPercent ??
    (catalogGross > 0 ? ((savings / catalogGross) * 100).toFixed(1) : "0");

  const isGstinProvided = Boolean(hasGstin && isGstinValid);

  return (
    <article
      className={styles.card}
      aria-label="Your Products Quotation Summary"
    >
      {/* ── 1. Top Header Row: Step Number, Title, Add / Clear Buttons ──── */}
      <header className={styles.topHeader}>
        <div className={styles.topTitleGroup}>
          <span className={styles.stepCircle} aria-hidden="true">
            1
          </span>
          <h2 className={styles.title}>Your Products ({itemCount})</h2>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            onClick={onAddMore}
            className={styles.addMoreBtn}
            aria-label="Add more products to quotation"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>+ Add more products</span>
          </button>

          {itemCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className={styles.clearBtn}
              aria-label="Clear all items from quotation"
            >
              Clear
            </button>
          )}
        </div>
      </header>

      {/* ── 2. Invoice Branding Bar: Green Fibre + QUOTATION / Draft Meta ── */}
      <div className={styles.invoiceHeader}>
        <div className={styles.brandGroup}>
          <div className={styles.brandTile} aria-hidden="true">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div>
            <div className={styles.brandName}>Green Fibre</div>
            <p className={styles.brandSubline}>
              Direct factory wholesale rate · Pan-India logistics
            </p>
          </div>
        </div>

        <div className={styles.docMeta}>
          <div className={styles.docTitle}>QUOTATION</div>
          <div className={styles.docSubline}>
            <span>{dateLabel}</span>
            <span className={styles.metaDot} aria-hidden="true">
              ·
            </span>
            <span className={styles.draftBadge}>Draft</span>
          </div>
        </div>
      </div>

      {/* ── 3. Supplier Sub-line: All prices inclusive of 18% GST ───────── */}
      <div className={styles.supplierLine}>
        <span className={styles.supplierPrefix}>Supplier: </span>
        {supplierName} · All prices inclusive of 18% GST
      </div>

      {/* ── 4. Main Body: Empty State OR Auto-Layout Products & Pricing ─── */}
      {itemCount === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrapper} aria-hidden="true">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>Your quote basket is empty</h3>
          <p className={styles.emptyDesc}>
            Browse our wholesale catalog to add eco drinkware, tableware, and
            hampers.
          </p>
          <button
            type="button"
            onClick={onAddMore}
            className={styles.browseBtn}
            aria-label="Browse Product Catalog"
          >
            Browse Product Catalog
          </button>
        </div>
      ) : (
        <div
          className={`${styles.contentLayout} ${
            isSideBySide ? styles.sideBySide : ""
          }`}
        >
          {/* ── Products Section (No inner scroll, natural page scroll) ──── */}
          <div className={styles.tableSection}>
            {/* VIEW A: Normal 5-Column Table (1-3 products, or narrow card / mobile) */}
            <table className={styles.normalTable}>
              <thead>
                <tr>
                  <th scope="col" className={styles.colNum}>
                    #
                  </th>
                  <th scope="col" className={styles.colItem}>
                    ITEM
                  </th>
                  <th scope="col" className={styles.colQty}>
                    QTY
                  </th>
                  <th scope="col" className={styles.rateCol}>
                    RATE (incl. GST)
                  </th>
                  <th scope="col" className={styles.amountCol}>
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => {
                  const lineAmount = (item.rate || 0) * (item.qty || 1);
                  const isPrimary = item.primary !== false;
                  const discountText =
                    item.discountLabel ||
                    (item.mrp > item.rate
                      ? `${Math.round(
                          ((item.mrp - item.rate) / item.mrp) * 100
                        )}% off`
                      : null);

                  return (
                    <tr key={item.id || idx} className={styles.itemRow}>
                      <td className={styles.colNum}>{idx + 1}</td>
                      <td className={styles.colItem}>
                        {/* Line 1: Name [discount badge instead of Primary / Add-on tag] */}
                        <div className={styles.itemTitleRow}>
                          <span className={styles.itemName}>{item.name}</span>
                          {!isPrimary && (
                            <span className={styles.tagAddon}>Add-on</span>
                          )}
                          {discountText && (
                            <span className={styles.discountBadge}>
                              {discountText}
                            </span>
                          )}
                        </div>

                        {/* Line 2: Variant / Colour · Struck MRP */}
                        <div className={styles.itemSubline}>
                          {item.variant && (
                            <span className={styles.variantLabel}>
                              {item.variant}
                            </span>
                          )}
                          {item.mrp > item.rate && (
                            <>
                              {item.variant && (
                                <span aria-hidden="true" className={styles.metaDot}>
                                  ·
                                </span>
                              )}
                              <span className={styles.struckMrp}>
                                {formatINR(item.mrp)}
                              </span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* QTY Stepper & Remove */}
                      <td className={styles.colQty}>
                        <div className={styles.stepperContainer}>
                          <div className={styles.stepperGroup}>
                            <button
                              type="button"
                              onClick={() =>
                                onQtyChange(item.id, Math.max(1, (item.qty || 1) - 1))
                              }
                              disabled={(item.qty || 1) <= 1}
                              className={styles.qtyBtn}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>
                            <span
                              className={styles.qtyDisplay}
                              aria-live="polite"
                            >
                              {item.qty || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onQtyChange(item.id, (item.qty || 1) + 1)
                              }
                              className={styles.qtyBtn}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className={styles.removeBtn}
                            aria-label={`Remove ${item.name} from quotation`}
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>
                      </td>

                      {/* Rate Column (hidden when container width < 520px) */}
                      <td className={styles.rateCol}>{formatINR(item.rate)}</td>

                      {/* Amount Column */}
                      <td className={styles.amountCol}>
                        {formatINR(lineAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* VIEW B: 2-Line Row Layout (Active in side-by-side mode on >= 760px / desktop) */}
            <div className={styles.twoLineList} role="list">
              {items.map((item, idx) => {
                const lineAmount = (item.rate || 0) * (item.qty || 1);
                const isPrimary = item.primary !== false;
                const discountText =
                  item.discountLabel ||
                  (item.mrp > item.rate
                    ? `${Math.round(
                        ((item.mrp - item.rate) / item.mrp) * 100
                      )}% off`
                    : null);

                return (
                  <div
                    key={item.id || idx}
                    className={styles.twoLineItem}
                    role="listitem"
                  >
                    {/* Line 1: [Product name] [discount badge] ............ [AMOUNT] */}
                    <div className={styles.twoLineRow1}>
                      <div className={styles.twoLineTitleGroup}>
                        <span className={styles.twoLineItemName}>
                          {item.name}
                        </span>
                        {!isPrimary && (
                          <span className={styles.tagAddon}>Add-on</span>
                        )}
                        {discountText && (
                          <span className={styles.discountBadge}>
                            {discountText}
                          </span>
                        )}
                      </div>
                      <div className={styles.twoLineAmount}>
                        {formatINR(lineAmount)}
                      </div>
                    </div>

                    {/* Line 2: [variant · ~~mrp~~] ............ [− qty +] × ............ [₹rate each] */}
                    <div className={styles.twoLineRow2}>
                      <div className={styles.twoLineVariantGroup}>
                        {item.variant && (
                          <span className={styles.variantLabel}>
                            {item.variant}
                          </span>
                        )}
                        {item.mrp > item.rate && (
                          <>
                            {item.variant && (
                              <span aria-hidden="true" className={styles.metaDot}>
                                ·
                              </span>
                            )}
                            <span className={styles.struckMrp}>
                              {formatINR(item.mrp)}
                            </span>
                          </>
                        )}
                      </div>

                      <div className={styles.twoLineControlsGroup}>
                        <div className={styles.stepperContainer}>
                          <div className={styles.stepperGroup}>
                            <button
                              type="button"
                              onClick={() =>
                                onQtyChange(item.id, Math.max(1, (item.qty || 1) - 1))
                              }
                              disabled={(item.qty || 1) <= 1}
                              className={styles.qtyBtn}
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              −
                            </button>
                            <span
                              className={styles.qtyDisplay}
                              aria-live="polite"
                            >
                              {item.qty || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onQtyChange(item.id, (item.qty || 1) + 1)
                              }
                              className={styles.qtyBtn}
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemove(item.id)}
                            className={styles.removeBtn}
                            aria-label={`Remove ${item.name} from quotation`}
                            title="Remove item"
                          >
                            ×
                          </button>
                        </div>

                        <div className={styles.twoLineRate}>
                          {formatINR(item.rate)} each
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 5. Pricing Summary Section (Sticky right on 4+ items, or Below) ── */}
          <aside
            className={styles.pricingSection}
            aria-label="Quotation Pricing Summary"
          >
            <div className={styles.pricingStack}>
              {/* Row 1: Catalog Gross */}
              <div className={styles.pricingRow}>
                <span>Catalog gross ({unitsCount} units)</span>
                <span className={styles.pricingValue}>
                  {formatINR(catalogGross)}
                </span>
              </div>

              {/* Row 2: Volume Tier Discount */}
              {volumeDiscount > 0 && (
                <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                  <span>Volume tier discount</span>
                  <span className={styles.discountValue}>
                    −{formatINR(volumeDiscount)}
                  </span>
                </div>
              )}

              {/* Row 3: Bundle Pairing Bonus */}
              {bundleBonus > 0 && (
                <div className={`${styles.pricingRow} ${styles.discountRow}`}>
                  <span>Bundle pairing bonus ({bundlePercent}%)</span>
                  <span className={styles.discountValue}>
                    −{formatINR(bundleBonus)}
                  </span>
                </div>
              )}

              {/* Row 4: Taxable Value */}
              <div className={`${styles.pricingRow} ${styles.taxableRow}`}>
                <span>Taxable value</span>
                <span className={styles.pricingValue}>
                  {formatINR(taxable)}
                </span>
              </div>

              {/* Row 5: GST @ 18% (included in price) */}
              <div className={styles.pricingRow}>
                <span>GST @ 18% (included in price)</span>
                <span className={styles.pricingValue}>
                  {formatINR(gst)}
                </span>
              </div>

              {/* Row 6: Big Green Final Quotation Box */}
              <div className={styles.finalQuotationBar}>
                <div className={styles.finalLabelGroup}>
                  <span className={styles.finalLabel}>Final quotation</span>
                  <span className={styles.finalSubLabel}>Incl. GST</span>
                </div>
                <div className={styles.finalAmount}>
                  {formatINR(total)}
                </div>
              </div>

              {/* GST Note (Formal note based on GSTIN status) */}
              <div className={styles.itcBanner}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.itcIcon}
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span className={styles.itcText}>
                  {isGstinProvided
                    ? `Input tax credit of ${formatINR(gst)} is available against your GSTIN.`
                    : `GST of ${formatINR(gst)} is included in the price. Input tax credit requires a valid GSTIN.`}
                </span>
              </div>

              {/* Footer: You Save & Download PDF */}
              <div className={styles.footerArea}>
                <div className={styles.savingsText}>
                  {savings > 0 ? (
                    <>
                      You save {formatINR(savings)} ({savingsPercent}%)
                    </>
                  ) : (
                    "Direct factory wholesale rate"
                  )}
                </div>

                {onDownloadPdf && (
                  <button
                    type="button"
                    onClick={onDownloadPdf}
                    className={styles.downloadPdfBtn}
                    aria-label="Download quotation as PDF"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </article>
  );
}
