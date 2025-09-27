'use server';
/**
 * @fileOverview A tool for fetching real-time weather data.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherDataInputSchema = z.object({
  location: z.string().describe('The city and state, e.g. San Francisco, CA'),
});

const WeatherDataOutputSchema = z.object({
  temperature: z.string(),
  wind: z.string(),
  humidity: z.string(),
  precipitation: z.string(),
});

export const getWeatherDataTool = ai.defineTool(
  {
    name: 'getWeatherData',
    description: 'Get the current weather for a given location.',
    inputSchema: WeatherDataInputSchema,
    outputSchema: WeatherDataOutputSchema,
  },
  async ({location}) => {
    console.log(`Fetching weather for ${location}...`);
    // In a real app, you would call a weather API here.
    // For this prototype, we'll return mock data.
    const temp = (Math.random() * 20 + 10).toFixed(1);
    const wind = (Math.random() * 15 + 5).toFixed(1);
    const humidity = (Math.random() * 50 + 40).toFixed(1);
    const precip = (Math.random() * 5).toFixed(1);

    return {
      temperature: `${temp}°C`,
      wind: `${wind} km/h`,
      humidity: `${humidity}%`,
      precipitation: `${precip} mm`,
    };
  }
);
