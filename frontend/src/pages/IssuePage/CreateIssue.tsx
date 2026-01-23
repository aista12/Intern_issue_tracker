import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import { LabelPicker } from "./LabelPicker";
import { CreateLabelDialog } from "./CreateLabel";
import { DeleteLabelDialog } from "./DeleteLabel";

export function CreateIssueDialog(props: { vm: any }) {
  const { vm } = props;

  return (
    <>
      <Dialog open={vm.issueOpen} onOpenChange={vm.setIssueOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create issue</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={vm.title} onChange={(e) => vm.setTitle(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={vm.description} onChange={(e) => vm.setDescription(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={vm.issueStatus}
                  onValueChange={(v) => vm.setIssueStatus(v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">todo</SelectItem>
                    <SelectItem value="in_progress">in_progress</SelectItem>
                    <SelectItem value="done">done</SelectItem>
                    <SelectItem value="cancelled">cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={vm.priority}
                  onValueChange={(v) => vm.setPriority(v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">low</SelectItem>
                    <SelectItem value="medium">medium</SelectItem>
                    <SelectItem value="high">high</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Labels</Label>

              {vm.labelsQ.isLoading && <p className="text-sm text-muted-foreground">Loading labels...</p>}
              {vm.labelsQ.isError && <p className="text-sm text-red-600">Failed to load labels</p>}

              {vm.labelsQ.data && (
                <LabelPicker
                  labels={vm.labelsQ.data}
                  selectedLabelIds={vm.selectedLabelIds}
                  setSelectedLabelIds={vm.setSelectedLabelIds}
                  askDeleteLabel={vm.askDeleteLabel}
                />
              )}
            </div>

            <CreateLabelDialog
              open={vm.createLabelOpen}
              onOpenChange={vm.setCreateLabelOpen}
              labelName={vm.labelName}
              setLabelName={vm.setLabelName}
              labelColor={vm.labelColor}
              setLabelColor={vm.setLabelColor}
              createLabelM={vm.createLabelM}
            />

            {vm.createIssueM.isError && (
              <p className="text-sm text-red-600">
                {(vm.createIssueM.error as any)?.message ?? "Create failed"}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={() => vm.createIssueM.mutate()}
              disabled={vm.createIssueM.isPending || !vm.title.trim()}
            >
              {vm.createIssueM.isPending ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteLabelDialog
        open={vm.deleteLabelOpen}
        onOpenChange={vm.setDeleteLabelOpen}
        labelToDelete={vm.labelToDelete}
        setLabelToDelete={vm.setLabelToDelete}
        deleteLabelM={vm.deleteLabelM}
      />
    </>
  );
}
