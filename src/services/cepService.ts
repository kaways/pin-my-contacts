import axios from 'axios';

export const CepService = {
  fetchAddressByCep: async (cep: string) => {
    try {
      const cepNumerico = cep.replace(/\D/g, "");
      if (cepNumerico.length !== 8) return null;

      const response = await axios.get(
        `https://viacep.com.br/ws/${cepNumerico}/json/`
      );
      return response.data.erro ? null : response.data;
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
      return null;
    }
  },
};
