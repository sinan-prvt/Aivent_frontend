
import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

const ReviewActions = ({ onApprove, onReject, isProcessing }) => {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50 font-medium"
            >
                <FiCheck /> Approve
            </button>
            <button
                onClick={onReject}
                disabled={isProcessing}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
            >
                <FiX /> Reject
            </button>
        </div>
    );
};

export default ReviewActions;
