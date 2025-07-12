import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteLocationDialog = ({ open, onOpenChange, isLoading, onCancel, onConfirm }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Delete Location</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        <p>Are you sure you want to delete this location? This action cannot be undone.</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

export default DeleteLocationDialog;
