
import { useQuery } from "@tanstack/react-query";
import { getAdminProducts } from "../api/catalog.api";

export const usePendingProducts = () => {
    return useQuery({
        queryKey: ["admin-pending-products"],
        queryFn: () => getAdminProducts({ status: "pending" }),
    });
};
