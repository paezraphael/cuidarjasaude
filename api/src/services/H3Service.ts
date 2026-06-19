import { latLngToCell, cellToBoundary, cellArea } from 'h3-js';
import { LocationData } from '../models/Location.js';

export interface H3Indexes {
  res7: string;
  res8: string;
  res9: string;
  res10: string;
}

export class H3Service {
  /**
   * Converte uma coordenada de GPS ou IP altamente classificada em 
   * um conjunto de índices hexagonais da Uber em múltiplas resoluções.
   * 
   * - Res 7: ~5 km² (Ideal para agrupamento de bairros)
   * - Res 8: ~0.73 km² (Ideal para quarteirões centrais)
   * - Res 9: ~0.10 km² (Alta proximidade, a poucos quarteirões)
   * - Res 10: ~0.015 km² (Ultra proximidade, literalmente a rua da pessoa)
   */
  public static generateIndexes(location: LocationData): H3Indexes {
    const lat = location.latitude;
    const lng = location.longitude;

    return {
      res7: latLngToCell(lat, lng, 7),
      res8: latLngToCell(lat, lng, 8),
      res9: latLngToCell(lat, lng, 9),
      res10: latLngToCell(lat, lng, 10),
    };
  }

  /**
   * Retorna os pontos do polígono para desenhar no mapa ou criar geofences.
   */
  public static getBoundary(h3Index: string): [number, number][] {
    // h3-js returns [lat, lng], leaflet uses [lat, lng], 
    // depending on the version, we may need to normalize.
    return cellToBoundary(h3Index, true) as [number, number][];
  }
}
