
import { useQuery } from "@tanstack/react-query";
import { getCategoryProducts } from "../api/catalog.api";

export const useCategoryProducts = (slug, page = 1) => {
    return useQuery({
        queryKey: ["category-products", slug, page],
        queryFn: () => getCategoryProducts(slug, page),
        enabled: !!slug,
    });
};
