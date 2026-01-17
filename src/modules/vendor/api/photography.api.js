import axios from "@/core/api/catalogAxios";

const BASE_URL = "/vendor";

// Packages (Products)
export const fetchPackages = (page = 1) => axios.get(`${BASE_URL}/products/?page=${page}`);
export const createPackage = (data) => axios.post(`${BASE_URL}/products/`, data);
export const updatePackage = (id, data) => axios.put(`${BASE_URL}/products/${id}/`, data);
export const deletePackage = (id) => axios.delete(`${BASE_URL}/products/${id}/`);
export const uploadPackageImage = (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return axios.post(`${BASE_URL}/upload-image/`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

// Deliveries
export const fetchDeliveries = (page = 1) => axios.get(`${BASE_URL}/deliveries/?page=${page}`);
export const createDelivery = (data) => axios.post(`${BASE_URL}/deliveries/`, data);
export const updateDelivery = (id, data) => axios.patch(`${BASE_URL}/deliveries/${id}/`, data);
export const deleteDelivery = (id) => axios.delete(`${BASE_URL}/deliveries/${id}/`);
