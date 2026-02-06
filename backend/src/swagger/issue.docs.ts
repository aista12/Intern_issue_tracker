/**
 * @openapi
 * tags:
 *   - name: Issues
 *     description: Issue management
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Label:
 *       type: object
 *       required: [id, name, color]
 *       properties:
 *         id: { type: string, example: "8b9c2f7e-1111-2222-3333-444455556666" }
 *         name: { type: string, example: "bug" }
 *         color: { type: string, example: "#ff0000" }
 *
 *     IssueRow:
 *       type: object
 *       required: [issue_no, id, title, status, priority, created_by_id]
 *       properties:
 *         issue_no: { type: integer, example: 12 }
 *         id: { type: string, example: "f1b2c3d4-1111-2222-3333-444455556666" }
 *         title: { type: string, example: "Fix login crash" }
 *         description: { type: string, nullable: true, example: "Crashes on submit" }
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done, cancelled]
 *           example: todo
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *         created_by_id: { type: string, example: "a1a2a3a4-1111-2222-3333-444455556666" }
 *
 *     IssueWithLabels:
 *       allOf:
 *         - $ref: "#/components/schemas/IssueRow"
 *         - type: object
 *           required: [labels]
 *           properties:
 *             labels:
 *               type: array
 *               items: { $ref: "#/components/schemas/Label" }
 *
 *     IssueDetailRow:
 *       allOf:
 *         - $ref: "#/components/schemas/IssueWithLabels"
 *         - type: object
 *           required: [created_by_name, created_by_email]
 *           properties:
 *             created_by_name: { type: string, example: "Sav" }
 *             created_by_email: { type: string, example: "sav@mail.com" }
 *
 *     CreateIssueBody:
 *       type: object
 *       required: [title]
 *       properties:
 *         title: { type: string, example: "Fix login crash" }
 *         description: { type: string, nullable: true, example: "Crashes on submit" }
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done, cancelled]
 *           example: todo
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           example: medium
 *       description: |
 *         Request body is passed into service as issueData.
 *         created_by_id is taken from JWT (req.userId) and not provided by client.
 *
 *     LabelIdsBody:
 *       type: object
 *       required: [labelIds]
 *       properties:
 *         labelIds:
 *           type: array
 *           items: { type: string }
 *
 *     UpdateStatusBody:
 *       type: object
 *       required: [status]
 *       properties:
 *         status:
 *           type: string
 *           enum: [todo, in_progress, done, cancelled]
 *
 *     UpdatePriorityBody:
 *       type: object
 *       required: [priority]
 *       properties:
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *
 *     UpdateTitleBody:
 *       type: object
 *       required: [title]
 *       properties:
 *         title: { type: string, example: "New title" }
 *
 *     UpdateDescriptionBody:
 *       type: object
 *       required: [description]
 *       properties:
 *         description: { type: string, nullable: true, example: "New description" }
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message: { type: string, example: "Invalid pagination params" }
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
 *           schema: { $ref: "#/components/schemas/CreateIssueBody" }
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/IssueWithLabels" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues:
 *   get:
 *     summary: List issues (pagination + filters + search)
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
 *         schema: { type: string, enum: [todo, in_progress, done, cancelled] }
 *       - in: query
 *         name: search
 *         schema: { type: string, example: "login" }
 *       - in: query
 *         name: labelId
 *         schema: { type: string, example: "8b9c2f7e-1111-2222-3333-444455556666" }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/IssueWithLabels" }
 *       400:
 *         description: Invalid pagination params
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}:
 *   get:
 *     summary: Get issue by ID
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/IssueDetailRow" }
 *       404:
 *         description: Issue not found
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}:
 *   delete:
 *     summary: Delete issue (only owner)
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Forbidden (not owner)
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/labels:
 *   post:
 *     summary: Add labels to issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/LabelIdsBody" }
 *     responses:
 *       204:
 *         description: Labels added
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/labels:
 *   delete:
 *     summary: Remove labels from issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/LabelIdsBody" }
 *     responses:
 *       204:
 *         description: Labels removed
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/status:
 *   patch:
 *     summary: Update issue status
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdateStatusBody" }
 *     responses:
 *       204:
 *         description: Updated
 *       400:
 *         description: invalid status
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/priority:
 *   patch:
 *     summary: Update issue priority
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdatePriorityBody" }
 *     responses:
 *       204:
 *         description: Updated
 *       400:
 *         description: invalid priority
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/description:
 *   patch:
 *     summary: Update issue description
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdateDescriptionBody" }
 *     responses:
 *       204:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /issues/{id}/title:
 *   patch:
 *     summary: Update issue title
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/UpdateTitleBody" }
 *     responses:
 *       204:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 */

export {};
