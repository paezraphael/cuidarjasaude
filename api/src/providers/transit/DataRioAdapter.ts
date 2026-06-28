import { ITransitProvider, TransitLine } from './TransitTypes.js';

export class DataRioAdapter implements ITransitProvider {
  async getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]> {
    try {
      const overpassQuery = `[out:json];relation["route"="bus"](around:3000,${lat},${lng});out tags 15;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
      
      const response = await fetch(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'CuidarJaSaude/1.0' },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.elements && data.elements.length > 0) {
          const uniqueLines = Array.from(new Map(data.elements.map((el: any) => [el.tags.name, el])).values()) as any[];
          return uniqueLines.slice(0, 10).map((el: any) => ({
            id: el.id.toString(),
            code: el.tags.ref || el.tags.line || 'BRT/BUS',
            name: el.tags.name || el.tags.route_name || 'Linha DataRio',
            etaMinutes: 0, 
            accessibleRamp: el.tags.wheelchair !== 'no',
            wheelchairSpaces: el.tags.wheelchair === 'no' ? 0 : 2,
            sensoryGuided: el.tags.blind === 'yes',
            provider: 'DataRio (RJ)'
          }));
        }
      }
    } catch (e) {
      console.error('DataRioAdapter error', e);
    }
    return [];
  }
}
