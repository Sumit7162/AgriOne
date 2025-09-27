import {config} from 'dotenv';
config();

import '@/ai/flows/get-pest-disease-alerts.ts';
import '@/ai/flows/generate-crop-health-report.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/get-weather-data.ts';
import '@/ai/flows/get-fasal-price.ts';
import '@/ai/flows/generate-text-response.ts';
import '@/ai/tools/weather.ts';
import '@/ai/tools/market-prices.ts';
import '@/ai/tools/farming-plans.ts';
