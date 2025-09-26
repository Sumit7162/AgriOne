
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Mic, Send, Square } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { ImagePicker } from '@/components/dashboard/image-picker';
import { ChatHistory } from '@/components/dashboard/chat-history';
import { generateTextResponse } from '@/ai/flows/generate-text-response';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const [playLatestResponse, setPlayLatestResponse] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        // Automatically submit after transcription
        document.getElementById('chat-form-submit-button')?.click();
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
            variant: "destructive",
            title: "Speech Recognition Error",
            description: `An error occurred: ${event.error}`,
        });
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };
      
      recognitionRef.current = recognition;
    }
  }, [toast]);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
         toast({
            variant: "destructive",
            title: "Not Supported",
            description: "Your browser does not support speech recognition.",
        });
        return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setPlayLatestResponse(true); // Flag that the next AI response should be spoken
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', type: 'text', content: inputValue };
    setHistory(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await generateTextResponse({ query: currentInput });
      setHistory(prev => [...prev, { role: 'ai', type: 'text', content: result.response }]);
    } catch (error: any) {
      console.error(error);
      setPlayLatestResponse(false); // Don't play audio for errors
      let errorMessage = 'An unknown error occurred while trying to get a response.';
      if (error.message && error.message.includes('503')) {
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a few moments.';
      } else if (error instanceof Error) {
        errorMessage = `Failed to get response: ${error.message}`;
      }
      setHistory(prev => [...prev, { role: 'ai', type: 'error', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-4xl font-headline mb-2">{t('common.app_name')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{t('dashboard.search_placeholder')}</p>
          </div>
        ) : (
          <ChatHistory 
            history={history} 
            isLoading={isLoading} 
            playLatestResponse={playLatestResponse}
            setPlayLatestResponse={setPlayLatestResponse}
          />
        )}
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setPickerOpen(true)}>
              <Camera className="w-6 h-6" />
            </Button>
          </div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isRecording ? "Listening..." : t('dashboard.search_placeholder')}
            className="w-full text-lg pl-14 pr-24 h-16 rounded-full bg-muted border-2 border-border focus-visible:ring-primary focus-visible:ring-2"
            disabled={isLoading || isRecording}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={handleMicClick}>
              {isRecording ? <Square className="w-6 h-6 text-destructive" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Button type="submit" id="chat-form-submit-button" variant="ghost" size="icon" className="rounded-full" disabled={isLoading || isRecording || !inputValue.trim()}>
              <Send className="w-6 h-6" />
            </Button>
          </div>
        </form>
      </div>
      <ImagePicker
        isOpen={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        setHistory={setHistory}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}
