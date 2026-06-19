import { LocationData } from '../models/Location.js';

export class IpProvider {
  /**
   * Resolve as coordenadas aproximadas de um endereço de IP IPv4 ou IPv6.
   */
  public static async getLocation(ipAddress: string): Promise<LocationData | null> {
    try {
      // Quando for no localhost, podemos não passar IP ou a API assume o IP público do servidor
      const url = ipAddress && ipAddress !== '127.0.0.1' && ipAddress !== '::1' 
        ? `https://ipapi.co/${ipAddress}/json/` 
        : `https://ipapi.co/json/`;

      const response = await fetch(url, { timeout: 4000 } as RequestInit);
      const data = await response.json();

      if (data && data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracyMeters: 15000, // Raio padrão de erro estimado do IP (15km)
          timestamp: Date.now(),
          source: 'ip',
          asn: data.org,
          city: data.city,
          country: data.country_name
        };
      }
      return null;
    } catch (error) {
      console.error('[IpProvider] Falha ao capturar localização via IP:', error);
      return null;
    }
  }
}
