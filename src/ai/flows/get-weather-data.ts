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
  precipitation: z.string().describe('The current precipitation chance.'),
});
export type GetWeatherDataOutput = z.infer<typeof GetWeatherDataOutputSchema>;

const getWeatherDataTool = ai.defineTool(
  {
    name: 'getWeatherData',
    description: 'Get the current weather for a location.',
    inputSchema: GetWeatherDataInputSchema,
    outputSchema: GetWeatherDataOutputSchema,
  },
  async ({ location }) => {
    // In a real application, you would fetch this data from a weather API.
    // For this prototype, we'll return realistic, but simulated data.
    console.log(`Fetching weather for ${location}...`);
    return {
      temperature: `${Math.floor(Math.random() * 15) + 20}°C`,
      wind: `${Math.floor(Math.random() * 10) + 5} km/h`,
      humidity: `${Math.floor(Math.random() * 30) + 60}%`,
      precipitation: `${Math.floor(Math.random() * 50)}%`,
    };
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
    const { output } = await prompt(input);
    return output!;
  }
);

export async function getWeatherData(
  input: GetWeatherDataInput
): Promise<GetWeatherDataOutput> {
  return getWeatherDataFlow(input);
}
