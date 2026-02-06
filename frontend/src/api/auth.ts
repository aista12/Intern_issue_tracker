import type { AuthUser } from "@/types";
import { apiFetch } from "./client";


export function login(email: string, password: string) {
  return apiFetch<{ token: string; user: AuthUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(name: string, email: string, password: string) {
  return apiFetch<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}
