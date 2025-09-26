
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Mic, Send } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { ImagePicker } from '@/components/dashboard/image-picker';
import { ChatHistory } from '@/components/dashboard/chat-history';
import { generateTextResponse } from '@/ai/flows/generate-text-response';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleTextSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', type: 'text', content: inputValue };
    setHistory(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await generateTextResponse({ query: inputValue });
      setHistory(prev => [...prev, { role: 'ai', type: 'text', content: result.response }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setHistory(prev => [...prev, { role: 'ai', type: 'error', content: `Failed to get response: ${errorMessage}` }]);
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
          <ChatHistory history={history} isLoading={isLoading} />
        )}
      </div>

      <div className="p-4 bg-background border-t">
        <form onSubmit={handleTextSubmit} className="relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button type="button" variant="ghost" size="icon" className="rounded-full" onClick={() => setPickerOpen(true)}>
              <Camera className="w-6 h-6" />
            </Button>
          </div>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('dashboard.search_placeholder')}
            className="w-full text-lg pl-14 pr-24 h-16 rounded-full bg-muted border-2 border-border focus-visible:ring-primary focus-visible:ring-2"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Mic className="w-6 h-6" />
            </Button>
            <Button type="submit" variant="ghost" size="icon" className="rounded-full" disabled={isLoading || !inputValue.trim()}>
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
