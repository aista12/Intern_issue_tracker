/**
 * @openapi
 * tags:
 *   - name: Labels
 *     description: Label management
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
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message: { type: string, example: "Invalid name" }
 *
 *     DeleteLabelConflict:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "cant delete this label, it is used in some issues"
 *             used:
 *               type: integer
 *               example: 3
 */

/**
 * @openapi
 * /labels:
 *   get:
 *     summary: Get all labels
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: "#/components/schemas/Label" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /labels:
 *   post:
 *     summary: Create label
 *     tags: [Labels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, color]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 15
 *                 example: "bug"
 *               color:
 *                 type: string
 *                 pattern: "^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$"
 *                 example: "#ff0000"
 *     responses:
 *       200:
 *         description: Created (your controller returns 200)
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/Label" }
 *       400:
 *         description: Invalid name or color
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       401:
 *         description: Unauthorized
 */

/**
 * @openapi
 * /labels/{id}:
 *   delete:
 *     summary: Delete label
 *     tags: [Labels]
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
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Cannot delete label because it is used in some issues
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/DeleteLabelConflict" }
 *       500:
 *         description: Internal error
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/DeleteLabelConflict" }
 */

export {};
