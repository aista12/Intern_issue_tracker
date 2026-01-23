import { useEffect,  useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";

import { apiFetch } from "../api/client";
import { deleteIssue, getIssue } from "../api/issues";
import { authUser } from "../auth/user";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STATUS = ["todo", "in_progress", "done", "cancelled"] as const;
const PRIORITY = ["low", "medium", "high"] as const;

export function IssueDetailPage() {


  const nav = useNavigate()
  const { id } = useParams<{ id: string }>();
  const qc = useQueryClient();

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");


  const q = useQuery({
    queryKey: ["issue", id],
    queryFn: () => getIssue(id!),
    enabled: !!id,
  });

  const issue = q.data;

  

  useEffect(() => {
    if (issue) {
      setTitle(issue.title ?? "");
      setDescription(issue.description ?? "");
    }
  }, [issue?.id]);

  const patchTitle = useMutation({
    mutationFn: (v: string) =>
      apiFetch<void>(`/issues/${id}/title`, { method: "PATCH", body: JSON.stringify({ title: v }) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["issue", id] }),
  });

  const patchDescription = useMutation({
    mutationFn: (v: string) =>
      apiFetch<void>(`/issues/${id}/description`, { method: "PATCH", body: JSON.stringify({ description: v }) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["issue", id] }),
  });

  const patchStatus = useMutation({
    mutationFn: (v: string) =>
      apiFetch<void>(`/issues/${id}/status`, { method: "PATCH", body: JSON.stringify({ status: v }) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["issue", id] }),
  });

  const patchPriority = useMutation({
    mutationFn: (v: string) =>
      apiFetch<void>(`/issues/${id}/priority`, { method: "PATCH", body: JSON.stringify({ priority: v }) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["issue", id] }),
  });


  const deleteM = useMutation({
    mutationFn: () => deleteIssue(id!),
    onSuccess: async () => {
      nav("/");
    },
  });

  if (q.isLoading) return <div className="p-6">Loading...</div>;
  if (q.isError) return <div className="p-6 text-red-600">{(q.error as any)?.message ?? "Error"}</div>;
  if (!issue) return <div className="p-6">Not found</div>;

  const me = authUser.get()
  const isOwner = !!me && me.id === issue.created_by_id


  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <Link className="underline text-sm" to="/"> Back</Link>

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center justify-between">
            <span>Issue #{issue.issue_no}</span>
            <div className="flex gap-2">
              <Badge className="bg-blue-200" variant="secondary">{issue.status}</Badge>
              <Badge variant="outline">{issue.priority}</Badge>
            </div> 
            
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm">Labels</div>

            <div className="flex flex-wrap gap-2">
              {(issue as any).labels?.length ? (
                (issue as any).labels.map((l: any) => (
                  <Badge key={l.id} variant="outline">
                    <span
                      className="inline-block h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: l.color }}
                    />
                    {l.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">no labels</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm ">Title</div>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} disabled={!editing} />
            {editing && (
              <Button
                variant="outline"
                onClick={() => patchTitle.mutate(title)}
                disabled={patchTitle.isPending || title.trim() === ""}
              >
                Save title
              </Button>

            )}
          </div>

          <div className="space-y-2">
            <div className="text-sm ">Description</div>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} disabled={!editing} />
              {editing &&
              (
                <Button
                  variant="outline"
                  onClick={() => patchDescription.mutate(description)}
                  disabled={patchDescription.isPending}
                >
                  Save description
                </Button>

              )
              }
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="w-[220px] space-y-2">
              <div className="text-sm ">Status</div>
              <Select value={issue.status} onValueChange={(v) => patchStatus.mutate(v)} disabled={!editing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[220px] space-y-2">
              <div className="text-sm ">Priority</div>
              <Select value={issue.priority} onValueChange={(v) => patchPriority.mutate(v)} disabled={!editing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          
            <div className="text-sm ">
              Created by <span className="font-medium">{issue.created_by_name}</span> ({issue.created_by_email})
            </div>

          {(patchTitle.isError || patchDescription.isError || patchStatus.isError || patchPriority.isError) && (
            <p className="text-sm text-red-600">update failed, sorry</p>
          )}

          <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditing((x) => !x)}>
                  {editing ? "Cancel" : "Edit"}
                </Button>

                {isOwner && (
                  <Button
                    className="bg-gray-500 hover:bg-gray-300"
                    onClick={() => deleteM.mutate()}
                    disabled={deleteM.isPending}
                   
                  >
                    {deleteM.isPending ? "Deleting..." : "Delete"}
                  </Button>
                )}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
