import { useNavigate } from "react-router-dom";
import { token } from "@/auth/token";
import { authUser } from "@/auth/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useIssuesPage } from "./useIssuePage";
import { FiltersBar } from "./FilterBar";
import { IssuesTable } from "./IssuesTable";
import { CreateIssueDialog } from "./CreateIssue";

export function IssuesPage() {
  const nav = useNavigate();
  const vm = useIssuesPage();

  return (
    <div className="bg-violet-100 w-full">

    <div className="p-6 max-w-5xl mx-auto space-y-4 ">
      <div className="flex items-center justify-between">
        <h1 className=" text-2xl font-semibold ">Issue Tracker</h1>
        <Button
          variant="outline"
          onClick={() => {
            token.clear();
            authUser.clear();
            nav("/login");
          }}
        >
          Logout
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-base">Filters</CardTitle>

          <FiltersBar
            STATUS={vm.STATUS}
            status={vm.status}
            setStatus={(v) => { vm.setPage(1); vm.setStatus(v as any); }}
            labelId={vm.labelId}
            setLabelId={(v) => { vm.setPage(1); vm.setLabelId(v); }}
            search={vm.search}
            setSearch={(v) => { vm.setPage(1); vm.setSearch(v); }}
            labels={vm.labelsQ.data ?? []}
            openCreateIssue={() => vm.setIssueOpen(true)}
          />
        </CardHeader>

        <CardContent className="space-y-3">
          <IssuesTable
            page={vm.page}
            setPage={vm.setPage}
            limit={vm.limit}
            q={vm.issuesQ}
          />
        </CardContent>
      </Card>

      <CreateIssueDialog vm={vm} />
    </div>
        </div>
  );
}
