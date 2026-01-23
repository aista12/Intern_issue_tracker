import {z} from "zod";

export const createLabelSchema = z.object({
    name: z.string().min(1).max(15),
    color: z.string().regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/),
});




export type CreateLabelSchema = z.infer<typeof createLabelSchema>;
