import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchTechnicians, createTechnician, updateTechnician, deleteTechnician } from "../api/vendor.api";

export const useTechnicians = () => {
    const queryClient = useQueryClient();

    const techniciansQuery = useQuery({
        queryKey: ["technicians"],
        queryFn: async () => {
            const res = await fetchTechnicians();
            return res.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: createTechnician,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, payload }) => updateTechnician(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTechnician,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
        },
    });

    return {
        technicians: techniciansQuery.data || [],
        isLoading: techniciansQuery.isLoading,
        isError: techniciansQuery.isError,
        createTechnician: createMutation.mutateAsync,
        updateTechnician: updateMutation.mutateAsync,
        deleteTechnician: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
