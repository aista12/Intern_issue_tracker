import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./api/RequireAuth";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { IssuesPage } from "./pages/IssuePage/IssuePage";
import { IssueDetailPage } from "./pages/IssueDetailPage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },

  {
    path: "/",
    element: (
      <RequireAuth>
        <IssuesPage />
      </RequireAuth>
    ),
  },
  {
    path: "/issues/:id",
    element: (
      <RequireAuth>
        <IssueDetailPage />
      </RequireAuth>
    ),
  },
]);
