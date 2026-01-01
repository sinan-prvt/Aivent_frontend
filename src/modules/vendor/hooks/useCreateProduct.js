
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/catalog.api";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
        },
    });
};
