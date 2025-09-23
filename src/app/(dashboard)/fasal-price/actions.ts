'use server';

import { getFasalPrice, type GetFasalPriceOutput } from '@/ai/flows/get-fasal-price';

export interface FasalPriceState {
  data?: GetFasalPriceOutput;
  error?: string;
  market?: string;
}

export async function getCommodityPrices(
  prevState: FasalPriceState,
  formData: FormData
): Promise<FasalPriceState> {
  const market = formData.get('market') as string;

  if (!market) {
    return { error: 'Market name is required.' };
  }

  try {
    const result = await getFasalPrice({ market });
    return { data: result, market };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to fetch commodity prices: ${errorMessage}` };
  }
}
