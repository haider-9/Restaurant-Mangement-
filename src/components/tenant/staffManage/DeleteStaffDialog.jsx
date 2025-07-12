import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function DeleteStaffDialog({
  open,
  onClose,
  staff,
  onDelete,
  isLoading,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onDelete(staff.id);
    if (result?.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Delete Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center text-base text-black/80 mb-2">
            {staff ? (
              <>
                Are you sure you want to delete{" "}
                <span className="font-semibold">{staff.name}</span>?
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
              type="submit"
              variant="secondary"
              className="bg-destructive hover:bg-destructive/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
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
