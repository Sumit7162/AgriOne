
'use server';

import { getPestDiseaseAlerts, type GetPestDiseaseAlertsOutput } from '@/ai/flows/get-pest-disease-alerts';
import { getWeatherData, type GetWeatherDataOutput } from '@/ai/flows/get-weather-data';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { translateText } from '@/ai/flows/translate-text';

export interface WeatherAlertState {
  alerts?: GetPestDiseaseAlertsOutput['alerts'];
  weather?: GetWeatherDataOutput;
  error?: string;
  location?: string;
  cropType?: string;
}

// Helper function for retrying promises
async function retry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (e instanceof Error && (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable'))) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw lastError;
}

export async function getWeatherAlerts(
  prevState: WeatherAlertState,
  formData: FormData
): Promise<WeatherAlertState> {
  const location = formData.get('location') as string;
  const cropType = formData.get('cropType') as string;

  if (!location || !cropType) {
    return { error: 'Location and Crop Type are required.' };
  }

  try {
    const [alertsResult, weatherResult] = await retry(() => Promise.all([
        getPestDiseaseAlerts({ location, cropType }),
        getWeatherData({ location })
    ]));
    
    return { alerts: alertsResult.alerts, weather: weatherResult, location, cropType };
  } catch (e) {
    console.error(e);
    let errorMessage = 'Failed to fetch weather alerts. Please try again.';
    if (e instanceof Error) {
      if (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable')) {
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a few moments.';
      } else {
        errorMessage = `Failed to fetch weather alerts: ${e.message}`;
      }
    }
    return { error: errorMessage };
  }
}

export async function getTranslatedAlerts(
  alerts: GetPestDiseaseAlertsOutput['alerts'],
  languageCode: string
): Promise<{ translatedAlerts?: GetPestDiseaseAlertsOutput['alerts']; error?: string }> {
  if (!alerts || alerts.length === 0) {
    return { error: 'Alerts are missing.' };
  }
  if (languageCode === 'en') {
    return { translatedAlerts: alerts };
  }
  try {
    const translatedAlerts = await Promise.all(
      alerts.map(async (item) => {
        const [translatedAlert, translatedSolution] = await Promise.all([
          translateText({ text: item.alert, targetLanguage: languageCode }),
          translateText({ text: item.solution, targetLanguage: languageCode }),
        ]);
        return {
          alert: translatedAlert.translatedText,
          solution: translatedSolution.translatedText,
        };
      })
    );
    return { translatedAlerts };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate alerts. Please try again.' };
  }
}

export async function getAlertsAudio(
  text: string,
  voiceName: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text) {
    return { error: 'Alert text is missing.' };
  }
  if (!voiceName) {
    return { error: 'Voice selection is missing.' };
  }

  try {
    const { media } = await textToSpeech({ text, voiceName });
     if (!media) {
      return { error: 'Audio generation is disabled. Please set your Gemini API key.' };
    }
    return { audioDataUri: media };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio. Please try again.' };
  }
}
