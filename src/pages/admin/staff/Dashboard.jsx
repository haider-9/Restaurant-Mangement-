import Layout from "@/components/common/Layout";
import { useState } from "react";
import Api from "@/config/api";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import PaginationControls from "@/components/common/PaginationControls";
import { usePagination } from "@/hooks/use-pagination";

const staffTableColumns = [
  { key: "customer", label: "Customer" },
  { key: "partySize", label: "Party Size" },
  { key: "date", label: "Date" },
  { key: "time", label: "Time" },
  { key: "tableId", label: "Table(s)" },
  { key: "status", label: "Status" },
  { key: "specialRequests", label: "Special Requests" },
  { key: "allergies", label: "Allergies" },
];

function Dashboard() {
  const [data, setData] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const getStaffApi = new Api(`/api/locations/${userData.locationId}/staff`);

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalCount,
    startEntry,
    endEntry,
    pageNumbers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(data, 10);

  useEffect(() => {
    async function fetchReservations() {
      const response = await getStaffApi.get(
        `/${userData._id}/tableReservations`
      );
      console.log(response);
      if (response.reservations) {
        setData(response.reservations);
      }
    }
    fetchReservations();
  }, [userData]);

  return (
    // <Layout title="Dashboard">
      <div className="w-full gap-4 mt-14 *:rounded-3xl">
        <div className="md:col-span-3 min-h-32 p-6 bg-white border">
          <h3 className="text-lg font-semibold mb-2 text-left">
            Assigned Reservations & Tables
          </h3>
          <Table>
            <TableHeader>
              <TableRow>
                {staffTableColumns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={staffTableColumns.length}
                    className="text-center"
                  >
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell>{row.customer.customerName}</TableCell>
                    <TableCell>{row.partySize}</TableCell>
                    <TableCell>
                      {new Date(row.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      {Array.isArray(row.tableId)
                        ? row.tableId.join(", ")
                        : row.tableId}
                    </TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.specialRequests || "-"}</TableCell>
                    <TableCell>{row.allergies || "-"}</TableCell>
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
      </div>
    // </Layout>
  );
}

export default Dashboard;
