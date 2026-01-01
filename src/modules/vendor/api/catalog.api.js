
import catalogApi from "../../../core/api/catalogAxios";

export const getVendorProducts = async () => {
    const response = await catalogApi.get("/vendor/products/");
    return response.data;
};

export const createProduct = async (productData) => {
    // Using FormData is usually safer for file uploads (images)
    const response = await catalogApi.post("/vendor/products/", productData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getVendorProductDetail = async (id) => {
    const response = await catalogApi.get(`/vendor/products/${id}/`);
    return response.data;
};

export const updateProduct = async (id, productData) => {
    const response = await catalogApi.patch(`/vendor/products/${id}/`, productData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await catalogApi.delete(`/vendor/products/${id}/`);
    return response.data;
};
