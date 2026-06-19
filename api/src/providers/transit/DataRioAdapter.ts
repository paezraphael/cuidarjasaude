import { ITransitProvider, TransitLine } from './TransitTypes.js';

export class DataRioAdapter implements ITransitProvider {
  async getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]> {
    // Mock data for DataRio (BRT/VLT)
    return [
      {
        id: 'rio-1',
        code: 'BRT',
        name: 'TRANSOLÍMPICA',
        etaMinutes: Math.floor(Math.random() * 15) + 2,
        accessibleRamp: true,
        wheelchairSpaces: 4,
        sensoryGuided: true,
        provider: 'DataRio (RJ)'
      },
      {
        id: 'rio-2',
        code: 'VLT',
        name: 'LINHA 1 - PRAIA FORMOSA',
        etaMinutes: Math.floor(Math.random() * 15) + 2,
        accessibleRamp: true,
        wheelchairSpaces: 2,
        sensoryGuided: true,
        provider: 'DataRio (RJ)'
      }
    ];
  }
}
