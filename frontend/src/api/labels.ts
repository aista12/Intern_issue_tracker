import type { Label } from "@/types";
import { apiFetch } from "./client";


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
