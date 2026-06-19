import { LocationData } from '../models/Location.js';

export interface LocationHistoryRecord extends LocationData {
  userId: string;
  id: string;
  h3_res8?: string;
  createdAt: number;
}

export class LocationHistoryRepository {
  private static history: LocationHistoryRecord[] = [];

  public static async save(userId: string, location: LocationData, h3_res8?: string): Promise<LocationHistoryRecord> {
    const record: LocationHistoryRecord = {
      ...location,
      userId,
      id: Date.now().toString(),
      h3_res8,
      createdAt: Date.now()
    };
    
    this.history.push(record);
    return record;
  }

  public static async getUserHistory(userId: string, limit: number = 50): Promise<LocationHistoryRecord[]> {
    return this.history
      .filter(record => record.userId === userId)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  }

  public static async getLastHighConfidenceLocation(userId: string): Promise<LocationHistoryRecord | null> {
    const records = await this.getUserHistory(userId);
    // Find the last location where confidence score > 70 or accuracy < 100m
    const highConf = records.find(r => (r.confidenceScore && r.confidenceScore > 70) || r.accuracyMeters < 100);
    return highConf || null;
  }
}
