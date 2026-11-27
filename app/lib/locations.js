/**
 * The Peckers estate, as the homepage locations band understands it.
 *
 * Each entry is one card. `path` is what makes a card clickable: a store with
 * no page yet has `path: null`, renders with its badge and is inert, so we can
 * announce a town long before its own page exists.
 *
 * Sanity supplies the photograph (and can override status, badge and order)
 * through the "Homepage Location Cards" documents, matched on `slug`.
 */

export const STORES = [
    {
        slug: "hitchin",
        name: "Hitchin",
        path: "/hitchin",
        status: "open",
        cardAlt:
            "Peckers Hitchin - Best Peri Peri Grilled Chicken and Takeaway in Hitchin",
    },
    {
        slug: "stevenage",
        name: "Stevenage",
        path: "/stevenage",
        status: "open",
        cardAlt:
            "Peckers Stevenage - Best Chicken Restaurant and Delivery in Stevenage",
    },
    {
        slug: "welwyn-garden-city",
        name: "Welwyn Garden City",
        // No page yet. The store build is on the `welwyn-garden-city` branch;
        // set this to "/welwyn-garden-city" when that lands and flip the
        // status in Sanity.
        path: null,
        status: "comingSoon",
        cardAlt:
            "Peckers is coming soon to Welwyn Garden City, Hertfordshire",
    },
    {
        slug: "hertford",
        name: "Hertford",
        path: null,
        status: "comingSoon",
        cardAlt: "Peckers is coming soon to Hertford, Hertfordshire",
    },
];

/** Towns we actually trade in — the ones safe to put in copy and metadata. */
export const OPEN_STORES = STORES.filter((s) => s.status === "open");

/** "welwyn garden city" / "Welwyn Garden City" -> "welwyn-garden-city" */
export function slugify(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");
}

/**
 * Merge the registry with the Sanity documents.
 *
 * The registry decides which cards exist; Sanity decides what they look like.
 * A store with no document yet still renders — it just shows a dark tile with
 * its name until someone uploads the photograph.
 */
export function mergeStores(docs = []) {
    return STORES.map((store, index) => {
        const doc = docs.find((d) => slugify(d?.name) === store.slug) || null;
        return {
            ...store,
            image: doc?.image || null,
            status: doc?.status || store.status,
            badgeText: doc?.badgeText || "Coming Soon",
            order: typeof doc?.order === "number" ? doc.order : index,
        };
    }).sort((a, b) => a.order - b.order);
}
