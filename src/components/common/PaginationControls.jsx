import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const PaginationControls = ({
  currentPage,
  totalPages,
  totalCount,
  startEntry,
  endEntry,
  pageNumbers,
  onPageChange,
  onNextPage,
  onPreviousPage,
  showLabel = false,
}) => {
  if (totalPages == 1 || totalCount <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 pt-8">
      {showLabel && (
        <div className="text-sm text-muted-foreground w-full text-center sm:text-left">
          Showing data {startEntry} to {endEntry} of {totalCount} entries
        </div>
      )}
      <Pagination className="justify-center sm:justify-end">
        <PaginationContent className="gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={onPreviousPage}
              disabled={currentPage === 1}
              label=""
              className="bg-muted hover:bg-gray-200 cursor-pointer"
            />
          </PaginationItem>
          {pageNumbers.map((pageNum, index) => (
            <PaginationItem key={index}>
              {pageNum === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => onPageChange(pageNum)}
                  isActive={currentPage === pageNum}
                  className={cn(
                    "cursor-pointer bg-muted hover:bg-white",
                    currentPage === pageNum &&
                      "bg-violet text-white hover:bg-violet"
                  )}
                >
                  {pageNum}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              label=""
              className="bg-muted hover:bg-gray-200 cursor-pointer"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationControls;
