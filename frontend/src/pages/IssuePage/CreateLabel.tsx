import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function CreateLabelDialog(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  labelName: string;
  setLabelName: (v: string) => void;

  labelColor: string;
  setLabelColor: (v: string) => void;

  createLabelM: {
    isPending: boolean;
    isError: boolean;
    error: unknown;
    mutate: () => void;
  };
}) {
  const { open, onOpenChange, labelName, setLabelName, labelColor, setLabelColor, createLabelM } = props;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">New label</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create label</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={labelName} onChange={(e) => setLabelName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <Input value={labelColor} onChange={(e) => setLabelColor(e.target.value)} />
            <p className="text-xs text-muted-foreground">Example: #22c55e</p>
          </div>

          {createLabelM.isError && (
            <p className="text-sm text-red-600">
              {(createLabelM.error as any)?.message ?? "Create label failed"}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={() => createLabelM.mutate()}
            disabled={createLabelM.isPending || !labelName.trim()}
          >
            {createLabelM.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
