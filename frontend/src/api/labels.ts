import { apiFetch } from "./client";

export type Label = { id: string; name: string; color: string };

export function listLabels() {
  return apiFetch<Label[]>("/labels");
}

export function createLabel(name: string, color: string) {
  return apiFetch<Label>("/labels", {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export function deleteLabel(id: string) {
  return apiFetch<void>(`/labels/${id}`, {method: "DELETE"})
}
