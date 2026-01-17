
import { useQuery } from "@tanstack/react-query";
import { getVendorProducts } from "../api/catalog.api";

export const useVendorProducts = (page = 1) => {
    return useQuery({
        queryKey: ["vendor-products", page],
        queryFn: () => getVendorProducts(page),
    });
};
