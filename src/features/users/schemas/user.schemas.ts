import { z } from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المستخدم مطلوب")
    .max(255, "اسم المستخدم يجب ألا يتجاوز 255 حرفاً"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .max(20, "رقم الهاتف يجب ألا يتجاوز 20 خانة")
    .regex(/^[0-9+]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  email: z
    .string()
    .email("صيغة البريد الإلكتروني غير صحيحة")
    .max(255, "البريد الإلكتروني يجب ألا يتجاوز 255 حرفاً")
    .optional()
    .or(z.literal("")),
  department_id: z
    .string()
    .optional()
    .or(z.literal("")),
  is_active: z.boolean(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
