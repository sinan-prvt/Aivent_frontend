
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../api/catalog.api";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
        },
    });
};
