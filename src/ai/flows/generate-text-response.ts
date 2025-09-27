'use server';
/**
 * @fileOverview Generates a text-based response for general farming queries.
 *
 * - generateTextResponse - A function that generates a text response.
 * - GenerateTextResponseInput - The input type for the generateTextResponse function.
 * - GenerateTextResponseOutput - The return type for the generateTextResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFarmingPlanTool} from '../tools/farming-plans';
import {getMarketPricesTool} from '../tools/market-prices';
import {getWeatherDataTool} from '../tools/weather';

const GenerateTextResponseInputSchema = z.object({
  query: z.string().describe('The user query about farming.'),
});
export type GenerateTextResponseInput = z.infer<
  typeof GenerateTextResponseInputSchema
>;

const GenerateTextResponseOutputSchema = z.object({
  response: z.string().describe("The AI's response to the user's query."),
});
export type GenerateTextResponseOutput = z.infer<
  typeof GenerateTextResponseOutputSchema
>;

export async function generateTextResponse(
  input: GenerateTextResponseInput
): Promise<GenerateTextResponseOutput> {
  return generateTextResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTextResponsePrompt',
  input: {schema: GenerateTextResponseInputSchema},
  output: {schema: GenerateTextResponseOutputSchema},
  tools: [getWeatherDataTool, getMarketPricesTool, getFarmingPlanTool],
  prompt: `You are an expert farming assistant named AgriOne AI. Your role is to provide helpful and accurate information about farming.

Detect the language of the user's query and respond in the same language.

You have access to a set of tools to answer specific questions:
- Use 'getWeatherData' for real-time weather inquiries.
- Use 'getMarketPrices' for questions about commodity prices in specific markets.
- Use 'getFarmingPlan' when a user asks for farming advice, a plan, or recommendations, but only if they provide their farm details, crop type, and current practices. Otherwise, ask for the missing information.
- For questions about government schemes, provide a general overview based on your knowledge.

User query: {{{query}}}

Provide a helpful and concise response. If your response is a list or has multiple steps, format each point with an HTML line break tag (<br />) to ensure proper spacing.`,
});

const generateTextResponseFlow = ai.defineFlow(
  {
    name: 'generateTextResponseFlow',
    inputSchema: GenerateTextResponseInputSchema,
    outputSchema: GenerateTextResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);
