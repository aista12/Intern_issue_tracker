export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

const KEY = "issue_tracker_user";

export const authUser = {
  get(): AuthUser | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  },
  set(user: AuthUser) {
    localStorage.setItem(KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(KEY);
  },
};