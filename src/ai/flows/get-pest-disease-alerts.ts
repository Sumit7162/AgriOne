'use server';
/**
 * @fileOverview AI agent that provides predictive alerts and solutions about potential pest and disease outbreaks based on hyperlocal weather data and climate change projections.
 *
 * - getPestDiseaseAlerts - A function that retrieves predictive pest and disease alerts with solutions.
 * - GetPestDiseaseAlertsInput - The input type for the getPestDiseaseAlerts function.
 * - GetPestDiseaseAlertsOutput - The return type for the getPestDiseaseAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetPestDiseaseAlertsInputSchema = z.object({
  location: z
    .string()
    .describe('The geographical location for which to retrieve alerts.'),
  cropType: z.string().describe('The type of crop being grown.'),
});
export type GetPestDiseaseAlertsInput = z.infer<typeof GetPestDiseaseAlertsInputSchema>;

const AlertWithSolutionSchema = z.object({
    alert: z.string().describe('A predictive pest or disease alert.'),
    solution: z.string().describe('A recommended solution or preventive measure for the alert.'),
});

const GetPestDiseaseAlertsOutputSchema = z.object({
  alerts: z
    .array(AlertWithSolutionSchema)
    .describe('A list of predictive pest and disease alerts, each with a corresponding solution.'),
});
export type GetPestDiseaseAlertsOutput = z.infer<typeof GetPestDiseaseAlertsOutputSchema>;

export async function getPestDiseaseAlerts(
  input: GetPestDiseaseAlertsInput
): Promise<GetPestDiseaseAlertsOutput> {
  return getPestDiseaseAlertsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getPestDiseaseAlertsPrompt',
  input: {schema: GetPestDiseaseAlertsInputSchema},
  output: {schema: GetPestDiseaseAlertsOutputSchema},
  prompt: `You are an expert agricultural advisor. Provide predictive alerts about potential pest and disease outbreaks for a given location and crop type, based on hyperlocal weather data and climate change projections. For each alert, provide a clear and actionable solution or preventive measure.

Location: {{{location}}}
Crop Type: {{{cropType}}}

Generate a list of alerts and their corresponding solutions.`,
});

const getPestDiseaseAlertsFlow = ai.defineFlow(
  {
    name: 'getPestDiseaseAlertsFlow',
    inputSchema: GetPestDiseaseAlertsInputSchema,
    outputSchema: GetPestDiseaseAlertsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("AI failed to generate alerts.");
    }
    return output;
  }
);
