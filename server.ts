import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { PRODUCTS } from './src/data/products';
import {
  recommendProductsFromCatalogue,
  sanitizeAIRecommendations,
} from './src/utils/catalogLogic';
import { AIBookFinderCriteria } from './src/types/catalog';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post('/api/ai-book-finder', async (req, res) => {
    const criteria: AIBookFinderCriteria = {
      recipient: req.body?.recipient || 'Parent for Child',
      ageGroup: req.body?.ageGroup || '4-6 Years',
      requirement: req.body?.requirement || 'Creative Coloring',
      formatPreference: req.body?.formatPreference || 'Either',
      quantity: Math.max(1, Number(req.body?.quantity) || 1),
      freeformNotes: req.body?.freeformNotes || '',
    };

    const apiKey = process.env.GEMINI_API_KEY;
    const hasConfiguredKey =
      Boolean(apiKey) &&
      apiKey !== 'MY_GEMINI_API_KEY' &&
      apiKey!.trim().length > 10;

    if (!hasConfiguredKey) {
      const fallback = recommendProductsFromCatalogue(criteria, PRODUCTS);
      return res.json(fallback);
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey!,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const catalogueContext = PRODUCTS.map((p) => ({
        productId: p.id,
        name: p.name,
        category: p.category,
        ageRange: p.ageRange,
        requirements: p.requirements,
        format: p.format,
        priceINR: p.price,
        bulkOrderAvailable: p.bulkOrderAvailable,
        minBulkQty: p.minBulkQty,
        bulkPricePerUnitINR: p.bulkPricePerUnit,
      }));

      const prompt = `Customer Book Finder Request:
- Who is the product for: ${criteria.recipient}
- Child's age: ${criteria.ageGroup}
- Learning or activity requirement: ${criteria.requirement}
- Format preference (Physical book or digital PDF): ${criteria.formatPreference}
- Required quantity: ${criteria.quantity}
- Additional customer notes: ${criteria.freeformNotes || 'None'}

Select up to 3 best-matching products strictly from the provided Kush Art Kids catalogue JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the official Kush Art Kids Book Finder Assistant.
CRITICAL RULES:
1. Recommend products ONLY from the exact Kush Art Kids catalogue provided below.
2. NEVER invent product IDs, product names, prices, availability, or links.
3. Return a warm, helpful 2-sentence assistantMessage for the parent/school and up to 3 recommendations referencing exact productId values from the catalogue.

VERIFIED KUSH ART KIDS CATALOGUE:
${JSON.stringify(catalogueContext, null, 2)}`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              assistantMessage: {
                type: Type.STRING,
                description: 'Friendly summary explaining why these verified Kush Art Kids books fit their needs.',
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    productId: {
                      type: Type.STRING,
                      description: 'Exact productId from the verified catalogue (e.g. KAK-COL-001).',
                    },
                    matchReason: {
                      type: Type.STRING,
                      description: 'Specific reason why this catalogue item fits their age, format, and quantity.',
                    },
                  },
                  required: ['productId', 'matchReason'],
                },
              },
            },
            required: ['assistantMessage', 'recommendations'],
          },
        },
      });

      const rawText = response.text || '{}';
      const parsed = JSON.parse(rawText);
      const verified = sanitizeAIRecommendations(
        parsed.assistantMessage,
        parsed.recommendations,
        criteria,
        PRODUCTS
      );
      return res.json(verified);
    } catch (error) {
      // Fallback to deterministic catalogue recommendation engine so user flow never breaks
      const fallback = recommendProductsFromCatalogue(criteria, PRODUCTS);
      return res.json(fallback);
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kush Art Kids server running on http://localhost:${PORT}`);
  });
}

startServer();
