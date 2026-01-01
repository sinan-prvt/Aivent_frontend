
import { useQuery } from "@tanstack/react-query";
import { getCategoryProducts } from "../api/catalog.api";

export const useCategoryProducts = (slug) => {
    return useQuery({
        queryKey: ["category-products", slug],
        queryFn: () => getCategoryProducts(slug),
        enabled: !!slug,
    });
};
