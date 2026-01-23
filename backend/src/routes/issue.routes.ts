import { Router } from "express";
import { IssueController } from "../controllers/issue.controller";
import { IssueRepository } from "../repositories/issue.repository";
import { IssueService } from "../services/issue.service";
import { requireAuth } from "../middlewares/auth.middleware";

const router =Router()


const issueRepository = new IssueRepository();
const issueService = new IssueService(issueRepository);
const issueController = new IssueController(issueService);

router.post("/", issueController.createIssue);
router.get("/", issueController.getAllIssues);
router.get("/:id", issueController.getIssueById);
router.delete("/:id", issueController.deleteIssue);
router.post("/:id/labels", issueController.addLabelsToIssue);
router.delete("/:id/labels", requireAuth, issueController.removeLabelsFromIssue);
router.patch("/:id/status", issueController.updateIssueStatus);
router.patch("/:id/priority", issueController.updateIssuePriority);
router.patch("/:id/description", issueController.updateIssueDescription);
router.patch("/:id/title", issueController.updateIssueTitle);



export default router;