import { useQuery } from "@tanstack/react-query";
import { getPublicVendorDetail } from "../api/vendor.api";

export const useVendorPublic = (userId) => {
    return useQuery({
        queryKey: ["public-vendor", userId],
        queryFn: () => getPublicVendorDetail(userId),
        enabled: !!userId,
    });
};
