import { useState } from "react";
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
import locationApi from "@/config/locationApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const initialForm = {
  staffName: "",
  password: "",
};

const AddStaffDialog = ({ open, onClose, onAdd }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const locationId = useSelector((state) => state.auth?.userData?.locationId) || "AB002L1";
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // const res = await locationApi.post(`/${locationId}/staff`, {
      //   name: form.staffName,
      //   password: form.password,
      // });
      const res = await onAdd(form.staffName, form.password);
      if (res?.success) {
        toast.success(res?.message || "Staff added successfully.");
        setForm(initialForm);
        if (onClose) onClose();
      } else {
        setError(res?.message || "Failed to add staff.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add staff.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    setForm(initialForm);
    setError(null);
    if (onClose) onClose();
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Add Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="staffName">Staff Name</Label>
            <Input
              id="staffName"
              name="staffName"
              value={form.staffName}
              onChange={handleChange}
              required
              autoFocus
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative flex items-center bg-input-background rounded-lg border">
              <Input
                id="password"
                name="password"
                value={form.password}
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                required
                className="border-none shadow-none"
                autoComplete="off"
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
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Staff"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDialogClose}
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

export default AddStaffDialog;