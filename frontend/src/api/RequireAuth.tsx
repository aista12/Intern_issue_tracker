import { Navigate } from "react-router-dom";
import { token } from "../auth/token";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!token.get()) return <Navigate to="/login" replace />;
  return children;
}
