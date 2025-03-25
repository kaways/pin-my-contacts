import { GeocodeService } from "@/services/geocodeService";
import { Contact } from "../types/contact";

export const useGeocode = (apiKey: string) => {
  const geocodeContactAddress = async (contact: Contact) => {
    const address = `${contact.endereco}, ${contact.numero}, ${contact.cidade}, ${contact.estado}`;
    const location = await GeocodeService.geocodeAddress(address, apiKey);
    return {
      ...contact,
      latitude: location.lat,
      longitude: location.lng,
    };
  };

  return { geocodeContactAddress };
};
