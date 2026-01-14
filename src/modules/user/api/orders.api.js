import axios from 'axios';
import { getAccessToken } from '../../../core/utils/token';

const ORDER_API_URL = 'http://localhost:8006/api/orders';

const getHeaders = () => {
    const token = getAccessToken();
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${ORDER_API_URL}/my-orders/`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};

export const getVendorOrders = async () => {
    try {
        const response = await axios.get(`${ORDER_API_URL}/vendor-orders/`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching vendor orders:', error);
        throw error;
    }
};

export const getAdminOrders = async () => {
    try {
        const response = await axios.get(`${ORDER_API_URL}/admin/orders/`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status) => {
    try {
        const response = await axios.patch(`${ORDER_API_URL}/admin/orders/${orderId}/`,
            { status },
            { headers: getHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

export const deleteOrderItem = async (orderId, subOrderId) => {
    try {
        const response = await axios.delete(`${ORDER_API_URL}/${orderId}/items/${subOrderId}/`, {
            headers: getHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting order item:', error);
        throw error;
    }
};
