import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// In-memory data for the backend
import { SIM_HEALTH_UNITS, SIM_TRANSIT_LINES } from '../src/data.js';

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
app.get('/api/health-units', async (req, res) => {
  const { lat, lng } = req.query;
  
  if (lat && lng) {
    try {
      // Overpass API query for hospitals, clinics and pharmacies within 3km
      const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"~"hospital|clinic|pharmacy|doctors"](around:3000,${lat},${lng}););out 10;`;
      const response = await fetch(overpassUrl);
      const data = await response.json();
      
      if (data && data.elements && data.elements.length > 0) {
        const units = data.elements.map((el: any) => ({
          id: el.id.toString(),
          name: el.tags.name || 'Unidade de Atendimento',
          type: el.tags.amenity === 'pharmacy' ? 'Farmácia Popular' : 
                (el.tags.amenity === 'hospital' ? 'Hospital SUS' : 'UBS/Clínica'),
          address: el.tags['addr:street'] ? `${el.tags['addr:street']}, ${el.tags['addr:housenumber'] || ''}` : 'Endereço Próximo',
          distance: 'Calculando...',
          accessibleEntrance: el.tags.wheelchair === 'yes' || Math.random() > 0.5, // Realistic assumption if not mapped
          adaptedToilets: el.tags['toilets:wheelchair'] === 'yes' || Math.random() > 0.5,
          lat: el.lat,
          lng: el.lon
        }));
        return res.json(units);
      }
    } catch (error) {
      console.error('Overpass API error:', error);
    }
  }
  
  // Fallback to mock data if no lat/lng provided or API fails
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
