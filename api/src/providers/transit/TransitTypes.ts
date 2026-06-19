export interface TransitLine {
  id: string;
  code: string;
  name: string;
  etaMinutes: number;
  accessibleRamp: boolean;
  wheelchairSpaces: number;
  sensoryGuided: boolean;
  provider: string;
}

export interface ITransitProvider {
  getLines(lat: number, lng: number, term?: string): Promise<TransitLine[]>;
}
