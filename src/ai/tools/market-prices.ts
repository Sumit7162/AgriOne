'use server';
/**
 * @fileOverview A tool for fetching commodity market prices.
 */

import {getFasalPrice} from '@/ai/flows/get-fasal-price';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketPriceInputSchema = z.object({
  market: z
    .string()
    .describe('The market to get commodity prices for (e.g., MP_Bhopal).'),
});

export const getMarketPricesTool = ai.defineTool(
  {
    name: 'getMarketPrices',
    description:
      'Get the latest commodity prices for a specific agricultural market.',
    inputSchema: MarketPriceInputSchema,
    outputSchema: z.string().describe('A summary of the commodity prices.'),
  },
  async ({market}) => {
    try {
      const result = await getFasalPrice({market});
      if (!result.commodities || result.commodities.length === 0) {
        return `No commodity data found for ${market}. Please try another market.`;
      }
      const summary = result.commodities
        .slice(0, 5) // Limit to top 5 for brevity
        .map(
          c =>
            `${c.commodity}: Min ₹${c.min_price}, Max ₹${c.max_price}, Modal ₹${c.modal_price}`
        )
        .join('; ');
      return `Prices for ${market}: ${summary}... and more.`;
    } catch (error) {
      console.error(error);
      return `Sorry, I couldn't fetch the prices for ${market}. Please ensure the market name is correct.`;
    }
  }
);
