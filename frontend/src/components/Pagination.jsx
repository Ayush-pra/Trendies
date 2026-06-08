import React, { useMemo } from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Generate the page numbers array
  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }, [totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          bg-[#ffffff0a] border border-gray-800 text-gray-300
          hover:border-amber-500 hover:text-amber-500
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-800 disabled:hover:text-gray-300
        "
      >
        Previous
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page) => {
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                w-10 h-10 rounded-lg text-sm font-semibold transition-all duration-200
                flex items-center justify-center border
                ${isActive
                  ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-[#ffffff0a] border-gray-800 text-gray-300 hover:border-amber-500 hover:text-amber-500'
                }
              `}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          bg-[#ffffff0a] border border-gray-800 text-gray-300
          hover:border-amber-500 hover:text-amber-500
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-800 disabled:hover:text-gray-300
        "
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
