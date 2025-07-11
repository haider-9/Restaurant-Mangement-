import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import locationApi from "@/config/locationApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import MultiSelectComponent from "@/components/ui/multi-select-component";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialForm = {
  password: "",
  tables: [],
};

const EditStaffDialog = ({ open, onClose, staff, onUpdated }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [allTables, setAllTables] = useState([]);
  // For MultiSelectComponent controlled state
  const [selectedTables, setSelectedTables] = useState([]);

  const locationId = useSelector((state) => state.auth?.userData?.locationId) || "AB002L1";

  useEffect(() => {
    if (staff) {
      const tablesArr = staff.tables
        ? staff.tables.map((t) => (typeof t === "object" ? t._id : t))
        : [];
      setForm({
        password: "",
        tables: tablesArr,
      });
      setSelectedTables(tablesArr);
    } else {
      setForm(initialForm);
      setSelectedTables([]);
    }
    setError(null);
  }, [staff, open]);

  useEffect(() => {
    const fetchTables = async () => {
      if (!locationId) return;
      try {
        const res = await locationApi.get(`/${locationId}/tables`);
        const mappedTables = (res?.tables || []).map((table) => ({
          _id: table._id,
          name: table.name || table.tableName || `Table ${table._id.split("-").at(-1)}`,
        }));
        setAllTables(mappedTables);
      } catch (err) {
        setAllTables([]);
      }
    };
    if (open) fetchTables();
  }, [locationId, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // MultiSelectComponent is now controlled: update selectedTables and form.tables
  const handleTablesChange = (newSelected) => {
    setSelectedTables(newSelected);
    setForm((prev) => ({
      ...prev,
      tables: newSelected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!staff) return;
    setSubmitting(true);
    setError(null);
    try {
      const body = {};
      if (form.password) {
        body.password = form.password;
      }
      body.tableIds = selectedTables;
      body.staffId = staff._id;

      const res = await locationApi.put(`/${locationId}/staff/${staff._id}`, "", body);
      console.log("selectedTables",selectedTables)

      if (selectedTables.length >= 0) {
        await locationApi.put(`/${locationId}/staff/${staff._id}/assignTables`, "", body);
      }
      toast.success(res?.message || "Staff updated successfully.");
      if (onUpdated) onUpdated();
      if (onClose) onClose();
    } catch (err) {
      console.error(err)
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update staff."
      );
      toast.error(err?.response?.data?.message ||
        err?.message ||
        "Failed to update staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setForm(initialForm);
    setSelectedTables([]);
    setError(null);
    if (onClose) onClose();
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Prepare items for MultiSelectComponent
  const tableItems = allTables.map((table) => ({
    id: table._id,
    value: table._id,
    label: table.name,
  }));

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Edit Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[480px] max-h-[80vh] w-full pr-2">
            <div className="space-y-2 mb-2">
              <Label htmlFor="staffName">Staff ID</Label>
              <Input
                id="staffName"
                name="staffName"
                value={staff?.name || ""}
                autoComplete="off"
                className="bg-gray-100 cursor-not-allowed"
                readOnly
                tabIndex={-1}
              />
            </div>

            <div className="space-y-2 mb-2">
              <Label htmlFor="password">Password (leave blank to keep unchanged)</Label>
              <div className="relative flex items-center bg-input-background rounded-lg border">
                <Input
                  id="password"
                  name="password"
                  value={form.password}
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  className="border-none shadow-none"
                  autoComplete="off"
                  placeholder="New password"
                />
                <Button
                  variant="icon"
                  tabIndex={-1}
                  onClick={togglePassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  type="button"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 mb-2">
              <Label>Assign Tables</Label>
              <MultiSelectComponent
                items={tableItems}
                onSubmit={handleTablesChange}
                title="Assign Tables"
                description="Select tables to assign to this staff member"
                maxHeight="max-h-40"
                placeholder="No tables found."
                alreadySelectedItems={staff?.assignedTables}
              />
              {/* Show current selection as badges for clarity */}
              {selectedTables.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTables.map((tableId) => {
                    const table = allTables.find((t) => t._id === tableId);
                    return (
                      <span
                        key={tableId}
                        className="bg-secondary text-xs px-2 py-1 rounded"
                      >
                        {table?.name || tableId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button type="submit" disabled={submitting || !staff}>
              {submitting ? "Saving..." : "Save Changes"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDialogClose}
                disabled={submitting}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffDialog;