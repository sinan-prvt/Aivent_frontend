
import { useQuery } from "@tanstack/react-query";
import { getVendorProducts } from "../api/catalog.api";

export const useVendorProducts = () => {
    return useQuery({
        queryKey: ["vendor-products"],
        queryFn: getVendorProducts,
    });
};
