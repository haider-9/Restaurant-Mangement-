import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Layout from '@/components/common/Layout'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import locationApi from '@/config/locationApi'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination"
import AddStaffDialog from '@/components/location/staffManage/AddStaffDialog'
import EditStaffDialog from '@/components/location/staffManage/EditStaffDialog'
import { UserRoundMinus, UserRoundPen, UserRoundPlus, Trash2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge'
import SuspendStaffDialog from '@/components/location/staffManage/SuspendStaffDialog'
import { cn } from "@/lib/utils"
import ReactivateStaffDialog from '@/components/location/staffManage/ReactivateStaff'
import DeleteStaffDialog from '@/components/location/staffManage/DeleteStaffDialog' // integrated here

const PAGE_SIZE = 8

function parseStaffId(id) {
  if (!id) return { staffId: "", name: "" }
  const lastDash = id.lastIndexOf("-");
  if (lastDash === -1) return { staffId: id, name: "" };
  const staffId = id.slice(0, lastDash);
  const afterDash = id.slice(lastDash + 1);
  if (afterDash.includes("@")) {
    return { staffId, name: afterDash.split("@")[0] };
  } else {
    return { staffId, name: afterDash };
  }
}

function StaffManage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showDialog, setShowDialog] = useState("")
  const [selectedStaff, setSelectedStaff] = useState(null);

  const { userData: { locationId = "AB002L1" } } = useSelector(state => state.auth)

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await locationApi.get(`/${locationId}/staff`);
        console.log(res)
        if (res.success && Array.isArray(res.staff)) {
          const mappedStaff = res.staff.map(staff => {
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
        console.error(err.message, err)
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

  // Edit handler
  const showEditDialog = (staff) => {
    handleShowDialog("edit", staff);
  };

  // Delete handler
  const showDeleteDialog = (staff) => {
    handleShowDialog("delete", staff);
  };

  // Called after editing a staff member
  const handleStaffUpdated = async () => {
    // Refresh staff list after edit
    setLoading(true);
    try {
      const res = await locationApi.get(`/${locationId}/staff`);
      if (res.success && Array.isArray(res.staff)) {
        const mappedStaff = res.staff.map(staff => {
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
    }
    setLoading(false);
    closeDialog();
  };

  const handleStaffAdd = async (staffName, password) => {
    return await locationApi.post(`/${locationId}/staff`, {
      name: staffName,
      password,
    });
  }

  const handleSuspend = async (staff) => {
    try {
      await locationApi.put(`/${locationId}/staff/${staff._id}/suspend`);
      setStaffList(prev =>
        prev.map(s => s._id === staff._id ? { ...s, status: "suspended" } : s)
      );
      closeDialog();
    } catch (err) {
      toast.error("Failed to suspend staff.");
    }
  };

  const handleReactivate = async (staff) => {
    try {
      await locationApi.put(`/${locationId}/staff/${staff._id}/reactivate`);
      setStaffList(prev =>
        prev.map(s => s._id === staff._id ? { ...s, status: "active" } : s)
      );
      closeDialog();
    } catch (err) {
      alert("Failed to reactivate staff.");
    }
  };

  // Remove staff from list after deletion
  const handleStaffDeleted = (deletedId) => {
    setStaffList(prev => prev.filter(s => s._id !== deletedId));
    setTotalCount(prev => Math.max(0, prev - 1));
  };

  // Pagination logic
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const paginatedStaff = staffList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(page - 2, 1);
      let end = Math.min(start + 4, totalPages);
      if (end - start < 4) start = Math.max(end - 4, 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  // ------
  return (
    <Layout title={"Staff Management"}>
      <div className='p-6 bg-white rounded-3xl space-y-8 h-full'>
        <div className="flex flex-wrap gap-4">
          <Button onClick={showAddDialog}>Add Staff</Button>
        </div>

        <AddStaffDialog open={showDialog === "add"} onClose={closeDialog} onAdd={handleStaffAdd} />
        <EditStaffDialog
          open={showDialog === "edit"}
          onClose={closeDialog}
          staff={selectedStaff}
          onUpdated={handleStaffUpdated}
        />

        <div>
          <h2 className='mb-2 font-bold text-2xl text-left'>
            List of Staff
          </h2>
          <Table>
            <TableHeader>
              <TableRow className="*:text-black/70">
                <TableHead>Staff ID</TableHead>
                <TableHead>Staff Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-left">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">Loading...</TableCell>
                </TableRow>
              ) : paginatedStaff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">No staff found.</TableCell>
                </TableRow>
              ) : (
                paginatedStaff.map(staff => (
                  <TableRow key={staff._id}>
                    <TableCell>{staff.staffId || staff._id || "-"}</TableCell>
                    <TableCell>{staff.name || "-"}</TableCell>
                    <TableCell>{staff.role || "staff"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("text-white rounded-full", {
                        "bg-success/80": staff.status === "active",
                        "bg-destructive/80": staff.status !== "active"
                      })}>
                        {staff.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex flex-wrap max-w-42 items-center gap-2'>

                        {staff.assignedTables && staff.assignedTables.length > 0
                          ? staff.assignedTables.map(table => (<Badge variant="outline">{table.split("-").at(-1)}</Badge>))
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <div className="flex gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="icon"
                                onClick={() => showEditDialog(staff)}
                                className="rounded-full cursor-pointer"
                              >
                                <UserRoundPen className="text-blue-600 size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                          {staff.status === "suspended" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="icon"
                                  onClick={() => showReactivateDialog(staff)}
                                  className="rounded-full cursor-pointer"
                                >
                                  <UserRoundPlus className="text-green-600 size-4" />
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
                                  className="rounded-full cursor-pointer"
                                >
                                  <UserRoundMinus className="text-red-600 size-4" />
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
                                className="rounded-full cursor-pointer"
                              >
                                <Trash2 className="text-red-500 size-4" />
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

          <ReactivateStaffDialog open={showDialog === "reactivate"} onClose={closeDialog} staff={selectedStaff} onReactivate={handleReactivate} />

          <DeleteStaffDialog
            open={showDialog === "delete"}
            onClose={closeDialog}
            staff={selectedStaff}
            onDeleted={handleStaffDeleted}
            locationId={locationId}
          />

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Pagination className="mt-2 justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    title="Previous"
                    label=""
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={cn(
                      page === 1 && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>

                {getPageNumbers().map((pg) => (
                  <PaginationItem key={pg} className="select-none cursor-pointer">
                    <PaginationLink
                      onClick={() => setPage(pg)}
                      isActive={page === pg}
                    >
                      {pg}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    title="Next"
                    label=""
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    className={cn(
                      page === totalPages && "pointer-events-none opacity-50"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default StaffManage