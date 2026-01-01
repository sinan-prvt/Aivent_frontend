
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewProduct } from "../api/catalog.api";

export const useReviewProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, action }) => reviewProduct(id, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-pending-products"] });
            // Also invalidate public products as they might appear now
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
};
