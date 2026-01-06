import React from "react";
import { FiBarChart2 } from "react-icons/fi";

export default function LightingReports() {
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h1 className="text-2xl font-black text-gray-900">Reports</h1>
                <p className="text-gray-500 text-sm mt-1">View analytics and reports for your lighting & sound business.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
                <FiBarChart2 className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900">Coming Soon</h3>
                <p className="text-gray-400 mt-2 text-sm max-w-xs mx-auto">
                    Detailed analytics and reports will be available in a future update.
                </p>
            </div>
        </div>
    );
}
