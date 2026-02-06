import { z } from "zod";

export const emailSchema = z.email("Enter a valid email");
export const passwordSchema = z
  .string()
  .min(8, "min 8 characters")
  .max(72, "too long")
  .regex(/[A-Z]/, "Add 1 uppercase letter")
  .regex(/[0-9]/, "Add 1 number");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
});

export type LoginValues = z.infer<typeof loginSchema>;


export const registerSchema = z
  .object({
    name: z.string().min(2, "Min 2 characters").max(40, "Max 40"),
    email: emailSchema,
    password: passwordSchema,
  })
export type RegisterValues = z.infer<typeof registerSchema>;

export const issueSchema = z.object({
  title: z.string().min(3, "Min 3 characters").max(80, "Max 80"),
  description: z.string().max(2000, "Max 2000").optional().or(z.literal("")),
  status: z.enum(["todo", "in_progress", "done", "cancelled"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  labelIds: z.array(z.uuid("Invalid label id")).default([]),
});
export type IssueValues = z.infer<typeof issueSchema>;

export const labelSchema = z.object({
  name: z.string().min(1, "Name required").max(15, "Max 15"),
  color: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Use hex like #FFAA00"),
});
export type LabelValues = z.infer<typeof labelSchema>;
