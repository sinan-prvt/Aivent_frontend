
import React from "react";

const statusConfig = {
    pending: { label: "Pending Review", color: "bg-yellow-100 text-yellow-800" },
    approved: { label: "Approved", color: "bg-green-100 text-green-800" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-800" },
};

const ProductStatusBadge = ({ status }) => {
    const config = statusConfig[status] || { label: status, color: "bg-gray-100 text-gray-800" };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
        >
            {config.label}
        </span>
    );
};

export default ProductStatusBadge;
