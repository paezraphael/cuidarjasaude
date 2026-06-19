import { LocationData } from '../models/Location.js';
import { H3Service, H3Indexes } from './H3Service.js';

// Representação de uma Unidade de Saúde no Banco de Dados
export interface DatabaseHealthUnit {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  h3_res8: string; // O banco guardaria a localização da clínica pré-calculada no nível 8
}

export interface NearbyResult extends DatabaseHealthUnit {
  distanceMeters: number;
  matchLevel: string; // Informa se foi achado no raio H3 ou expandido
}

export class NearbySearchService {
  /**
   * Fórmula de Haversine para cálculo ultrarrápido da curvatura da Terra em memória.
   */
  private static calculateHaversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return Math.round(R * c * 1000); // Retorna em metros
  }

  /**
   * Busca as unidades de saúde utilizando o conceito de interseção espacial
   * através dos índices H3 (simulando uma query rápida em um banco relacional).
   */
  public static async search(userLocation: LocationData, mockDatabase: DatabaseHealthUnit[]): Promise<NearbyResult[]> {
    // Passo 1: Converter a posição exata do usuário para as malhas H3
    const userH3: H3Indexes = H3Service.generateIndexes(userLocation);

    // Passo 2 (Fase de Banco de Dados): Select ultrarrápido indexado O(1) pelas células vizinhas
    // Em produção seria: SELECT * FROM health_units WHERE h3_res8 IN (userH3.res8, vizinhos_do_anel_k1)
    // Aqui simularemos pegando uma janela maior e cruzando:
    const results: NearbyResult[] = [];

    for (const unit of mockDatabase) {
      // Cruzamento em nível 8 (Mesmo bairro)
      let matchLevel = 'outside';
      if (unit.h3_res8 === userH3.res8) {
        matchLevel = 'h3_res8_exact';
      }

      // Calcula a distância física exata em metros (Haversine)
      const distance = this.calculateHaversine(
        userLocation.latitude, userLocation.longitude,
        unit.latitude, unit.longitude
      );

      // Limita o radar de abrangência para 10.000 metros (10 km) do paciente
      if (distance <= 10000) {
        results.push({
          ...unit,
          distanceMeters: distance,
          matchLevel: matchLevel === 'outside' && distance <= 2000 ? 'h3_kring_expanded' : matchLevel
        });
      }
    }

    // Passo 3: Ordenação física milimétrica da mais próxima para a mais longe.
    results.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return results;
  }
}
