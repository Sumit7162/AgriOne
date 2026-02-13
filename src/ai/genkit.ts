import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// IMPORTANT: Replace 'YOUR_GEMINI_API_KEY' with your actual Gemini API key.
// You can get one from the Google AI Studio: https://aistudio.google.com/app/apikey
const GEMINI_API_KEY = 'AIzaSyDjsWkogcJFAVZk837G3CITSLkE7key4VM';

export const ai = genkit({
  plugins: [googleAI({apiKey: GEMINI_API_KEY})],
  model: 'googleai/gemini-2.5-flash',
});
