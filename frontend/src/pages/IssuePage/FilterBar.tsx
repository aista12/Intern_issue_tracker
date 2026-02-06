import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LabelType } from "@/types";


export function FiltersBar(props: {
  STATUS: readonly string[];
  status: string;
  setStatus: (v: string) => void;

  labelId: string;
  setLabelId: (v: string) => void;

  search: string;
  setSearch: (v: string) => void;

  labels: LabelType[];
  openCreateIssue: () => void;
}) {
  const { STATUS, status, setStatus, labelId, setLabelId, search, setSearch, labels, openCreateIssue } = props;

  return (
    <div className="flex gap-3 flex-wrap">
      <div className="w-[200px]">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-[220px]">
        <Select value={labelId} onValueChange={setLabelId}>
          <SelectTrigger>
            <SelectValue placeholder="Label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all labels</SelectItem>
            {labels.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input
        className="max-w-sm"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Button className="bg-violet-900 hover:bg-violet-950" onClick={openCreateIssue}>Create issue</Button>
    </div>
  );
}
