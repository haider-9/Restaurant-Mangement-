import { useState, useMemo } from "react";
import Dropdown from "./Dropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils"; 
const ITEMS_PER_PAGE = 8;

const getBadgeColor = (value) => {
  if (!value) return "bg-gray-100 text-gray-800";
  
  const lowerValue = value.toLowerCase();
  
  if (['active', 'success', 'approved', 'completed', 'reserved', 'vip', 'lunch'].includes(lowerValue)) {
    return "bg-green-100 text-green-800";
  } else if (['inactive', 'pending', 'waiting', 'returning', 'breakfast'].includes(lowerValue)) {
    return "bg-yellow-100 text-yellow-800";
  } else if (['suspended', 'failed', 'error', 'rejected', 'cancelled'].includes(lowerValue)) {
    return "bg-red-100 text-red-800";
  } else if (['processing', 'progress', 'walk-in', 'new'].includes(lowerValue)) {
    return "bg-blue-100 text-blue-800";
  } else if (['well-spender', 'dinner' ].includes(lowerValue)) {
    return "bg-orange-100 text-orange-800";
  } else {
    return "bg-gray-100 text-gray-800";
  }
};

const GenericTable = ({ columns = [], data = [], actions = [], handleDropdownChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return data.slice(start, start + ITEMS_PER_PAGE);
    }, [currentPage, data]);

    const getPageButtons = () => {
        const pages = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(currentPage - 2, 1);
            let end = Math.min(start + 4, totalPages);

            if (end - start < 4) start = Math.max(end - 4, 1);

            for (let i = start; i <= end; i++) pages.push(i);
        }

        return pages;
    };

    function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return ''; 
  }

  if (str === "vip") return str.toUpperCase()

  return str.charAt(0).toUpperCase() + str.slice(1);
}

    return (
        <div className="overflow-x-auto min-h-80">
            <table className="min-w-full bg-white lg:text-[15px] text-[13px] text-left">
                <thead className="text-textPrimary">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-4 py-3 border-b-2 border-gray-200 font-medium">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="">
                    {currentData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center p-4 text-textSecondary">
                                No data available
                            </td>
                        </tr>
                    ) : (
                        currentData.map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-2 lg:text-[14px] text-[12px]">
                                        {col.type === 'action' ? (
                                            <div className="flex items-center gap-3">
                                                {col.actions?.includes('edit') && (
                                                    <button className="w-6 hover:underline flex">
                                                        <Dropdown
                                                            label=<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M12 10a2 2 0 1 0 2 2a2 2 0 0 0-2-2m-7 0a2 2 0 1 0 2 2a2 2 0 0 0-2-2m14 0a2 2 0 1 0 2 2a2 2 0 0 0-2-2" /></svg>
                                                            options={actions}
                                                            onChange={(option) => handleDropdownChange(option, row)}
                                                        />
                                                    </button>
                                                )}
                                            </div>
                                        ) : col.badge ? (
                                            <span className={cn(
                                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                getBadgeColor(row[col.key])
                                            )}>
                                                {capitalizeFirstLetter(row[col.key])}
                                            </span>
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {data.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-textSecondary">
                        Showing {currentData.length} of {data.length} entries
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                className="px-1 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-300"
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {getPageButtons().map((page) => (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`text-sm py-1 px-2 rounded ${currentPage === page
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 hover:bg-gray-200 text-textPrimary"
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                className="px-1 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-300"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenericTable;