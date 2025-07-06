import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 6;

const TablePicture = ({ columns = [], data = [] }) => {
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

  return (
    <div className="overflow-x-auto min-w-full bg-white rounded-2xl p-4 min-h-80">
      <h2 className="text-2xl font-semibold px-4 py-6">
        Top Performing Restaurants
      </h2>
      <table className="min-w-full bg-white rounded-2xl lg:text-[15px] text-[13px] text-left">
        <thead className="text-textPrimary">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 border-b-2 border-gray-200 font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center p-4 text-textSecondary"
              >
                No data available
              </td>
            </tr>
          ) : (
            currentData.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-2 lg:text-[14px] text-[12px]"
                  >
                    {col.type === "image" ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            row[col.key] ||
                            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                          }
                          alt="restaurant"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium">
                          {row.name || row[col.nameKey] || ""}
                        </span>
                      </div>
                    ) : col.key === "status" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row[col.key] === "Active"
                            ? "bg-green-100 text-green-800"
                            : row[col.key] === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {row[col.key]}
                      </span>
                    ) : col.key === "rating" ? (
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{row[col.key]}</span>
                      </div>
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

      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-1 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-300"
          >
            <ChevronLeft size={16} />
          </button>

          {getPageButtons().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`text-sm py-1 px-2 rounded ${
                currentPage === page
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-textPrimary"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            className="px-1 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:text-gray-300"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default TablePicture;
