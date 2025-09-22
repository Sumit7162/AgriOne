'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing personalized farming advice.
 *
 * - getPersonalizedFarmingAdvice - A function that takes farm details, crop type, and current practices as input and returns AI-powered personalized recommendations for optimizing irrigation, fertilization, and pest control.
 * - PersonalizedFarmingAdviceInput - The input type for the getPersonalizedFarmingAdvice function.
 * - PersonalizedFarmingAdviceOutput - The return type for the getPersonalizedFarmingAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFarmingAdviceInputSchema = z.object({
  farmDetails: z
    .string()
    .describe('Detailed information about the farm, including size, location, and soil type.'),
  cropType: z.string().describe('The type of crop being cultivated.'),
  currentPractices: z
    .string()
    .describe(
      'Description of the current farming practices, including irrigation, fertilization, and pest control methods.'
    ),
});
export type PersonalizedFarmingAdviceInput = z.infer<
  typeof PersonalizedFarmingAdviceInputSchema
>;

const PersonalizedFarmingAdviceOutputSchema = z.object({
  irrigationRecommendations: z
    .string()
    .describe('Personalized recommendations for optimizing irrigation practices.'),
  fertilizationRecommendations: z
    .string()
    .describe('Personalized recommendations for optimizing fertilization practices.'),
  pestControlRecommendations: z
    .string()
    .describe('Personalized recommendations for optimizing pest control practices.'),
  expectedYieldIncrease: z
    .string()
    .describe('The estimated percentage increase in crop yield from following recommendations'),
  resourceWasteReduction: z
    .string()
    .describe('The estimated percentage reduction in resource waste from following recommendations'),
});
export type PersonalizedFarmingAdviceOutput = z.infer<
  typeof PersonalizedFarmingAdviceOutputSchema
>;

export async function getPersonalizedFarmingAdvice(
  input: PersonalizedFarmingAdviceInput
): Promise<PersonalizedFarmingAdviceOutput> {
  return personalizedFarmingAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedFarmingAdvicePrompt',
  input: {schema: PersonalizedFarmingAdviceInputSchema},
  output: {schema: PersonalizedFarmingAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided farm details, crop type, and current practices, provide personalized recommendations for optimizing irrigation, fertilization, and pest control to maximize crop yield and reduce resource waste.

Farm Details: {{{farmDetails}}}
Crop Type: {{{cropType}}}
Current Practices: {{{currentPractices}}}

Consider factors like soil type, climate, and common pests/diseases for the specified crop type. Also estimate the expected yield increase and resource waste reduction.

Format your response as follows:

Irrigation Recommendations: [Your irrigation recommendations]
Fertilization Recommendations: [Your fertilization recommendations]
Pest Control Recommendations: [Your pest control recommendations]
Expected Yield Increase: [Estimated percentage increase in crop yield]
Resource Waste Reduction: [Estimated percentage reduction in resource waste]`,
});

const personalizedFarmingAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedFarmingAdviceFlow',
    inputSchema: PersonalizedFarmingAdviceInputSchema,
    outputSchema: PersonalizedFarmingAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
