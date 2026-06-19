import { ITransitProvider, TransitLine } from './TransitTypes.js';

export class GenericTransitAdapter implements ITransitProvider {
  async getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]> {
    return [
      {
        id: 'gen-1',
        code: '101',
        name: 'LINHA MUNICIPAL (SIMULADA)',
        etaMinutes: Math.floor(Math.random() * 15) + 2,
        accessibleRamp: true,
        wheelchairSpaces: 1,
        sensoryGuided: false,
        provider: 'Sistema de Trânsito Local'
      }
    ];
  }
}
