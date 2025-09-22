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
  report: z.string().describe('The AI-generated crop health report.'),
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
  prompt: `You are an expert agriculture advisor. Generate a crop health report based on the following information.\n\nDescription: {{{description}}}\nPhoto: {{media url=photoDataUri}}\n\nReport:`,
});

const generateCropHealthReportFlow = ai.defineFlow(
  {
    name: 'generateCropHealthReportFlow',
    inputSchema: GenerateCropHealthReportInputSchema,
    outputSchema: GenerateCropHealthReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {report: output!.report};
  }
);
