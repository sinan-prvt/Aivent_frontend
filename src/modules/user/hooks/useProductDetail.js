
import { useQuery } from "@tanstack/react-query";
import { getProductDetail } from "../api/catalog.api";

export const useProductDetail = (id) => {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => getProductDetail(id),
        enabled: !!id,
    });
};
