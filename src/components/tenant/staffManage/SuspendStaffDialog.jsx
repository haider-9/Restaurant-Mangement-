import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

export default function SuspendStaffDialog({
  open,
  onClose,
  staff,
  onSuspend,
  isLoading,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSuspend(staff.id);
      onClose();
    } catch (error) {
      toast.error(error?.message || "Failed to suspend staff")
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Suspend Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-center">
              Are you sure you want to suspend this staff member?
            </p>
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive" disabled={isLoading}>
              {isLoading ? "Suspending..." : "Suspend"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
