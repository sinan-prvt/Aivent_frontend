import { useQuery } from "@tanstack/react-query";
import { fetchVendorMe } from "../api/vendor.api";
import { getVendorProducts } from "../api/catalog.api";

export const useDecorationData = () => {
    // 1. Fetch Vendor Profile (to get business name and subcategories/specializations)
    const profileQuery = useQuery({
        queryKey: ["vendor", "me"],
        queryFn: fetchVendorMe,
        select: (res) => res.data,
    });

    // 2. Fetch Vendor Products (to serve as Themes/Designs)
    const productsQuery = useQuery({
        queryKey: ["vendor-products"],
        queryFn: getVendorProducts,
    });

    const isLoading = profileQuery.isLoading || productsQuery.isLoading;
    const isError = profileQuery.isError || productsQuery.isError;

    // Data Processing
    const profile = profileQuery.data || {};
    const productsData = productsQuery.data || {};
    const products = productsData.results || (Array.isArray(productsData) ? productsData : []);

    // Calculate Stats
    const stats = {
        totalDesigns: products.length,
        activeProjects: products.filter(p => p.status === "approved").length,
        pendingDesigns: products.filter(p => p.status === "pending").length,
    };

    // Get Specializations (mapping subcategory_ids if they exist)
    const specializationMapping = {
        1: "Wedding Stage Decor",
        2: "Floral Decoration",
        3: "Theme Decoration",
        4: "Mandap Decoration",
        5: "Table & Seating Decor"
    };

    const activeSpecializations = (profile.subcategory_ids || [])
        .map(id => specializationMapping[id])
        .filter(Boolean);

    // Group Products by Specialization (using first matching specialization as a mock category find)
    const categorizedThemes = products.map(p => ({
        ...p,
        categoryName: specializationMapping[p.category] || "General Decoration"
    }));

    return {
        profile,
        products,
        stats,
        activeSpecializations,
        categorizedThemes,
        isLoading,
        isError,
        refresh: () => {
            profileQuery.refetch();
            productsQuery.refetch();
        }
    };
};
