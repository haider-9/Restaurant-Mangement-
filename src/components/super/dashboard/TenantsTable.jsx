import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { UserCircle2Icon } from "lucide-react";
import superAdminApi from "@/config/superAdminApi";
import { Badge } from "@/components/ui/badge";
import { PLAN_COLORS, PLAN_LABELS } from "@/constants/plansData";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/common/PaginationControls";
import useSocketEvent from "@/hooks/use-socket-event";

const ITEMS_PER_PAGE = 4;

const TenantsTable = ({ columns = [] }) => {
  const [tenantData, setTenantData] = useState([]);
  const {
    currentPage,
    totalPages,
    paginatedData: currentData,
    pageNumbers,
    startEntry,
    endEntry,
    totalCount,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(tenantData, ITEMS_PER_PAGE);

  const fetchData = async () => {
    const response = await superAdminApi.get("/tenants/top-performing");
    const mappedData =
      response?.tenantsData?.map((tenant) => ({
        ...tenant,
      })) || [];
    setTenantData(mappedData);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useSocketEvent("plan-bought", fetchData);

  return (
    <div className="w-full px-6 py-2">
      <h2 className="text-xl font-semibold py-3 text-black/70">Top Tenants</h2>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className="w-62 text-left">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-lg text-muted-foreground py-20"
              >
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
                          <img
                            src={row.imageUrl}
                            alt={row.tenantName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <UserCircle2Icon className="w-8 h-8" />
                        )}
                        <span
                          className="font-medium truncate block"
                          title={row.tenantName}
                        >
                          {row.tenantName}
                        </span>
                      </div>
                    ) : col.key === "plan" ? (
                      <Badge
                        variant="outline"
                        style={{
                          "--themeColor":
                            PLAN_COLORS[row[col.key]] || "var(--primary)",
                        }}
                        className={cn(
                          "rounded-full text-(--themeColor) border-(--themeColor)"
                        )}
                      >
                        {PLAN_LABELS[row[col.key]] || "N/A"}
                      </Badge>
                    ) : (
                      row[col.key] ?? "N/A"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
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
};

export default TenantsTable;
