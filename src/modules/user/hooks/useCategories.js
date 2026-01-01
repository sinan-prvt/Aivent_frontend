
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../api/catalog.api";

export const useCategories = () => {
    return useQuery({
        queryKey: ["categories"],
        queryFn: getCategories,
    });
};
