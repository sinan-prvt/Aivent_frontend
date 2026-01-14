import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getAdminOrders, updateOrderStatus } from '../../user/api/orders.api';

const AdminPaymentsPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getAdminOrders();
            setOrders(data);
        } catch (err) {
            console.error("Failed to load admin orders", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async (orderId) => {
        setUpdating(orderId);
        try {
            await updateOrderStatus(orderId, "PAID");
            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: "PAID" } : o));
        } catch (err) {
            alert("Failed to release payment");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Payment Management</h1>
                    <p className="text-neutral-400">Review and release payments to vendors</p>
                </div>
                <button onClick={loadOrders} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <RefreshCw className="w-5 h-5 text-neutral-400" />
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : (
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-neutral-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/[0.02] text-neutral-300">
                                    <td className="p-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                                    <td className="p-4">User #{order.user_id}</td>
                                    <td className="p-4 font-medium text-white">₹{order.total_amount}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${order.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-neutral-500">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-right">
                                        {order.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleRelease(order.id)}
                                                disabled={updating === order.id}
                                                className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {updating === order.id ? "Releasing..." : "Release to Vendor"}
                                            </button>
                                        )}
                                        {order.status === 'PAID' && (
                                            <span className="flex items-center justify-end gap-1 text-green-500 text-xs">
                                                <CheckCircle className="w-4 h-4" /> Released
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsPage;
