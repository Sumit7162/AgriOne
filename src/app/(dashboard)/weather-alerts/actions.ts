
'use server';

import { getPestDiseaseAlerts } from '@/ai/flows/get-pest-disease-alerts';
import { getWeatherData, type GetWeatherDataOutput } from '@/ai/flows/get-weather-data';
import { translateText } from '@/ai/flows/translate-text';

export interface WeatherAlertState {
  alerts?: string[];
  weather?: GetWeatherDataOutput;
  error?: string;
  location?: string;
  cropType?: string;
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
    const [alertsResult, weatherResult] = await Promise.all([
        getPestDiseaseAlerts({ location, cropType }),
        getWeatherData({ location })
    ]);
    
    return { alerts: alertsResult.alerts, weather: weatherResult, location, cropType };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to fetch weather alerts. Please try again.' };
  }
}

export async function getTranslatedAlerts(
  alerts: string[],
  languageCode: string
): Promise<{ translatedAlerts?: string[]; error?: string }> {
  if (!alerts || alerts.length === 0) {
    return { error: 'Alerts are missing.' };
  }
  if (languageCode === 'en') {
    return { translatedAlerts: alerts };
  }
  try {
    const translatedAlerts = await Promise.all(
      alerts.map(alert => 
        translateText({ text: alert, targetLanguage: languageCode })
        .then(res => res.translatedText)
      )
    );
    return { translatedAlerts };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate alerts. Please try again.' };
  }
}
