
import adminCatalogApi from "../../../core/api/adminCatalogAxios";

export const getAdminProducts = async (params = {}) => {
    const response = await adminCatalogApi.get("/products/", { params });
    return response.data;
};

export const reviewProduct = async (id, action) => {
    // action: 'approve' or 'reject'
    const response = await adminCatalogApi.patch(`/products/${id}/review/`, { action });
    return response.data;
};

export const getProductDetail = async (id) => {
    const response = await adminCatalogApi.get(`/products/${id}/`);
    return response.data;
};
