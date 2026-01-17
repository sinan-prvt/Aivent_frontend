
import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/catalog.api";

export const useAdminProducts = (status, page = 1) => {
    return useQuery({
        queryKey: ["admin-products", status, page],
        queryFn: () => getAdminProducts({ status, page }),
    });
};
