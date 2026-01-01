
import catalogApi from "../../../core/api/catalogAxios";

export const getAdminProducts = async (params = {}) => {
    const response = await catalogApi.get("/admin/catalog/products/", { params });
    return response.data;
};

export const reviewProduct = async (id, action) => {
    // action: 'approve' or 'reject'
    const response = await catalogApi.patch(`/admin/catalog/products/${id}/review/`, { action });
    return response.data;
};
