
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "../api/catalog.api";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vendor-products"] });
            alert("Product deleted successfully");
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            const message = error.response?.data?.error || error.message || "Failed to delete product";
            alert(`Error: ${message}`);
        },
    });
};
