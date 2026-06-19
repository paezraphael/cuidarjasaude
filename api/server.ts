import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// In-memory data for the backend
import { SIM_HEALTH_UNITS, SIM_TRANSIT_LINES } from '../src/data.js';

// New Architecture Modules
import { LocationData, LocationSource } from './src/models/Location.js';
import { ConfidenceEngine } from './src/engines/ConfidenceEngine.js';
import { NearbySearchService, DatabaseHealthUnit } from './src/services/NearbySearchService.js';
import { H3Service } from './src/services/H3Service.js';

dotenv.config();

const app = express();
app.use(express.json());

// In-memory database for ATENDE bookings
const bookings: any[] = [];

// 1. Authentication
app.post('/api/auth/login', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 8) {
    return res.status(400).json({ error: 'Número de telefone inválido.' });
  }
  // No back-end validation simulated, generating standard token
  res.json({ success: true, token: `token-user-${phone}` });
});

// 2. Health Units Locator (Real data from OpenStreetMap)
const overpassCache = new Map<string, any>();

app.get('/api/health-units', async (req, res) => {
  const { lat, lng, accuracy, source } = req.query;
  
  if (lat && lng) {
    try {
      const locData: LocationData = {
        latitude: parseFloat(lat as string),
        longitude: parseFloat(lng as string),
        accuracyMeters: accuracy ? parseFloat(accuracy as string) : 50,
        timestamp: Date.now(),
        source: (source as LocationSource) || 'gps'
      };

      const bestLocation = ConfidenceEngine.calculateConfidence(locData);

      // Chave de cache arredondando coordenadas para 2 casas decimais (~1.1km)
      const cacheKey = `${bestLocation.latitude.toFixed(2)},${bestLocation.longitude.toFixed(2)}`;
      
      let data;
      if (overpassCache.has(cacheKey)) {
        data = overpassCache.get(cacheKey);
      } else {
        // Overpass API query for hospitals, clinics and pharmacies within 15km
        const overpassQuery = `[out:json];(node["amenity"~"hospital|clinic|pharmacy|doctors"](around:15000,${bestLocation.latitude},${bestLocation.longitude}););out 30;`;
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
        
        try {
          const response = await fetch(overpassUrl, { 
            headers: {
              'User-Agent': 'CuidarJaSaude/1.0',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(8000)
          });
          if (response.ok) {
            data = await response.json();
            // Salvar no cache para as próximas consultas
            if (data && data.elements) {
              overpassCache.set(cacheKey, data);
            }
          }
        } catch (err) {
          console.warn("Overpass API request failed/timed out, caindo pro fallback", err);
        }
      }

      if (data && data.elements && data.elements.length > 0) {
        // Mapear Overpass para nosso formato Mock de Banco de Dados com H3 (Simulando uma carga de DB)
        const mockDatabase: DatabaseHealthUnit[] = data.elements.map((el: any) => ({
          id: el.id.toString(),
          name: el.tags.name || 'Unidade de Atendimento',
              type: el.tags.amenity === 'pharmacy' ? 'Farmácia Popular' : 
                    (el.tags.amenity === 'hospital' ? 'Hospital SUS' : 'UBS/Clínica'),
              address: el.tags['addr:street'] ? `${el.tags['addr:street']}, ${el.tags['addr:housenumber'] || ''}` : 'Endereço Próximo',
              latitude: el.lat,
              longitude: el.lon,
              h3_res8: H3Service.generateIndexes({ latitude: el.lat, longitude: el.lon } as LocationData).res8
            }));

            // Passar para o NearbySearchService para cruzamento via H3 e ordenação por Haversine
            const nearbyResults = await NearbySearchService.search(bestLocation, mockDatabase);

            // Se encontrou no raio de 10km (definido no NearbySearchService)
            if (nearbyResults.length > 0) {
              const units = nearbyResults.map(r => ({
                id: r.id,
                name: r.name,
                type: r.type,
                address: r.address,
                distance: r.distanceMeters < 1000 ? `${r.distanceMeters} metros` : `${(r.distanceMeters / 1000).toFixed(1)} km`,
                accessibleEntrance: Math.random() > 0.5,
                adaptedToilets: Math.random() > 0.5,
                lat: r.latitude,
                lng: r.longitude
              }));
              
              return res.json(units);
            }
            }
          }

      // FALLBACK DINÂMICO
      // Se a API Overpass falhar ou não achar nada, vamos usar o SIM_HEALTH_UNITS mas com a distância REAL calculada!
      const mockDatabaseFallback: DatabaseHealthUnit[] = SIM_HEALTH_UNITS.map(su => ({
        id: su.id,
        name: su.name,
        type: su.type,
        address: su.address,
        latitude: su.lat,
        longitude: su.lng,
        h3_res8: H3Service.generateIndexes({ latitude: su.lat, longitude: su.lng } as LocationData).res8
      }));

      // Cruzamos usando nosso engine (ignorando limite de 10km pra garantir que retorne algo)
      let nearbyFallback = await NearbySearchService.search(bestLocation, mockDatabaseFallback);
      if (nearbyFallback.length === 0) {
        // Se o usuário estiver muito longe de SP (> 10km), o search exclui. Vamos calcular manualmente pra contornar o radar.
        const R = 6371;
        nearbyFallback = mockDatabaseFallback.map(unit => {
          const dLat = (unit.latitude - bestLocation.latitude) * Math.PI / 180;
          const dLon = (unit.longitude - bestLocation.longitude) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(bestLocation.latitude * Math.PI / 180) * Math.cos(unit.latitude * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          return { ...unit, distanceMeters: Math.round(R * c * 1000), matchLevel: 'fallback_math' };
        }).sort((a, b) => a.distanceMeters - b.distanceMeters);
      }

      const unitsFallback = nearbyFallback.map((r, i) => {
        const originalUnit = SIM_HEALTH_UNITS.find(su => su.id === r.id) || SIM_HEALTH_UNITS[i];
        return {
          id: r.id,
          name: r.name,
          type: r.type,
          address: r.address,
          distance: r.distanceMeters < 1000 ? `${r.distanceMeters} metros` : `${(r.distanceMeters / 1000).toFixed(1)} km`,
          accessibleEntrance: originalUnit.accessibleEntrance,
          adaptedToilets: originalUnit.adaptedToilets,
          lat: r.latitude,
          lng: r.longitude
        };
      });

      return res.json(unitsFallback);
    } catch (error) {
      console.error('API error:', error);
      return res.json(SIM_HEALTH_UNITS);
    }
  }
  
  res.json(SIM_HEALTH_UNITS);
});

let sptransCookies = '';

async function fetchWithTimeout(resource: string, options: RequestInit & { timeout?: number } = {}) {
  const { timeout = 5000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

async function authenticateSPTrans() {
  const token = process.env.SPTRANS_TOKEN;
  if (!token) return false;
  try {
    const res = await fetchWithTimeout(`https://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=${token}`, { 
      method: 'POST', 
      headers: { 'Content-Length': '0' },
      timeout: 5000
    });
    const text = await res.text();
    if (text === 'true') {
      const cookie = res.headers.get('set-cookie');
      if (cookie) sptransCookies = cookie;
      return true;
    }
  } catch(e) {
    console.error('SPTrans Auth Error', e);
  }
  return false;
}

// 3. Transit / Fleet Information
app.get('/api/transit-lines', async (req, res) => {
  const { search } = req.query; 
  
  if (!sptransCookies) {
    await authenticateSPTrans();
  }
  
  if (sptransCookies) {
    try {
      const termo = search ? search.toString() : '8000'; // default line search
      const linesRes = await fetchWithTimeout(`https://api.olhovivo.sptrans.com.br/v2.1/Linha/Buscar?termos=${termo}`, {
        headers: { 'Cookie': sptransCookies },
        timeout: 5000
      });
      const linesData = await linesRes.json();
      
      if (Array.isArray(linesData) && linesData.length > 0) {
        const mappedLines = linesData.slice(0, 5).map((l: any) => ({
          id: l.cl.toString(),
          code: `${l.lt}-${l.tl}`,
          name: `${l.tp1} - ${l.tp2}`,
          etaMinutes: Math.floor(Math.random() * 15) + 2, // Would use /Previsao for exact ETA
          accessibleRamp: true, 
          wheelchairSpaces: 1,
          sensoryGuided: false
        }));
        return res.json(mappedLines);
      }
    } catch (e) {
      console.error('SPTrans fetch error', e);
    }
  }

  // Fallback se API falhar ou não encontrar
  res.json(SIM_TRANSIT_LINES);
});

// 4. Booking System (ATENDE)
app.post('/api/bookings', (req, res) => {
  const { date, destination, purpose } = req.body;
  const booking = { 
    id: Date.now().toString(), 
    date, 
    destination, 
    purpose, 
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  res.json({ success: true, booking });
});

app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { status, driver } = req.body;
  const booking = bookings.find(b => b.id === id);
  if (booking) {
    if (status) booking.status = status;
    if (driver) booking.driver = driver;
    res.json({ success: true, booking });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// 5. Intelligent Voice Assistant (AI Integration)
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured.');
    }
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `Você é o assistente virtual do sistema Cuidar Já Saúde (para idosos). Responda de forma extremamente clara, empática e curta (máximo 2-3 linhas). O usuário perguntou: "${message}"` }],
        }
      ]
    });
    res.json({ reply: response.text });
  } catch (error) {
    console.warn('AI request failed, returning fallback:', error);
    // Fallback logic
    const msgLower = message.toLowerCase();
    if (msgLower.includes('médico') || msgLower.includes('ubs') || msgLower.includes('hospital')) {
      res.json({ reply: 'Identifiquei algumas unidades próximas de você. Gostaria que eu abrisse a navegação até o mais perto?' });
    } else if (msgLower.includes('van') || msgLower.includes('atende') || msgLower.includes('transporte')) {
      res.json({ reply: 'Para agendar o veículo adaptado gratuito da prefeitura, clique na aba "Solicitar Van ATENDE" no menu.' });
    } else {
      res.json({ reply: 'Desculpe, estou em modo offline. Posso te ajudar a encontrar hospitais ou agendar a van. O que prefere?' });
    }
  }
});

const PORT = process.env.PORT || 3001;

// Only listen locally, Vercel Serverless handles execution automatically
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Cuidar Já Saúde Backend API running on http://localhost:${PORT}`);
  });
}

export default app;
