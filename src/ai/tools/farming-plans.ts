'use server';
/**
 * @fileOverview A tool for generating personalized farming plans.
 */

import {getPersonalizedFarmingAdvice} from '@/ai/flows/get-personalized-farming-advice';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FarmingPlanInputSchema = z.object({
  farmDetails: z
    .string()
    .describe(
      'Detailed information about the farm, including size, location, and soil type.'
    ),
  cropType: z.string().describe('The type of crop being cultivated.'),
  currentPractices: z
    .string()
    .describe(
      'Description of the current farming practices, including irrigation, fertilization, and pest control methods.'
    ),
});

export const getFarmingPlanTool = ai.defineTool(
  {
    name: 'getFarmingPlan',
    description:
      'Generates a personalized farming plan with recommendations for irrigation, fertilization, and pest control.',
    inputSchema: FarmingPlanInputSchema,
    outputSchema: z
      .string()
      .describe(
        'A summarized farming plan. Do not just repeat the recommendations.'
      ),
  },
  async input => {
    try {
      const advice = await getPersonalizedFarmingAdvice(input);
      return `Based on your details, here is a summary of your farming plan:
- **Irrigation**: ${advice.irrigationRecommendations.substring(0, 100)}...
- **Fertilization**: ${advice.fertilizationRecommendations.substring(0, 100)}...
- **Pest Control**: ${advice.pestControlRecommendations.substring(0, 100)}...
This plan could increase your yield by ${advice.expectedYieldIncrease} and reduce waste by ${advice.resourceWasteReduction}.`;
    } catch (error) {
      console.error(error);
      return 'Sorry, I was unable to generate a farming plan with the details provided. Please try again.';
    }
  }
);
