
import catalogApi from "../../../core/api/catalogAxios";

export const getCategories = async () => {
    const response = await catalogApi.get("/categories/");
    return response.data;
};

export const getCategoryProducts = async (slug, page = 1) => {
    const response = await catalogApi.get(`/categories/${slug}/products/?page=${page}`);
    return response.data;
};

export const getProducts = async (params = {}) => {
    const response = await catalogApi.get("/products/", { params });
    return response.data;
};

export const getProductDetail = async (id) => {
    const response = await catalogApi.get(`/products/${id}/`);
    return response.data;
};
