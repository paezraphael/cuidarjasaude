import { ITransitProvider, TransitLine } from './TransitTypes.js';

export class UrbsAdapter implements ITransitProvider {
  async getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]> {
    // Mock data for Curitiba URBS
    return [
      {
        id: 'urbs-1',
        code: '203',
        name: 'SANTA CÂNDIDA / CAPÃO RASO',
        etaMinutes: Math.floor(Math.random() * 15) + 2,
        accessibleRamp: true,
        wheelchairSpaces: 2,
        sensoryGuided: true,
        provider: 'URBS (PR)'
      },
      {
        id: 'urbs-2',
        code: '502',
        name: 'CIRCULAR SUL (HORÁRIO)',
        etaMinutes: Math.floor(Math.random() * 15) + 2,
        accessibleRamp: true,
        wheelchairSpaces: 1,
        sensoryGuided: false,
        provider: 'URBS (PR)'
      }
    ];
  }
}
