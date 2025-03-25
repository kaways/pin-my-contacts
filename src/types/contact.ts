import { z } from "zod";

export interface Contact {
  nome: string;
  cpf: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  complemento?: string;
  latitude?: string;
  longitude?: string;
}

export const contactFormSchema = z.object({
  nome: z.string().min(1, { message: "Campo obrigatório" }),
  cpf: z.string().min(1, { message: "Campo obrigatório" }),
  telefone: z.string().min(1, { message: "Campo obrigatório" }),
  cep: z.string().min(1, { message: "Campo obrigatório" }),
  endereco: z.string().min(1, { message: "Campo obrigatório" }),
  numero: z.string().min(1, { message: "Campo obrigatório" }),
  cidade: z.string().min(1, { message: "Campo obrigatório" }),
  estado: z.string().min(1, { message: "Campo obrigatório" }),
  complemento: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
