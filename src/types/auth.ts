import { z } from "zod";

export const loginFormSchema = z.object({
  email: z.string().min(1, {
    message: "Campo obrigatório",
  }),
  password: z.string().min(1, {
    message: "Campo obrigatório",
  }),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof loginFormSchema>;
