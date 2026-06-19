import { useState, useEffect, useRef } from 'react';

export type GeoSource = 'gps_browser' | 'history_cache' | 'ip_fallback' | 'search';

export interface LocationState {
  latitude: number;
  longitude: number;
  accuracy: number;
  source: GeoSource;
  timestamp: number;
  confidence: number;
}

export function useLocationEngine() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLowAccuracy, setIsLowAccuracy] = useState<boolean>(false);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const watchIdRef = useRef<number | null>(null);

  // 3. Fallback: IP
  const fetchIpLocation = async () => {
    if (isManualMode) return;
    const startTime = performance.now();
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && data.latitude && data.longitude) {
        const payload: LocationState = {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 15000,
          source: 'ip_fallback',
          timestamp: Date.now(),
          confidence: 20
        };
        const duration = Math.round(performance.now() - startTime);
        console.log(`[Observability] Fonte: IP | Tempo: ${duration}ms | Status: SUCCESS`);
        setLocation(payload);
        setIsLowAccuracy(true);
      }
    } catch (e) {
      const duration = Math.round(performance.now() - startTime);
      console.error(`[Observability] ALERTA: Fonte: IP | Tempo: ${duration}ms | Status: ERROR`, e);
    }
  };

  // 1 & 2. Tentar GPS, se falhar tenta Cache, se falhar tenta IP
  const startWatching = () => {
    if (!navigator.geolocation) {
      setErrorMsg("Seu navegador não suporta GPS.");
      fetchIpLocation();
      return;
    }

    const startTime = performance.now();
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        // Ignora updates do GPS se o usuário definiu o endereço manualmente
        if (isManualMode) return;
        
        const accuracy = pos.coords.accuracy;
        const payload: LocationState = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: accuracy,
          source: 'gps_browser',
          timestamp: pos.timestamp,
          confidence: accuracy < 50 ? 98 : accuracy < 500 ? 70 : 40
        };

        const duration = Math.round(performance.now() - startTime);
        console.log(`[Observability] Fonte: GPS | Tempo: ${duration}ms | Accuracy: ${Math.round(accuracy)}m | Status: SUCCESS`);

        // Salva histórico local
        if (accuracy < 100) {
          localStorage.setItem('cuidar_ja_last_loc', JSON.stringify(payload));
        }

        setLocation(payload);
        setIsLowAccuracy(accuracy > 100);
        setErrorMsg(null);
      },
      (error) => {
        if (isManualMode) return;
        console.warn("GPS Permission Denied or Failed", error);
        setErrorMsg("Permissão de localização negada ou falhou.");
        
        // 2. Tenta Histórico
        const cached = localStorage.getItem('cuidar_ja_last_loc');
        if (cached) {
          try {
            const parsed = JSON.parse(cached) as LocationState;
            parsed.source = 'history_cache';
            setLocation(parsed);
            setIsLowAccuracy(parsed.accuracy > 100);
            return;
          } catch(e) {}
        }
        
        // 3. Fallback IP
        fetchIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    startWatching();
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isManualMode]); // Reinicia ou ajusta base no manual mode

  const manualOverride = (lat: number, lng: number) => {
    setIsManualMode(true);
    setLocation({
      latitude: lat,
      longitude: lng,
      accuracy: 50,
      source: 'search',
      timestamp: Date.now(),
      confidence: 90
    });
    setIsLowAccuracy(false);
  };

  const forceGpsRequest = () => {
    setIsManualMode(false);
    // Para e recomeça forçando o prompt
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    startWatching();
  };

  return {
    location,
    isLowAccuracy,
    errorMsg,
    forceGpsRequest,
    manualOverride
  };
}
