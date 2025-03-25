import { CepService } from "@/services/cepService";
import { UseFormSetValue, UseFormSetError } from "react-hook-form";
import { ContactFormValues } from "../types/contact";

export const useCep = (
  setValue: UseFormSetValue<ContactFormValues>,
  setError: UseFormSetError<ContactFormValues>
) => {
  const handleCepChange = async (cep: string) => {
    try {
      const data = await CepService.fetchAddressByCep(cep);
      if (!data) {
        setError("cep", { message: "CEP não encontrado" });
        return;
      }

      setValue("endereco", data.logradouro);
      setValue("cidade", data.localidade);
      setValue("estado", data.uf);
      setValue("complemento", data.complemento || "");
    } catch (err) {
      setError("cep", { message: "Erro ao consultar CEP" });
    }
  };

  return { handleCepChange };
};
