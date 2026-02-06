import type { IssueDetail, IssueRow } from "@/types";
import { apiFetch } from "./client";


export function listIssues(params: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
  labelId?: string;
}) {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page));
  qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);
  if (params.labelId) qs.set("labelId", params.labelId);


  return apiFetch<IssueRow[]>(`/issues?${qs.toString()}`);
}

export function getIssue(id: string) {
  return apiFetch<IssueDetail>(`/issues/${id}`);
}

export function createIssue(input: {
  title: string;
  description?: string;
  status: IssueRow["status"];
  priority: IssueRow["priority"];
}) {
  return apiFetch<IssueRow>("/issues", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function addLabelsToIssue(issueId: string, labelIds: string[]) {
  return apiFetch<void>(`/issues/${issueId}/labels`, {
    method: "POST",
    body: JSON.stringify({ labelIds }),
  });
}

export function deleteIssue(id: string) {
  return apiFetch<void>(`/issues/${id}`, { method: "DELETE" });
}