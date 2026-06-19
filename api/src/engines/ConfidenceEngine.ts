import { LocationData } from '../models/Location.js';

export class ConfidenceEngine {
  
  /**
   * Avalia uma LocationData bruta e atribui um confidenceScore (0 a 100)
   * baseado na sua fonte original e na acurácia em metros.
   */
  public static calculateConfidence(data: LocationData): LocationData {
    let score = 0;

    switch (data.source) {
      case 'gps':
        // GPS tem alta precisão se for menor que 50 metros
        if (data.accuracyMeters <= 15) score = 98;
        else if (data.accuracyMeters <= 50) score = 90;
        else if (data.accuracyMeters <= 100) score = 80;
        else score = 60; // Sinal de GPS fraco
        break;

      case 'user_share':
        // Se a pessoa digitou/clicou no mapa, assume-se altíssima confiança humana, 
        // mas com margem de dedo "gordo" no touch.
        score = 95; 
        break;

      case 'wifi':
        // Triangulação Wi-Fi (geralmente acertam o quarteirão)
        if (data.accuracyMeters <= 100) score = 85;
        else score = 70;
        break;

      case 'cell_tower':
        // Torres de telefonia celular cobrem áreas extensas
        if (data.accuracyMeters <= 1000) score = 60;
        else score = 40;
        break;

      case 'ip':
        // IP é sempre a pior métrica espacial, indicando muitas vezes o data center do provedor
        score = 20;
        break;

      default:
        score = 10;
        break;
    }

    // Penalidade por tempo: Se a localização foi capturada há mais de 10 minutos, o nível cai.
    const ageInMinutes = (Date.now() - data.timestamp) / 60000;
    if (ageInMinutes > 10) {
      score = Math.max(10, score - (Math.floor(ageInMinutes / 10) * 5)); // Perde 5 pontos a cada 10 min
    }

    return {
      ...data,
      confidenceScore: score
    };
  }

  /**
   * Recebe um array de leituras de diversos provedores simultâneos e devolve
   * estritamente a melhor leitura baseada no Confidence Score.
   */
  public static getBestLocation(locations: LocationData[]): LocationData | null {
    if (!locations || locations.length === 0) return null;

    // Calcula o score para todas as localizações que ainda não têm um
    const scoredLocations = locations.map(loc => 
      loc.confidenceScore !== undefined ? loc : this.calculateConfidence(loc)
    );

    // Ordena pelo maior score e retorna a primeira (melhor)
    scoredLocations.sort((a, b) => (b.confidenceScore || 0) - (a.confidenceScore || 0));

    return scoredLocations[0];
  }
}
