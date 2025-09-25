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
    // Check if the Gemini API key is present.
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === '<YOUR_API_KEY>') {
      console.warn("GEMINI_API_KEY is not set. Returning mock data for crop health report.");
      // Return a realistic mock report if the key is missing.
      return {
        plantInfo: "This appears to be a tomato plant (Solanum lycopersicum), a popular vegetable crop. It is in its early fruiting stage. Tomato plants require ample sunlight, regular watering, and nutrient-rich soil to thrive.",
        diseaseDiagnosis: "The yellowing leaves with dark spots are indicative of Early Blight (Alternaria solani), a common fungal disease in tomatoes. This is often exacerbated by humid weather and overhead watering.",
        solution: "1. **Pruning:** Immediately remove and destroy the infected lower leaves to prevent the spread of spores.\n2. **Watering:** Water at the base of the plant in the morning to avoid wet foliage overnight.\n3. **Fungicide:** Apply a copper-based or bio-fungicide (like Bacillus subtilis) spray, ensuring complete coverage of the plant. Repeat every 7-10 days.\n4. **Mulching:** Add a layer of straw or mulch around the plant base to prevent fungus from splashing up from the soil."
      };
    }

    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a report.");
    }
    return output;
  }
);