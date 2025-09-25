'use server';
/**
 * @fileOverview A file that defines a Genkit flow for fetching commodity pricing data from the Fasal API.
 *
 * - getFasalPrice - A function that takes a market and returns commodity pricing data.
 * - GetFasalPriceInput - The input type for the getFasalPrice function.
 * - GetFasalPriceOutput - The return type for the getFasalPrice function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CommoditySchema = z.object({
  commodity: z.string().describe('The name of the commodity.'),
  min_price: z.number().describe('The minimum price of the commodity.'),
  max_price: z.number().describe('The maximum price of the commodity.'),
  modal_price: z.number().describe('The modal price of the commodity.'),
  unit: z.string().describe('The unit of measurement for the price (e.g., Quintal).'),
});
export type Commodity = z.infer<typeof CommoditySchema>;

const GetFasalPriceInputSchema = z.object({
  market: z
    .string()
    .describe(
      'The market to get the commodity prices for (e.g., MP_Bhopal).'
    ),
});
export type GetFasalPriceInput = z.infer<typeof GetFasalPriceInputSchema>;

const GetFasalPriceOutputSchema = z.object({
  commodities: z.array(CommoditySchema).describe('A list of commodities with their prices.'),
});
export type GetFasalPriceOutput = z.infer<typeof GetFasalPriceOutputSchema>;

const getFasalPriceTool = ai.defineTool(
  {
    name: 'getFasalPrice',
    description: 'Get commodity prices for a given market from the Fasal API.',
    inputSchema: GetFasalPriceInputSchema,
    outputSchema: GetFasalPriceOutputSchema,
  },
  async ({ market }) => {
    console.log(`Fetching commodity prices for ${market}...`);
    const apiKey = process.env.FASAL_API_KEY;

    if (!apiKey) {
      console.error('FASAL_API_KEY is not set.');
      throw new Error('FASAL_API_KEY is not configured.');
    }

    const response = await fetch(
      `https://api.fasal.co/v1/commodities/pricing?market=${market}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Fasal API Error: ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch data from Fasal API: ${response.statusText}`);
    }

    const data = await response.json();
    return { commodities: data };
  }
);

const getFasalPriceFlow = ai.defineFlow(
  {
    name: 'getFasalPriceFlow',
    inputSchema: GetFasalPriceInputSchema,
    outputSchema: GetFasalPriceOutputSchema,
  },
  async (input) => {
    // Directly call the tool logic instead of invoking an AI prompt.
    // This avoids the need for a Gemini API key for this specific feature.
    return await getFasalPriceTool.run(input);
  }
);

export async function getFasalPrice(
  input: GetFasalPriceInput
): Promise<GetFasalPriceOutput> {
  return getFasalPriceFlow(input);
}
