'use server';

import { getPestDiseaseAlerts } from '@/ai/flows/get-pest-disease-alerts';

export interface WeatherAlertState {
  alerts?: string[];
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
    const { alerts } = await getPestDiseaseAlerts({ location, cropType });
    return { alerts, location, cropType };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to fetch weather alerts. Please try again.' };
  }
}
