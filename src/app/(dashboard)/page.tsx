
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Camera, Tractor, Mic, Cloud, Image as ImageIcon, HeartPulse, Sparkles, AlertTriangle, LandPlot, Users, Library } from 'lucide-react';
import { useTranslation } from '@/context/language-context';
import { ImagePicker } from '@/components/dashboard/image-picker';
import { ChatHistory } from '@/components/dashboard/chat-history';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
             <Tractor className="w-16 h-16 text-primary mb-4"/>
              <h1 className="text-4xl font-headline mb-2">{t('common.app_name')}</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">{t('dashboard.search_placeholder')}</p>
          </div>
        ) : (
          <ChatHistory history={history} isLoading={isLoading} />
        )}
      </div>

      <div className="p-4 bg-background border-t">
         <div className="relative">
             <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                 <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setPickerOpen(true)}>
                    <Camera className="w-6 h-6" />
                 </Button>
              </div>
              <input
                placeholder={t('dashboard.search_placeholder')}
                className="w-full text-lg pl-14 pr-14 h-16 rounded-full bg-muted border-2 border-border focus-visible:ring-primary focus-visible:ring-2"
                disabled
              />
               <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="w-6 h-6" />
                 </Button>
              </div>
            </div>
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
