import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";


const SuspendStaffDialog = ({ open, onClose, staff, onSuspend }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleSuspend = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (onSuspend) {
      await onSuspend(staff);
    }
    setSubmitting(false);
    if (onClose) onClose();
  };

  const handleDialogClose = () => {
    setSubmitting(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Suspend Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSuspend} className="space-y-4">
          <div className="text-center text-base text-black/80 mb-2">
            {staff ? (
              <>
                Are you sure you want to suspend{" "}
                <span className="font-semibold">
                  {staff.firstName} {staff.lastName}
                </span>
                ?
              </>
            ) : (
              "No staff selected."
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitting || !staff}
            >
              {submitting ? "Suspending..." : "Suspend"}
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
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

export default SuspendStaffDialog;