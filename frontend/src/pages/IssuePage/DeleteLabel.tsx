import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function DeleteLabelDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  labelToDelete: { id: string; name: string } | null;
  setLabelToDelete: (v: { id: string; name: string } | null) => void;

  deleteLabelM: {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    mutate: (id: string, opts?: { onSuccess?: () => void }) => void;
    reset: () => void;
  };

}) {
  const { open, onOpenChange, labelToDelete, setLabelToDelete, deleteLabelM } = props;

  return (
    <Dialog 
      open={open} 
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) {
          deleteLabelM.reset();
          setLabelToDelete(null);
        }
      }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete label {labelToDelete ? `"${labelToDelete.name}"` : ""}
          </DialogTitle>
        </DialogHeader>
        {deleteLabelM.isError && (() => {
          const err: any = deleteLabelM.error;
          const used = err?.used;

          if (err?.status === 409) {
            return (
              <p className="text-sm text-red-600">
                This label is used by {used} issue{used === 1 ? "" : "s"}.
                Remove it from those issues first.
              </p>
            );
          }

          return (
            <p className="text-sm text-red-600">
              {err?.message ?? "Delete failed"}
            </p>
          );
        })()}


        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!labelToDelete || deleteLabelM.isPending}
            onClick={() => {
              if (!labelToDelete) return;
              deleteLabelM.mutate(labelToDelete.id, {
                onSuccess: () => {
                  onOpenChange(false);
                  setLabelToDelete(null);
                },
              });
            }}
          >
            {deleteLabelM.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
