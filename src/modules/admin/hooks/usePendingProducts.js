
import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/catalog.api";

export const useAdminProducts = (status) => {
    return useQuery({
        queryKey: ["admin-products", status],
        queryFn: () => getAdminProducts({ status }),
    });
};
