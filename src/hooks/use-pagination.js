import { useState, useMemo } from 'react';

export const usePagination = (data = [], pageSize = 8) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalCount = data.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = data.slice(startIndex, endIndex);

    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 3;
      const halfVisible = Math.floor(maxVisiblePages / 2);

      let startPage = Math.max(currentPage - halfVisible, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }

      if (totalPages > maxVisiblePages) {
        if (startPage > 1) {
          pageNumbers.push(1);
          if (startPage > 2) {
            pageNumbers.push("ellipsis");
          }
        }

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        if (endPage < totalPages) {
          if (endPage < totalPages - 1) {
            pageNumbers.push("ellipsis");
          }
          pageNumbers.push(totalPages);
        }
      } else {
        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }
      }

      return pageNumbers;
    };

    return {
      currentPage,
      totalPages,
      totalCount,
      paginatedData,
      pageNumbers: getPageNumbers(),
      startEntry: startIndex + 1,
      endEntry: Math.min(startIndex + pageSize, totalCount),
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [data, pageSize, currentPage]);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, paginationData.totalPages)));
  };

  const goToNextPage = () => {
    if (paginationData.hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (paginationData.hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    ...paginationData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPage: setCurrentPage,
  };
};