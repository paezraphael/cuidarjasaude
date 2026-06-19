import { ITransitProvider } from './TransitTypes.js';
import { SptransAdapter } from './SptransAdapter.js';
import { UrbsAdapter } from './UrbsAdapter.js';
import { DataRioAdapter } from './DataRioAdapter.js';
import { GenericTransitAdapter } from './GenericTransitAdapter.js';

export class TransitRouter {
  public static getTransitProvider(lat: number, lng: number): ITransitProvider {
    // São Paulo (SPTrans)
    // Approximate bounding box for SP: lat -24.0 to -23.3, lng -46.8 to -46.3
    if (lat >= -24.0 && lat <= -23.3 && lng >= -46.8 && lng <= -46.3) {
      return new SptransAdapter();
    }

    // Rio de Janeiro (DataRio)
    // Approximate bounding box for RJ: lat -23.1 to -22.7, lng -43.8 to -43.1
    if (lat >= -23.1 && lat <= -22.7 && lng >= -43.8 && lng <= -43.1) {
      return new DataRioAdapter();
    }

    // Curitiba (URBS)
    // Approximate bounding box for Curitiba: lat -25.7 to -25.3, lng -49.4 to -49.1
    if (lat >= -25.7 && lat <= -25.3 && lng >= -49.4 && lng <= -49.1) {
      return new UrbsAdapter();
    }

    // Fallback for anywhere else
    return new GenericTransitAdapter();
  }
}
