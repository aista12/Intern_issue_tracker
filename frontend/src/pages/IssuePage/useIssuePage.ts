import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIssue, listIssues, addLabelsToIssue } from "@/api/issues";
import { createLabel, deleteLabel, listLabels } from "@/api/labels";
import type { IssueRow } from "@/types";

const STATUS = ["all", "todo", "in_progress", "done", "cancelled"] as const;

export function useIssuesPage() {
  const qc = useQueryClient();

  //filters
  const [page, setPage] = useState(1);
  const limit = 10;
  const [status, setStatus] = useState<(typeof STATUS)[number]>("all");
  const [search, setSearch] = useState("");
  const [labelId, setLabelId] = useState<string>("all");

  //create issue dialog
  const [issueOpen, setIssueOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IssueRow["priority"]>("medium");
  const [issueStatus, setIssueStatus] = useState<IssueRow["status"]>("todo");
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);

  //create label dialog
  const [createLabelOpen, setCreateLabelOpen] = useState(false);
  const [labelName, setLabelName] = useState("");
  const [labelColor, setLabelColor] = useState("#22c55e");

  //delete label dialog
  const [deleteLabelOpen, setDeleteLabelOpen] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState<{ id: string; name: string } | null>(null);

  const issuesKey = useMemo(
    () => ["issues", page, limit, status, search, labelId],
    [page, limit, status, search, labelId]
  );

  const issuesQ = useQuery({
    queryKey: issuesKey,
    queryFn: () =>
      listIssues({
        page,
        limit,
        status: status === "all" ? undefined : status,
        search: search.trim() ? search.trim() : undefined,
        labelId: labelId === "all" ? undefined : labelId,
      }),
  });

  const labelsQ = useQuery({
    queryKey: ["labels"],
    queryFn: listLabels,
  });

  const createLabelM = useMutation({
    mutationFn: () => createLabel(labelName, labelColor),
    onSuccess: async (created) => {
      setCreateLabelOpen(false);
      setLabelName("");
      setLabelColor("#22c55e");
      await qc.invalidateQueries({ queryKey: ["labels"] });
      setSelectedLabelIds((prev) => [...prev, created.id]);
    },
  });

  const deleteLabelM = useMutation({
    mutationFn: (id: string) => deleteLabel(id),
    onSuccess: async (_, deletedId) => {
      await qc.invalidateQueries({ queryKey: ["labels"] });
      setSelectedLabelIds((prev) => prev.filter((x) => x !== deletedId));
    },
  });

  const createIssueM = useMutation({
    mutationFn: async () => {
      const created = await createIssue({ title, description, status: issueStatus, priority });
      if (selectedLabelIds.length) await addLabelsToIssue(created.id, selectedLabelIds);
      return created;
    },
    onSuccess: async () => {
      setIssueOpen(false);
      setTitle("");
      setDescription("");
      setIssueStatus("todo");
      setPriority("medium");
      setSelectedLabelIds([]);
      await qc.invalidateQueries({ queryKey: ["issues"] });
    },
  });

  function askDeleteLabel(l: { id: string; name: string }) {
    deleteLabelM.reset();
    setLabelToDelete({ id: l.id, name: l.name });
    setDeleteLabelOpen(true);
  }

  return {
    STATUS,

    //filters
    page, setPage, limit,
    status, setStatus,
    search, setSearch,
    labelId, setLabelId,

    //queries
    issuesQ,
    labelsQ,

    //create issue
    issueOpen, setIssueOpen,
    title, setTitle,
    description, setDescription,
    priority, setPriority,
    issueStatus, setIssueStatus,
    selectedLabelIds, setSelectedLabelIds,
    createIssueM,

    //create label
    createLabelOpen, setCreateLabelOpen,
    labelName, setLabelName,
    labelColor, setLabelColor,
    createLabelM,

    //delete label
    deleteLabelOpen, setDeleteLabelOpen,
    labelToDelete, setLabelToDelete,
    deleteLabelM,
    askDeleteLabel,
  };
}
