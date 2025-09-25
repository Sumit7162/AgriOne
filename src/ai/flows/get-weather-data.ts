'use server';
/**
 * @fileOverview A file that defines a Genkit flow for fetching weather data using Google AI.
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
  temperature: z.string().describe('The current temperature in Celsius.'),
  wind: z.string().describe('The current wind speed in km/h.'),
  humidity: z.string().describe('The current humidity percentage.'),
  precipitation: z.string().describe('The current precipitation amount in millimeters.'),
});
export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

const prompt = ai.definePrompt({
    name: 'getWeatherPrompt',
    input: { schema: GetWeatherDataInputSchema },
    output: { schema: GetWeatherDataOutputSchema },
    prompt: `You are a weather assistant. Provide the current weather for the following location: {{{location}}}. Return the temperature in Celsius, wind speed in km/h, humidity as a percentage, and precipitation in mm.`
});


const getWeatherDataFlow = ai.defineFlow(
  {
    name: 'getWeatherDataFlow',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
        throw new Error("Failed to get weather data from AI.");
    }
    return output;
  }
);

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  return getWeatherDataFlow(input);
}
