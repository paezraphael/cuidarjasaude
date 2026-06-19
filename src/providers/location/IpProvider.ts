import { ILocationProvider, LocationData } from './GpsProvider';

export class IpProvider implements ILocationProvider {
  async getCurrentLocation(): Promise<LocationData> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error(`IP API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.latitude || !data.longitude) {
        throw new Error('Invalid data from IP API');
      }

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        // IP location is generally imprecise, so we assign a large accuracy value (e.g. 10000m)
        accuracy: 10000,
        timestamp: Date.now(),
        source: 'ip'
      };
    } catch (error) {
      console.error('IpProvider error:', error);
      throw error;
    }
  }
}
