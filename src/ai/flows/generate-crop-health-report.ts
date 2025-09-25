'use server';

/**
 * @fileOverview Generates a crop health report based on an image and description.
 *
 * - generateCropHealthReport - A function that generates the crop health report.
 * - GenerateCropHealthReportInput - The input type for the generateCropHealthReport function.
 * - GenerateCropHealthReportOutput - The return type for the generateCropHealthReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCropHealthReportInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('The description of the plant.'),
});
export type GenerateCropHealthReportInput = z.infer<
  typeof GenerateCropHealthReportInputSchema
>;

const GenerateCropHealthReportOutputSchema = z.object({
  plantInfo: z.string().describe('A small description and knowledge about the identified plant.'),
  diseaseDiagnosis: z.string().describe('Information and diagnosis of the disease or pest affecting the plant.'),
  solution: z.string().describe('A complete solution and recommended course of action.'),
});
export type GenerateCropHealthReportOutput = z.infer<
  typeof GenerateCropHealthReportOutputSchema
>;

export async function generateCropHealthReport(
  input: GenerateCropHealthReportInput
): Promise<GenerateCropHealthReportOutput> {
  return generateCropHealthReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCropHealthReportPrompt',
  input: {schema: GenerateCropHealthReportInputSchema},
  output: {schema: GenerateCropHealthReportOutputSchema},
  prompt: `You are an expert agriculture advisor. Analyze the provided image and description to generate a crop health report. The report must be in three distinct parts:

1.  **plantInfo**: Provide a small description and general knowledge about the plant shown in the photo.
2.  **diseaseDiagnosis**: Identify and provide information about the specific disease or pest affecting the plant.
3.  **solution**: Give a complete, actionable solution and the recommended course of action to treat the issue.

Description: {{{description}}}
Photo: {{media url=photoDataUri}}`,
});

const generateCropHealthReportFlow = ai.defineFlow(
  {
    name: 'generateCropHealthReportFlow',
    inputSchema: GenerateCropHealthReportInputSchema,
    outputSchema: GenerateCropHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a report.");
    }
    return output;
  }
);
