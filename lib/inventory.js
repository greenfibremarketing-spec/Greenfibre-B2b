import { ObjectId } from "mongodb";

/**
 * Deducts item quantities from product inventory and color variants upon order creation.
 *
 * @param {Object} options
 * @param {Object} options.mainDatabase - MongoDB connection instance to the main store database
 * @param {Array} options.items - Array of ordered items with slug, colour, qty, etc.
 * @param {string} [options.orderId] - Order document _id
 * @param {string} [options.orderNumber] - Sequential order number
 * @param {string} [options.reference] - B2B quotation reference
 * @returns {Promise<Array<{ slug: string, deductedQty: number, success: boolean }>>}
 */
export async function deductInventoryForOrder({
  mainDatabase,
  items = [],
  orderId = null,
  orderNumber = null,
  reference = null
}) {
  if (!mainDatabase || typeof mainDatabase.collection !== "function") {
    console.warn("[Inventory] Database not available for inventory deduction.");
    return [];
  }

  const productsCol = mainDatabase.collection("products");
  const auditCol = mainDatabase.collection("stockauditlogs");
  const results = [];

  for (const it of items) {
    const qty = Math.max(1, Math.floor(Number(it.qty || it.quantity || 1)));
    const slug = it.slug;
    const colour = it.colour || it.colorName;

    try {
      // Build search query: match by _id, slug, or name
      const orConditions = [];

      if (it.productId) {
        if (typeof it.productId === "string" && it.productId.length === 24 && /^[0-9a-fA-F]{24}$/.test(it.productId)) {
          try {
            orConditions.push({ _id: new ObjectId(it.productId) });
          } catch {
            orConditions.push({ _id: it.productId });
          }
        } else {
          orConditions.push({ _id: it.productId });
        }
      }

      if (slug && slug !== "custom") {
        orConditions.push({ slug: slug });
      }

      if (it.name) {
        orConditions.push({ name: it.name });
      }

      if (orConditions.length === 0) {
        continue;
      }

      const product = await productsCol.findOne({ $or: orConditions });
      if (!product) {
        console.warn(`[Inventory] Could not find product to deduct stock: ${slug || it.name}`);
        results.push({ slug: slug || it.name, deductedQty: 0, success: false });
        continue;
      }

      const pId = product._id;
      const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
      let matchedColor = null;

      if (hasColors && colour && colour.toLowerCase() !== "standard") {
        matchedColor = product.colors.find(
          (c) => c && c.name && c.name.trim().toLowerCase() === colour.trim().toLowerCase()
        );
      }

      // 1. If variant/colour matched, decrement color variant stock and b2bStock
      if (matchedColor) {
        const colorInc = {
          "colors.$.stock": -qty,
          "colors.$.b2bStock": -qty
        };

        await productsCol.updateOne(
          {
            _id: pId,
            "colors.name": matchedColor.name
          },
          { $inc: colorInc }
        );
      }

      // 2. Decrement product-level stock fields
      const productInc = {
        stockQuantity: -qty,
        stock: -qty
      };

      if (typeof product.b2bStock === "number") {
        productInc.b2bStock = -qty;
      }
      if (typeof product.physicalStock === "number") {
        productInc.physicalStock = -qty;
      }

      await productsCol.updateOne(
        { _id: pId },
        {
          $inc: productInc,
          $set: { updatedAt: new Date() }
        }
      );

      // 3. Write record to stockauditlogs
      try {
        if (auditCol && typeof auditCol.insertOne === "function") {
          await auditCol.insertOne({
            productId: pId,
            sku: product.sku || it.sku || "",
            productName: product.name,
            action: "ORDER_DEDUCTION",
            mode: "b2b_order",
            delta: -qty,
            reason: `B2B Order ${orderNumber || reference || ""} deducted ${qty} units (${matchedColor ? matchedColor.name : "overall"})`,
            metadata: {
              orderId: orderId || null,
              orderNumber: orderNumber || reference,
              orderChannel: "b2b",
              variant: matchedColor ? matchedColor.name : null
            },
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      } catch (auditErr) {
        console.warn("[Inventory Audit Log] Notice:", auditErr.message);
      }

      console.log(
        `[Inventory] Deducted ${qty} units of "${product.name}" (${matchedColor ? matchedColor.name : "overall"}) for order ${orderNumber || reference}`
      );

      results.push({
        slug: product.slug,
        name: product.name,
        variant: matchedColor ? matchedColor.name : null,
        deductedQty: qty,
        success: true
      });
    } catch (err) {
      console.error(`[Inventory Error] Failed to deduct stock for ${slug}:`, err.message);
      results.push({ slug, deductedQty: 0, success: false, error: err.message });
    }
  }

  return results;
}

