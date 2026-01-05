import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchVendorMe, updateVendorProfile } from "../api/vendor.api";

export const useVendorProfile = () => {
    const qc = useQueryClient();

    const profileQuery = useQuery({
        queryKey: ["vendor", "me"],
        queryFn: fetchVendorMe,
        retry: false,
        staleTime: 0,
        refetchOnMount: "always",
        refetchOnWindowFocus: true,
        select: (res) => res.data,
    });

    const mutation = useMutation({
        mutationFn: updateVendorProfile,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["vendor", "me"] });
        },
    });

    return {
        profile: profileQuery.data || null,
        loading: profileQuery.isLoading,
        refresh: profileQuery.refetch,
        saveProfile: mutation.mutateAsync,
        saving: mutation.isPending,
        error: profileQuery.error,
    };
};
