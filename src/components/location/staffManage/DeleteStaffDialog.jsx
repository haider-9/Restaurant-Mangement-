import { useState } from "react";
import locationApi from "@/config/locationApi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteStaffDialog = ({ open, onClose, staff, onDeleted, locationId }) => {
  const [submitting, setSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!staff) return;
    setSubmitting(true);
    try {
      await locationApi.delete(`/${locationId}/staff/${staff._id}`);
      if (onDeleted) onDeleted(staff._id);
      onClose();
    } catch (err) {
      console.log(err);
    }
    setSubmitting(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!submitting) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Delete Staff
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-base text-black/80 mb-2">
          {staff ? (
            <>
              Are you sure you want to delete{" "}
              <span className="font-semibold">{staff.name}</span> ?
              <p className="mt-2 text-destructive">
                This action cannot be undone.
              </p>
            </>
          ) : (
            "No staff selected."
          )}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="destructive"
            disabled={submitting || !staff}
            onClick={handleDelete}
          >
            {submitting ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={submitting}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStaffDialog;
