import { IssueRepository } from "../repositories/issue.repository";
import { Issue, IssueWithLabels, IssueRow, Label, IssueDetailRow } from "../types";

export class IssueService {
    private issue: IssueRepository;

    constructor(issueRepository: IssueRepository) {
        this.issue = issueRepository;
    }


    async createIssue(issueData: Issue, userId: string) {
        const issue: Issue = {
            ...issueData,
            created_by: { id: userId } as any,
        };
        return await this.issue.createIssue(issue);
    }



    async getAllIssues(opts: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
        labelId?: string;
    }): Promise<IssueWithLabels[]> {
        return await this.issue.findAll(opts);
    }

    async getIssueById(id: string): Promise<IssueDetailRow | null> {
        return await this.issue.findById(id);

    }

    async deleteIssue(issueId: string, userId: string): Promise<void> {
        const deleted = await this.issue.deleteById(issueId, userId);

        if(deleted ===0) {
            const err = new Error("Forbidden");
            err.name = "Forbidden";
            (err as any).status = 403;
            throw err;
        }
    }

    async addLabelsToIssue(
        issueId: string,
        labelIds: string[],
    ): Promise<void> {
        await this.issue.addLabels(issueId, labelIds);
    }

    async removeLabelsFromIssue(
        issueId: string,
        labelIds: string[],
    ): Promise<void> {
        await this.issue.removeLabels(issueId, labelIds);
    }

    async updateIssueStatus(
        id: string,
        status: string,
    ): Promise<void> {
        await this.issue.updateStatus(id, status);
    }

    async updateIssuePriority(
        id: string,
        priority: string,
    ): Promise<void> {
        await this.issue.updatePriority(id, priority);
    }

    async updateIssueDescription(
        id: string,
        description: string,
    ): Promise<void> {
        await this.issue.updateDescription(id, description);
    }

    async updateIssueTitle(id: string, title: string): Promise<void> {
        await this.issue.updateTitle(id, title);
    }
}
