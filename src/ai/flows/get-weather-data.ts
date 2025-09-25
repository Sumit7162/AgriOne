'use server';
/**
 * @fileOverview A file that defines a Genkit flow for fetching weather data.
 *
 * - getWeatherData - A function that takes a location and returns weather data.
 * - GetWeatherDataInput - The input type for the getWeatherData function.
 * - GetWeatherDataOutput - The return type for the getWeatherData function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetWeatherDataInputSchema = z.object({
  location: z.string().describe('The location to get the weather for.'),
});
export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const GetWeatherDataOutputSchema = z.object({
  temperature: z.string().describe('The current temperature.'),
  wind: z.string().describe('The current wind speed.'),
  humidity: z.string().describe('The current humidity.'),
  precipitation: z.string().describe('The current precipitation amount in millimeters.'),
});
export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

const getWeatherDataTool = ai.defineTool(
  {
    name: 'getWeatherData',
    description: 'Get the current weather for a location from OpenWeatherMap.',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async ({ location }) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY is not configured.');
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather data: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.cod !== 200) {
        throw new Error(data.message || 'An unknown error occurred with the weather API.');
      }
      
      const windSpeedKph = data.wind?.speed ? (data.wind.speed * 3.6).toFixed(1) : 'N/A';
      const precipitationMm = data.rain?.['1h'] || 0;

      return {
        temperature: `${data.main?.temp?.toFixed(1) ?? 'N/A'}°C`,
        wind: `${windSpeedKph} km/h`,
        humidity: `${data.main?.humidity ?? 'N/A'}%`,
        precipitation: `${precipitationMm} mm`,
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Could not retrieve weather information.');
    }
  }
);

const prompt = ai.definePrompt({
  name: 'weatherDataPrompt',
  input: { schema: GetWeatherDataInputSchema },
  output: { schema: GetWeatherDataOutputSchema },
  tools: [getWeatherDataTool],
  prompt: `Get the weather for {{location}}.`,
});

const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async (input) => {
    // Directly call the tool logic instead of invoking an AI prompt.
    return await getWeatherDataTool.run(input);
  }
);

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  return getWeatherDataFlow(input);
}
