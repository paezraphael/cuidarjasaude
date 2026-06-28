import { ITransitProvider, TransitLine } from './TransitTypes.js';

export class GenericTransitAdapter implements ITransitProvider {
  async getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]> {
    try {
      const overpassQuery = `[out:json];relation["route"="bus"](around:2000,${lat},${lng});out tags 15;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'CuidarJaSaude/1.0' },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.elements && data.elements.length > 0) {
          // Remove duplicatas pelo nome
          const uniqueLines = Array.from(new Map(data.elements.map((el: any) => [el.tags.name, el])).values()) as any[];
          
          return uniqueLines.slice(0, 10).map((el: any) => ({
            id: el.id.toString(),
            code: el.tags.ref || el.tags.line || 'BUS',
            name: el.tags.name || el.tags.route_name || 'Linha Local',
            etaMinutes: 0, // OSM não tem tempo real
            accessibleRamp: el.tags.wheelchair !== 'no',
            wheelchairSpaces: el.tags.wheelchair === 'no' ? 0 : 1,
            sensoryGuided: el.tags.blind === 'yes',
            provider: el.tags.operator || el.tags.network || 'OpenStreetMap Transport'
          }));
        }
      }
    } catch (e) {
      console.error('GenericTransitAdapter error', e);
    }
    return [];
  }
}
