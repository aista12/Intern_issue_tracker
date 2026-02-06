
export type AuthRequest = Request & { userId?: string };

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type ApiError = { status: number; message: string };
export type IssueRow = {
  issue_no: number;
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in_progress" | "done" | "cancelled";
  priority: "low" | "medium" | "high";
  labels: Label[];
  created_by_id: string;
};

export type IssueDetail = IssueRow & {
  created_by_name: string;
  created_by_email: string;
};

export type Label = { id: string; name: string; color: string };

export type LabelType = { id: string; name: string; color: string };

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