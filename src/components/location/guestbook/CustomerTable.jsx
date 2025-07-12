import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PaginationControls from "@/components/common/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

export function CustomerTable({
  customers,
  onCustomerSelect,
  restartPagination = false,
}) {
  const {
    currentPage,
    paginatedData: currentCustomers,
    totalPages,
    totalCount,
    startEntry,
    endEntry,
    pageNumbers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    setPage,
  } = usePagination(customers, 8);

  useEffect(() => {
    if (restartPagination) {
      setPage(1);
    }
  }, [restartPagination, setPage]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="*:text-muted-foreground">
            <TableHead>Customer Name</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Last Visited</TableHead>
            <TableHead>Customer Type</TableHead>
            <TableHead className="w-20"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentCustomers.length == 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20 text-lg text-muted-foreground">
                No data to show
              </TableCell>
            </TableRow>
          )}
          {currentCustomers?.map((customer) => (
            <TableRow
              key={customer._id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onCustomerSelect(customer?._id)}
            >
              <TableCell className="py-4 border-muted">
                {customer.customerName}
              </TableCell>
              <TableCell className="py-4 border-muted">
                {customer.customerPhone}
              </TableCell>
              <TableCell className="py-4 border-muted">
                {customer.customerEmail}
              </TableCell>
              <TableCell className="py-4 border-muted">
                {formatDate(customer.lastVisit)}
              </TableCell>
              <TableCell className="py-4 border-muted">
                <span className={cn("px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs")}>
                  {customer.customerType}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        startEntry={startEntry}
        endEntry={endEntry}
        pageNumbers={pageNumbers}
        onPageChange={goToPage}
        onNextPage={goToNextPage}
        onPreviousPage={goToPreviousPage}
        showLabel={true}
      />
    </div>
  );
}
