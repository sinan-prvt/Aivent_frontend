import React from "react";
import { useParams, Navigate } from "react-router-dom";
import CateringPackages from "./catering/CateringPackages";
import PhotographyPackages from "./photography/PhotographyPackages";

export default function VendorPackagesDispatcher() {
    const { category } = useParams();

    // Normalize category to lowercase just in case
    const cat = category?.toLowerCase();

    switch (cat) {
        case "catering":
            return <CateringPackages />;
        case "photography":
        case "videography": // Assuming they might share or use the same
            return <PhotographyPackages />;
        default:
            // Fallback or 404 for unsupported categories on this route
            return <div className="p-8 text-center text-gray-500">Packages not available for this category.</div>;
    }
}
