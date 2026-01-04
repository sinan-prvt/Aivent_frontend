
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "../api/catalog.api";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => updateProduct(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
        },
    });
};
