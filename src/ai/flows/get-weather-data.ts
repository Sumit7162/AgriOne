'use server';
/**
 * @fileOverview A file that defines a Genkit flow for fetching weather data.
 *
 * - getWeatherData - A function that takes a location and returns weather data.
 * - GetWeatherDataInput - The input type for the getWeatherData function.
 * - GetWeatherDataOutput - The return type for the getWeatherData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getWeatherDataTool} from '../tools/weather';

const GetWeatherDataInputSchema = z.object({
  location: z.string().describe('The location to get the weather for.'),
});
export type GetWeatherDataInput = z.infer<typeof GetWeatherDataInputSchema>;

const GetWeatherDataOutputSchema = z.object({
  temperature: z.string().describe('The current temperature.'),
  wind: z.string().describe('The current wind speed.'),
  humidity: z.string().describe('The current humidity.'),
  precipitation: z
    .string()
    .describe('The current precipitation amount in millimeters.'),
});
export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async input => {
    return await getWeatherDataTool.run(input);
  }
);

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  return getWeatherDataFlow(input);
}
