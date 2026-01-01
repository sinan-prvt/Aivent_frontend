
import { useQuery } from "@tanstack/react-query";
import { getVendorProductDetail } from "../api/catalog.api";

export const useVendorProductDetail = (id) => {
    return useQuery({
        queryKey: ["vendor-product-detail", id],
        queryFn: () => getVendorProductDetail(id),
        enabled: !!id,
    });
};
