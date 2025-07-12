import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function ReactivateStaffDialog({
  open,
  onClose,
  staff,
  onReactivate,
  isLoading,
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onReactivate(staff.id);
    if (result?.success) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-black/70 mb-4">
            Reactivate Staff
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center text-base text-black/80 mb-2">
            Are you sure you want to reactivate {staff?.name}?
          </div>
          <DialogFooter>
            <Button
              type="submit"
              variant="secondary"
              className="bg-success hover:bg-success/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Reactivating..." : "Reactivate"}
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
