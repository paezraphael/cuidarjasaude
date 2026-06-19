export type LocationSource = 'gps' | 'user_share' | 'wifi' | 'cell_tower' | 'ip';

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracyMeters: number;    // Precisão estimada em metros
  timestamp: number;         // Quando foi capturada
  confidenceScore?: number;  // 0 a 100, preenchido pelo ConfidenceEngine
  source: LocationSource;    // Origem do dado
  asn?: string;              // Usado em IP
  city?: string;
  country?: string;
}
