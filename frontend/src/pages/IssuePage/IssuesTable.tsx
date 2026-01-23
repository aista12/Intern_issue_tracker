import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function StatusBadge({ s }: { s: "todo" | "in_progress" | "done" | "cancelled" }) {
  return <Badge variant="secondary">{s}</Badge>;
}

type LabelType = { id: string; name: string; color: string };

export type IssueRowUI = {
  issue_no: number;
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high";
  labels: LabelType[];
  created_by_id: string;
};

export function IssuesTable(props: {
  page: number;
  setPage: (fn: (p: number) => number) => void;
  limit: number;
  q: {
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    data: IssueRowUI[] | undefined;
  };
}) {
  const { page, setPage, limit, q } = props;

  return (
    <div className="space-y-3">
      {q.isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {q.isError && (
        <p className="text-sm text-red-600">
          {(q.error as any)?.message ?? "Failed to load"}
        </p>
      )}

      {q.data && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Label</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {q.data.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="text-muted-foreground">{it.issue_no}</TableCell>

                  <TableCell>
                    <Link className="underline" to={`/issues/${it.id}`}>
                      {it.title}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <StatusBadge s={it.status} />
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{it.priority}</Badge>
                  </TableCell>

                  <TableCell>
                    {it.labels.length ? (
                      <div className="flex flex-wrap gap-1">
                        {it.labels.map((l) => (
                          <Badge key={l.id} variant="outline">
                            {l.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              Prev
            </Button>

            <span className="text-sm text-muted-foreground">Page {page}</span>

            <Button
              variant="outline"
              disabled={!q.data || q.data.length < limit}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
