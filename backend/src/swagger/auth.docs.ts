/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     AuthUser:
 *       type: object
 *       required: [id, name, email]
 *       properties:
 *         id:
 *           type: string
 *           example: "a1a2a3a4-1111-2222-3333-444455556666"
 *         name:
 *           type: string
 *           example: "Sav"
 *         email:
 *           type: string
 *           example: "sav@mail.com"
 *
 *     AuthRegisterBody:
 *       type: object
 *       required: [name, email, password]
 *       properties:
 *         name:
 *           type: string
 *           example: "Sav"
 *         email:
 *           type: string
 *           example: "sav@mail.com"
 *         password:
 *           type: string
 *           example: "Password123!"
 *
 *     AuthLoginBody:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "sav@mail.com"
 *         password:
 *           type: string
 *           example: "Password123!"
 *
 *     AuthLoginResult:
 *       type: object
 *       required: [token, user]
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           $ref: "#/components/schemas/AuthUser"
 *
 *     AuthError:
 *       type: object
 *       properties:
 *         error:
 *           type: object
 *           required: [message]
 *           properties:
 *             message:
 *               type: string
 *               example: "email and password are required"
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthRegisterBody"
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthUser"
 *       400:
 *         description: Validation or registration error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthError"
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthLoginBody"
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthLoginResult"
 *       400:
 *         description: Validation or other auth error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthError"
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthError"
 */

export {};
