import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ReactivateStaffDialog = ({ open, onClose, staff, onReactivate }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleReactivate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (onReactivate) {
      await onReactivate(staff);
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
            Reactivate Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleReactivate} className="space-y-4">
          <div className="text-center text-base text-black/80 mb-2">
            {staff ? (
              <>
                Are you sure you want to reactivate{" "}
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
              variant="secondary"
              className="bg-success hover:bg-success/90 text-white cursor-pointer"
              disabled={submitting || !staff}
            >
              {submitting ? "Reactivating..." : "Reactivate"}
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

export default ReactivateStaffDialog;
