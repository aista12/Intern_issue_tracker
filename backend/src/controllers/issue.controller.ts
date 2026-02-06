import { NextFunction, Request, Response } from "express";
import { IssueService } from "../services/issue.service";
import { AuthRequest } from "../middlewares/auth.middleware";

type IdParams = { id: string };

export class IssueController {
    private issueService: IssueService;

    constructor(issueService: IssueService) {
        this.issueService = issueService;
    }

    createIssue = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try{
            const userId = req.userId!;
            const issueData = req.body;
    
            const issue = await this.issueService.createIssue(
                issueData,
                userId,
            );
            res.status(201).json(issue);

        } catch(err) {
            next(err);
        }
    };

    getAllIssues = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);
    
            if (
                !Number.isInteger(page) ||
                page < 1 ||
                !Number.isInteger(limit) ||
                limit < 1 ||
                limit > 10
            ) {
                return res.status(400).json({
                    error: { message: "Invalid pagination params" },
                });
            }
    
            const status = req.query.status as string | undefined;
            const search = req.query.search as string | undefined;
            const labelId = req.query.labelId as string | undefined;
    
    
            const issues = await this.issueService.getAllIssues({
                page,
                limit,
                status,
                search,
                labelId,
            });
            res.status(200).json(issues);
        }catch(err) {
            next(err);
        }
    };

    getIssueById = async (req: Request<IdParams>, res: Response, next: NextFunction) => {
        try{

            const { id } = req.params;
            const issue = await this.issueService.getIssueById(id);
    
            if (!issue) {
                return res
                    .status(404)
                    .json({ error: { message: "Issue not found" } });
            }
            res.status(200).json(issue);
        }catch(err) {
            next(err);
        }
    };

    deleteIssue = async (req: AuthRequest & Request<IdParams>, res: Response, next: NextFunction) => {
        try{
            const { id } = req.params;
            try{
                await this.issueService.deleteIssue(id, req.userId!);
                return res.status(204).send();
            } catch(e: any) {
                const status = e?.status ?? 500;
                const message = e?.message ?? "Internal error";
                return res.status(status).json({ error: { message } });
            }
        } catch(err) {
            next(err);
        }
       
    };

    addLabelsToIssue = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params; //this is issueId
            const labelIds: string[] = req.body.labelIds;

            await this.issueService.addLabelsToIssue(id, labelIds);
            return res.status(204).send();
        } catch(err) {
            next(err);
        }
    };

    removeLabelsFromIssue = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params; //this is issueId
            const labelIds: string[] = req.body.labelIds;

            await this.issueService.removeLabelsFromIssue(id, labelIds);
            return res.status(204).send();
        } catch(err) {
            next(err);
        }
    };

    updateIssueStatus = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
        const { id } = req.params;
        const { status } = req.body;

        const allowed = [
            "todo",
            "in_progress",
            "done",
            "cancelled",
        ] as const;
        if (
            typeof status !== "string" ||
            !allowed.includes(status as any)
        ) {
            return res
                .status(400)
                .json({ error: { message: "invalid status" } });
        }

        await this.issueService.updateIssueStatus(id, status);
        return res.status(204).send();
        } catch(err) {
            next(err);
        }
    };

    updateIssuePriority = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const { priority } = req.body;

            const allowed = ["low", "medium", "high"] as const;
            if (
                typeof priority !== "string" ||
                !allowed.includes(priority as any)
            ) {
                return res
                    .status(400)
                    .json({ error: { message: "invalid priority" } });
            }

            await this.issueService.updateIssuePriority(id, priority);
            return res.status(204).send();
        } catch(err) {
            next(err);}
    }; 

    updateIssueDescription = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const { description } = req.body;

        await this.issueService.updateIssueDescription(
            id,
            description,
        );
        return res.status(204).send();
        } catch(err) {
            next(err);
        }
    };

    updateIssueTitle = async (
        req: Request<IdParams>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { id } = req.params;
            const { title } = req.body;
        await this.issueService.updateIssueTitle(id, title);
        return res.status(204).send();
    } catch(err) {
        next(err);
    }
  }
}
