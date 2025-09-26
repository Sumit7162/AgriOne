'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech';

// This function is being removed as its functionality is covered by getReportAudio
// in the crop-health actions file. Consolidating to a single action for TTS
// in the chat history will prevent recurring server action errors.
