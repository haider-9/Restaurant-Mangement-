import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { UserCircle2Icon } from "lucide-react";
import axios from "axios";
import Api from "@/config/api";

const ITEMS_PER_PAGE = 6;

const TenantsTable = ({ columns = []}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  useEffect(() => {
    (async () => {
      const superadminApi = new Api('api/superadmin/tenants/top-performing');
      const response = await superadminApi.get('')
      setData(response?.tenantsData ||[]);
      console.log(response)
    })()
  },[])
  console.log("tenant data",data)

  const currentData = data.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getPageNumbers = () => {
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
    <div className="w-full px-6 py-2">
      <h2 className="text-xl font-semibold py-3 text-black/70">Top Tenants</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="w-62">{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            currentData.map((row, idx) => (
              <TableRow key={idx} className="border-0">
                {columns.map((col) => (
                  <TableCell key={col.key} className="w-min">
                    {col.type === "image" ? (
                      <div className="flex items-center gap-3">
                        {row.imageUrl ? (
                          <img src={row.imageUrl} alt={row.tenantName} className="w-8 h-8 rounded-full" />
                        ) : (
                          <UserCircle2Icon className="w-8 h-8" />
                        )}
                        <span className="font-medium truncate block" title={row.tenantName}>{row.tenantName}</span>
                      </div>
                    ) : (
                      row[col.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                title="Previous"
                label=""
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>

            {getPageNumbers().map((page) => (
              <PaginationItem key={page} className="select-none cursor-pointer">
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                title="Next"
                label=""
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={cn(
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default TenantsTable;
