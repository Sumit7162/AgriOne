import { config } from 'dotenv';
config();

import '@/ai/flows/get-pest-disease-alerts.ts';
import '@/ai/flows/generate-crop-health-report.ts';
import '@/ai/flows/get-personalized-farming-advice.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/translate-text.ts';
