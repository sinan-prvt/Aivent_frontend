
import React from "react";
import { Link } from "react-router-dom";

const CategoryList = ({ categories, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-24 w-40 bg-gray-100 rounded-lg flex-shrink-0 animate-pulse"
                    ></div>
                ))}
            </div>
        );
    }

    if (!categories || categories.length === 0) {
        return null; // Or show empty state
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/categories/${category.slug}`}
                    className="flex flex-col items-center justify-center p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
                >
                    <span className="font-medium text-gray-700 group-hover:text-primary">
                        {category.name}
                    </span>
                </Link>
            ))}
        </div>
    );
};

export default CategoryList;
