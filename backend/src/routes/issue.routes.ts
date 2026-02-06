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


/**
 * @openapi
 * /issues:
 *   get:
 *     summary: List issues (pagination + filters)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, example: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, example: 10 }
 *       - in: query
 *         name: status
 *         schema: { type: string, example: "todo" }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "login" }
 *       - in: query
 *         name: labelId
 *         schema: { type: string, example: "uuid-here" }
 *     responses:
 *       200:
 *         description: Issues list
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues:
 *   post:
 *     summary: Create issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string, example: "Fix login bug" }
 *               description: { type: string, nullable: true, example: "Crashes on submit" }
 *               priority: { type: string, example: "high" }
 *               status: { type: string, example: "todo" }
 *               labelIds:
 *                 type: array
 *                 items: { type: string }
 *     responses:
 *       201:
 *         description: Created issue
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

 