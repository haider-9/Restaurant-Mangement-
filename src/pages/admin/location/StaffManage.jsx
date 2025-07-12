import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import locationApi from "@/config/locationApi";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  UserRoundMinus,
  UserRoundPen,
  UserRoundPlus,
  Trash2,
  Loader2,
  Search,
} from "lucide-react";
import Layout from "@/components/common/Layout";
import AddStaffDialog from "@/components/location/staffManage/AddStaffDialog";
import EditStaffDialog from "@/components/location/staffManage/EditStaffDialog";
import SuspendStaffDialog from "@/components/location/staffManage/SuspendStaffDialog";
import ReactivateStaffDialog from "@/components/location/staffManage/ReactivateStaff";
import DeleteStaffDialog from "@/components/location/staffManage/DeleteStaffDialog";
import { parseStaffId } from "@/lib";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/common/PaginationControls";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZE = 8;

export default function StaffManage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [showDialog, setShowDialog] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    userData: { locationId = "AB002L1" },
  } = useSelector((state) => state.auth);

  const filteredStaff = staffList.filter((staff) => {
    const statusMatch =
      selectedStatus === "all" ||
      staff.status.toLowerCase() === selectedStatus.toLowerCase();
    const searchMatch =
      staff.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.staffId?.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const {
    currentPage,
    totalPages,
    paginatedData,
    pageNumbers,
    startEntry,
    endEntry,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredStaff, PAGE_SIZE);

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    goToPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await locationApi.get(`/${locationId}/staff`);
        console.log(res);
        if (res.success && Array.isArray(res.staff)) {
          const mappedStaff = res.staff.map((staff) => {
            const { staffId, name } = parseStaffId(staff._id);
            return {
              ...staff,
              staffId,
              name,
              role: staff.role || "staff",
              status: staff.status || "active",
            };
          });
          setStaffList(mappedStaff);
          setTotalCount(res.count || mappedStaff.length);
        } else {
          setStaffList([]);
          setTotalCount(0);
        }
      } catch (err) {
        console.error(err.message, err);
        setStaffList([]);
        setTotalCount(0);
      }
      setLoading(false);
    };
    fetchStaff();
  }, [locationId]);

  const closeDialog = () => {
    setShowDialog("");
    setSelectedStaff(null);
  };

  const handleShowDialog = (dialogName, staff = null) => {
    setShowDialog(dialogName);
    setSelectedStaff(staff);
  };

  const showAddDialog = () => {
    handleShowDialog("add");
  };

  const showSuspendDialog = (staff) => {
    handleShowDialog("suspend", staff);
  };

  const showReactivateDialog = (staff) => {
    handleShowDialog("reactivate", staff);
  };

  const showEditDialog = (staff) => {
    handleShowDialog("edit", staff);
  };

  const showDeleteDialog = (staff) => {
    handleShowDialog("delete", staff);
  };

  const handleStaffUpdated = async () => {
    setLoading(true);
    try {
      const res = await locationApi.get(`/${locationId}/staff`);
      if (res.success && Array.isArray(res.staff)) {
        const mappedStaff = res.staff.map((staff) => {
          const { staffId, name } = parseStaffId(staff._id);
          return {
            ...staff,
            staffId,
            name,
            role: staff.role || "staff",
            status: staff.status || "active",
          };
        });
        setStaffList(mappedStaff);
        setTotalCount(res.count || mappedStaff.length);
      } else {
        setStaffList([]);
        setTotalCount(0);
      }
    } catch (err) {
      setStaffList([]);
      setTotalCount(0);
      toast.error(err?.message || "Failed to fetch staff");
    }
    setLoading(false);
    closeDialog();
  };

  const handleStaffAdd = async (staffName, password) => {
    const res = await locationApi.post(`/${locationId}/staff`, {
      name: staffName,
      password,
    });
    handleStaffUpdated();
    return res;
  };

  const handleSuspend = async (staff) => {
    try {
      await locationApi.put(`/${locationId}/staff/${staff._id}/suspend`);
      setStaffList((prev) =>
        prev.map((s) =>
          s._id === staff._id ? { ...s, status: "suspend" } : s
        )
      );
      closeDialog();
    } catch (err) {
      toast.error(err?.message || "Failed to suspend staff.");
    }
  };

  const handleReactivate = async (staff) => {
    try {
      await locationApi.put(`/${locationId}/staff/${staff._id}/reactivate`);
      setStaffList((prev) =>
        prev.map((s) => (s._id === staff._id ? { ...s, status: "active" } : s))
      );
      closeDialog();
    } catch (err) {
      toast.error(err?.message || "Failed to reactivate staff.");
    }
  };

  const handleStaffDeleted = (deletedId) => {
    setStaffList((prev) => prev.filter((s) => s._id !== deletedId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <Layout title={"Staff Management"}>
      <div className="p-6 bg-white rounded-3xl space-y-8 h-full">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={showAddDialog}>Add Staff</Button>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspend">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="relative flex-1 max-w-2xs">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        <AddStaffDialog
          open={showDialog === "add"}
          onClose={closeDialog}
          onAdd={handleStaffAdd}
        />
        <EditStaffDialog
          open={showDialog === "edit"}
          onClose={closeDialog}
          staff={selectedStaff}
          onUpdated={handleStaffUpdated}
        />

        <div>
          <h2 className="mb-2 font-bold text-2xl text-left">List of Staff</h2>
          <Table>
            <TableHeader>
              <TableRow className="text-base *:text-black/70">
                <TableHead>Staff ID</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-left">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-20">
                    <Loader2 className="animate-spin size-8 mx-auto" />
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No staff found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((staff) => (
                  <TableRow key={staff._id}>
                    <TableCell>{staff.staffId || staff._id || "-"}</TableCell>
                    <TableCell>{staff.name || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("text-white px-4 py-1 rounded-full capitalize", {
                          "bg-status-active": staff.status === "active",
                          "bg-status-suspended": staff.status == "suspend",
                        })}
                      >
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap max-w-40 items-center gap-2 text-center">
                        {staff.assignedTables && staff.assignedTables.length > 0
                          ? staff.assignedTables.map((table) => (
                              <Badge variant="outline">
                                {table.split("-").at(-1)}
                              </Badge>
                            ))
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                onClick={() => showEditDialog(staff)}
                                className="rounded-full hover:bg-primary/10 cursor-pointer"
                              >
                                <UserRoundPen className="text-blue-600" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          {staff.status === "suspend" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="icon"
                                  onClick={() => showReactivateDialog(staff)}
                                  className="rounded-full hover:bg-green-500/10 cursor-pointer"
                                >
                                  <UserRoundPlus className="text-green-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Reactivate</TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="icon"
                                  onClick={() => showSuspendDialog(staff)}
                                  className="rounded-full hover:bg-red-500/10 cursor-pointer"
                                >
                                  <UserRoundMinus className="text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Suspend</TooltipContent>
                            </Tooltip>
                          )}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                onClick={() => showDeleteDialog(staff)}
                                className="rounded-full hover:bg-red-500/10 cursor-pointer"
                              >
                                <Trash2 className="text-red-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <SuspendStaffDialog
            open={showDialog === "suspend"}
            onClose={closeDialog}
            staff={selectedStaff}
            onSuspend={handleSuspend}
          />

          <ReactivateStaffDialog
            open={showDialog === "reactivate"}
            onClose={closeDialog}
            staff={selectedStaff}
            onReactivate={handleReactivate}
          />

          <DeleteStaffDialog
            open={showDialog === "delete"}
            onClose={closeDialog}
            staff={selectedStaff}
            onDeleted={handleStaffDeleted}
            locationId={locationId}
          />

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
      </div>
    </Layout>
  );
}
