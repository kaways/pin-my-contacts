import axios from 'axios';

export const GeocodeService = {
  geocodeAddress: async (address: string, apiKey: string) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );

      if (response.data.status === "OK") {
        return response.data.results[0].geometry.location;
      }
      throw new Error("Endereço não encontrado");
    } catch (error) {
      console.error("Erro ao geocodificar endereço:", error);
      throw error;
    }
  },
};
