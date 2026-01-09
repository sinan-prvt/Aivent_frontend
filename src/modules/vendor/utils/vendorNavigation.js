// Category mapping for vendor redirection
export const categorySlugs = {
    "1": "catering",
    "2": "decoration",
    "3": "lighting",
    "4": "photography",
    "5": "sound",
    "6": "venue",
    "7": "staffing",
    "8": "ritual",
    "9": "logistics",
};

/**
 * Resolves the correct dashboard path for a vendor based on their category.
 * @param {Object} user - The user object from auth context/local storage
 * @returns {string} - The absolute path to redirect to
 */
export function getVendorPath(user) {
    console.log("🔍 getVendorPath called with:", user);
    if (!user || user.role !== "vendor") return "/";

    // Handle both string and number inputs for category_id
    const catId = user.category_id ? String(user.category_id) : null;
    console.log("🔍 Resolved catId:", catId);

    const slug = categorySlugs[catId];
    console.log("🔍 Mapped slug:", slug);

    // If we have a valid slug, go to that specific dashboard
    if (slug) {
        return `/vendor/${slug}/dashboard`;
    }

    // Fallback if category is missing - go to profile to setup
    return "/profile";
}
