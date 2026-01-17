import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ count, pageSize = 10, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(count / pageSize);

    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-10 h-10 rounded-xl transition-all duration-300 flex items-center justify-center font-medium
            ${currentPage === i
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                            : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'}`}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pb-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-xl bg-white/5 text-neutral-400 flex items-center justify-center transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-xl bg-white/5 text-neutral-400 flex items-center justify-center transition-all hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-white/5"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default Pagination;
