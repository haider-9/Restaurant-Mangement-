import Layout from "@/components/common/Layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Search,
  TriangleAlert,
  UserRoundMinus,
  UserRoundPlus,
  Trash2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { usePagination } from "@/hooks/use-pagination";
import PaginationControls from "@/components/common/PaginationControls";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "react-toastify";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetLocationsQuery,
  useGetTenantStaffQuery,
  useReactivateStaffMutation,
  useSuspendStaffMutation,
} from "@/store/services/tenantApi";
import ReactivateStaffDialog from "@/components/tenant/staffManage/ReactivateStaffDialog";
import SuspendStaffDialog from "@/components/tenant/staffManage/SuspendStaffDialog";
import AddStaffDialog from "@/components/tenant/staffManage/AddStaffDialog";
import DeleteStaffDialog from "@/components/tenant/staffManage/DeleteStaffDialog";

const PAGE_SIZE = 8;

function StaffManage() {
  const {
    userData: { tenantId },
  } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDialog, setShowDialog] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);

  const {
    data: staffList = [],
    isLoading,
    isError,
    refetch,
  } = useGetTenantStaffQuery(tenantId);

  const { data: locations } = useGetLocationsQuery(tenantId, {
    refetchOnFocus: true,
  });

  const [createStaff, { isLoading: isAdding }] = useCreateStaffMutation();
  const [suspendStaff, { isLoading: isSuspending }] = useSuspendStaffMutation();
  const [reactivateStaff, { isLoading: isReactivating }] =
    useReactivateStaffMutation();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const closeDialog = () => {
    setShowDialog("");
    setSelectedStaff(null);
  };

  const handleShowDialog = (dialogName, staff = null) => {
    setShowDialog(dialogName);
    setSelectedStaff(staff);
  };

  const handleStaffCreation = async (staffData) => {
    try {
      const response = await createStaff({
        tenantId,
        staff: staffData,
      }).unwrap();
      if (response?.success) {
        toast.success(response?.data?.message || "Staff added successfully.");
        refetch();
        closeDialog();
        return { success: true };
      } else {
        toast.error(response?.data?.message || "Failed to add staff.");
        return { success: false };
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add staff.");
      return { success: false };
    }
  };

  const handleStaffSuspension = async (staffId) => {
    try {
      const result = await suspendStaff({ tenantId, staffId }).unwrap();
      if (result?.success) {
        toast.success(result?.data?.message || "Staff suspended successfully.");
        refetch();
        closeDialog();
        return { success: true };
      } else {
        toast.error("Failed to suspend staff.");
        return { success: false };
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to suspend staff.");
      return { success: false };
    }
  };

  const handleStaffReactivation = async (staffId) => {
    try {
      const result = await reactivateStaff({ tenantId, staffId }).unwrap();
      if (result?.success) {
        toast.success(
          result?.data?.message || "Staff reactivated successfully."
        );
        refetch();
        closeDialog();
        return { success: true };
      } else {
        toast.error("Failed to reactivate staff.");
        return { success: false };
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to reactivate staff.");
      return { success: false };
    }
  };

  const handleStaffDeletion = async (staffId) => {
    try {
      console.log(staffId);
      const result = await deleteStaff({ tenantId, staffId }).unwrap();
      if (result?.success) {
        toast.success(result?.data?.message || "Staff deleted successfully.");
        refetch();
        closeDialog();
        return { success: true };
      } else {
        toast.error("Failed to delete staff.");
        return { success: false };
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete staff.");
      return { success: false };
    }
  };

  const filteredStaff = useMemo(() => {
    return staffList.filter((staff) => {
      const roleMatch = selectedRole === "all" || staff.role === selectedRole;
      const statusMatch =
        selectedStatus === "all" ||
        staff.status.toLowerCase() === selectedStatus.toLowerCase();
      const locationMatch =
        selectedLocation === "all" || staff.location?.id === selectedLocation;
      const searchMatch =
        staff.name?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        staff.email?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
        staff.id?.toLowerCase().includes(searchQuery?.toLowerCase());
      return roleMatch && statusMatch && locationMatch && searchMatch;
    });
  }, [staffList, selectedRole, selectedStatus, selectedLocation, searchQuery]);

  const {
    currentPage,
    totalPages,
    totalCount,
    paginatedData: paginatedStaff,
    pageNumbers,
    startEntry,
    endEntry,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = usePagination(filteredStaff, PAGE_SIZE);

  const handleRoleChange = (value) => {
    setSelectedRole(value);
    goToPage(1);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
    goToPage(1);
  };

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    goToPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };

  return (
    <Layout title="Staff Management">
      <div className="p-6 bg-white rounded-3xl space-y-8 h-full">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="w-full flex items-center flex-wrap justify-between gap-2">
            <div className="flex items-center gap-2">
              <Select value={selectedRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="location-admin">Location Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
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
              <Select
                value={selectedLocation}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1">
              <Button onClick={() => handleShowDialog("add")}>Add Staff</Button>
              <div className="relative flex-1 min-w-42 max-w-2xs">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <Table>
          <TableRow>
            <TableHead>Staff ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="py-28">
                  <Loader2 className="animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            )}
            {isError && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-28 text-destructive font-semibold text-center"
                >
                  <TriangleAlert className="inline-block align-middle mr-2" />
                  <span>Error fetching staff data.</span>
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !isError && filteredStaff.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-28 text-muted-foreground font-semibold text-center text-lg"
                >
                  <span>No staff members found.</span>
                </TableCell>
              </TableRow>
            )}
            {paginatedStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>{staff.id}</TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.location?.name || "N/A"}</TableCell>
                <TableCell>
                  <Badge
                    className={cn("capitalize", {
                      "bg-violet": staff.role == "staff",
                    })}
                  >
                    {staff.role.replace("-", " ") || "N/A"}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  <Badge
                    className={cn({
                      "bg-status-active": staff.status == "active",
                      "bg-status-suspended": staff.status == "suspend",
                    })}
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {staff.status === "suspend" ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="icon"
                          onClick={() => handleShowDialog("reactivate", staff)}
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
                          onClick={() => handleShowDialog("suspend", staff)}
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
                        onClick={() => handleShowDialog("delete", staff)}
                        className="rounded-full hover:bg-destructive/10 cursor-pointer"
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AddStaffDialog
          open={showDialog === "add"}
          onClose={closeDialog}
          locations={locations}
          onSubmit={handleStaffCreation}
          isLoading={isAdding}
        />

        <SuspendStaffDialog
          open={showDialog === "suspend"}
          onClose={closeDialog}
          staff={selectedStaff}
          onSuspend={handleStaffSuspension}
          isLoading={isSuspending}
        />

        <ReactivateStaffDialog
          open={showDialog === "reactivate"}
          onClose={closeDialog}
          staff={selectedStaff}
          onReactivate={handleStaffReactivation}
          isLoading={isReactivating}
        />

        <DeleteStaffDialog
          open={showDialog === "delete"}
          onClose={closeDialog}
          staff={selectedStaff}
          onDelete={handleStaffDeletion}
          isLoading={isDeleting}
        />

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={PAGE_SIZE}
          startEntry={startEntry}
          endEntry={endEntry}
          pageNumbers={pageNumbers}
          onPageChange={goToPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
        />
      </div>
    </Layout>
  );
}

export default StaffManage;
