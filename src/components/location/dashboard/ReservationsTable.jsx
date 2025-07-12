import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSelector } from "react-redux";
import locationApi from "@/config/locationApi";
import { Badge } from "@/components/ui/badge";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/common/PaginationControls";
import useSocketEvent from "@/hooks/use-socket-event";

const ITEMS_PER_PAGE = 6;

function renderTableName(tableName) {
  return String(tableName).split("-").at(-1);
}

const ReservationsTable = () => {
  const [reservations, setReservations] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const {
    userData: { locationId },
  } = useSelector((state) => state.auth);

  const {
    currentPage,
    paginatedData,
    totalPages,
    pageNumbers,
    startEntry,
    endEntry,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(reservations, ITEMS_PER_PAGE);

  const fetchReservations = async () => {
    try {
      const response = await locationApi.get(`/${locationId}/reservations`);

      let reservationList = [];
      let count = 0;

      reservationList = response.reservations;
      count = response.count ?? response.reservations.length ?? 0;

      console.log(reservationList);

      const formattedData = reservationList.map((reservation) => ({
        customerName: reservation.customer?.customerName || "",
        partySize: reservation.partySize,
        date: reservation.date
          ? new Date(reservation.date).toLocaleDateString()
          : "",
        time: reservation.time,
        tableIds: reservation.tableId?.map((tableId) => tableId._id),
        phone: reservation.customer?.customerPhone || "",
      }));
      setReservations(formattedData);
      setTotalCount(count);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };
  useEffect(() => {
    fetchReservations();
  }, []);

  useSocketEvent("new-booking", fetchReservations);

  return (
    <div className="w-full min-h-[250px] bg-white rounded-2xl">
      <h2 className="text-xl font-semibold pb-3 text-black/70">Reservations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Phone No</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((reservation, index) => (
              <TableRow key={index} className="border-0 text-left">
                <TableCell>{reservation.customerName}</TableCell>
                <TableCell>{reservation.partySize}</TableCell>
                <TableCell>{reservation.date}</TableCell>
                <TableCell>{reservation.time}</TableCell>
                <TableCell className="max-w-32 flex flex-wrap gap-1">
                  {reservation.tableIds.map((tableId) => (
                    <Badge variant="outline">{renderTableName(tableId)}</Badge>
                  ))}
                </TableCell>
                <TableCell>{reservation.phone}</TableCell>
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
      />
    </div>
  );
};

export default ReservationsTable;
