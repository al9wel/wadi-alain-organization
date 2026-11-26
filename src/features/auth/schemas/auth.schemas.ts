import * as z from "zod";

/**
 * Login validation schema:
 * Strictly accepts the user's existing credentials without artificial complexity constraints.
 */
export const loginSchema = z.object({
  user_name: z
    .string()
    .min(1, "يرجى إدخال اسم المستخدم أو رقم الهاتف")
    .max(255, "اسم المستخدم يجب ألا يتجاوز 255 حرفاً"),
  password: z
    .string()
    .min(1, "يرجى إدخال كلمة المرور"),
  rememberMe: z.boolean(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Change / New password validation schema:
 * Following the system policy: ONLY minimum length of 8 characters is required.
 * Any combination of letters, numbers, or symbols is fully accepted.
 */
export const changePasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, "البريد الإلكتروني مطلوب لإكمال إعداد الحساب")
      .email("صيغة البريد الإلكتروني غير صحيحة")
      .max(255, "البريد الإلكتروني يجب ألا يتجاوز 255 حرفاً"),
    current_password: z
      .string()
      .min(1, "يرجى إدخال كلمة المرور الحالية أو المؤقتة"),
    new_password: z
      .string()
      .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف"),
    new_password_confirmation: z
      .string()
      .min(1, "يرجى تأكيد كلمة المرور الجديدة"),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["new_password_confirmation"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
