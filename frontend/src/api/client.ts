import { token } from "../auth/token";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";



export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token.get() ? { Authorization: `Bearer ${token.get()}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    let extra: any = {};
    try {
      const body = await res.json();
      const err = body?.error ?? {};
      message = err?.message ?? message;
      extra = err;
    } catch {}
    throw { status: res.status, message, ...extra } as T;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
