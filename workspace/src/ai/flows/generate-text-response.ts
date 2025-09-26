'use server';
/**
 * @fileOverview Generates a text-based response for general farming queries.
 *
 * - generateTextResponse - A function that generates a text response.
 * - GenerateTextResponseInput - The input type for the generateTextResponse function.
 * - GenerateTextResponseOutput - The return type for the generateTextResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

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
  input: { schema: GenerateTextResponseInputSchema },
  output: { schema: GenerateTextResponseOutputSchema },
  prompt: `You are an expert farming assistant. Your role is to provide helpful and accurate information about farming.

Detect the language of the user's query and respond in the same language.

User query: {{{query}}}

Provide a helpful response. If your response is a list or has multiple steps, format each point with an HTML line break tag (<br />) to ensure proper spacing.`,
});

const generateTextResponseFlow = ai.defineFlow(
  {
    name: 'generateTextResponseFlow',
    inputSchema: GenerateTextResponseInputSchema,
    outputSchema: GenerateTextResponseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a response.');
    }
    return output;
  }
);
