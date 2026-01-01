
import catalogApi from "../../../core/api/catalogAxios";

export const getCategories = async () => {
    const response = await catalogApi.get("/catalog/categories/");
    return response.data;
};

export const getCategoryProducts = async (slug) => {
    const response = await catalogApi.get(`/catalog/categories/${slug}/products/`);
    return response.data;
};

export const getProducts = async (params = {}) => {
    const response = await catalogApi.get("/catalog/products/", { params });
    return response.data;
};

export const getProductDetail = async (id) => {
    const response = await catalogApi.get(`/catalog/products/${id}/`);
    return response.data;
};
