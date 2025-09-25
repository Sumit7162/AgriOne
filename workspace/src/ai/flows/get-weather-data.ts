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
    description: 'Get the current weather for a location from Visual Crossing Weather.',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async ({ location }) => {
    const apiKey = process.env.VISUAL_CROSSING_API_KEY;
    if (!apiKey) {
      throw new Error('VISUAL_CROSSING_API_KEY is not configured.');
    }

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&contentType=json`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        // Visual Crossing returns error text directly, not JSON
        const errorText = await response.text();
        console.error('Visual Crossing API Error:', errorText);
        throw new Error(`Failed to fetch weather data: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();

      // Assuming we take the current day's data from the forecast
      const currentConditions = data?.days?.[0];

      if (!currentConditions) {
        throw new Error('Weather data is incomplete or in an unexpected format.');
      }

      return {
        temperature: `${currentConditions.temp?.toFixed(1) ?? 'N/A'}°C`,
        wind: `${currentConditions.windspeed?.toFixed(1) ?? 'N/A'} km/h`,
        humidity: `${currentConditions.humidity?.toFixed(1) ?? 'N/A'}%`,
        precipitation: `${currentConditions.precip ?? 0} mm`,
      };
    } catch (error) {
      console.error('Error fetching or parsing weather data:', error);
      // Providing a fallback for a better user experience on API failure
      return {
        temperature: 'N/A',
        wind: 'N/A',
        humidity: 'N/A',
        precipitation: 'N/A',
      };
    }
  }
);

const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async (input) => {
    return await getWeatherDataTool.run(input);
  }
);

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  return getWeatherDataFlow(input);
}
