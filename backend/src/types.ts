export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};

export type Issue = {
  id: string;
  title: string;
  description: string;
  labels: Label[];
  status: Status;
  priority: Priority;
  created_by: User;
};

export interface Label {
    id: string;
    name: string;
    color: string;
}

export enum Status {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
  CANCELLED = "cancelled",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}



export type IssueRow = {
  issue_no: number;
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  created_by_id: string;
};

export type IssueWithLabels  = IssueRow & { labels: Label[] };
export type IssueDetailRow = IssueWithLabels & {
  created_by_name: string;
  created_by_email: string;
}