import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .min(1, "اسم القسم مطلوب")
    .max(255, "اسم القسم يجب ألا يتجاوز 255 حرفاً"),
  description: z
    .string()
    .max(1000, "الوصف يجب ألا يتجاوز 1000 حرف")
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
