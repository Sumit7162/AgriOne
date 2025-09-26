
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Search, Image, Cloud, Camera, Mic, Tractor } from 'lucide-react';
import { useTranslation } from '@/context/language-context';

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 bg-muted/40">
      <div className="w-full max-w-4xl flex flex-col h-full justify-between">
        <div className="flex-grow flex flex-col items-center justify-center text-center">
            <Tractor className="w-16 h-16 text-primary mb-4"/>
            <h1 className="text-4xl font-headline mb-2">{t('common.app_name')}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">{t('dashboard.search_placeholder')}</p>
        </div>
        <Card className="p-2 shadow-lg rounded-full mb-8">
          <CardContent className="p-0">
            <div className="relative">
              <Input
                placeholder={t('dashboard.search_placeholder')}
                className="w-full text-lg pl-12 pr-24 h-16 rounded-full bg-background border-2 border-border focus-visible:ring-primary focus-visible:ring-2"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                 <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="w-6 h-6" />
                 </Button>
                 <Link href="/crop-health">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <Camera className="w-6 h-6" />
                    </Button>
                 </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/crop-health" className="group">
            <Card className="h-full bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-orange-200 dark:bg-orange-800 p-3 rounded-full">
                  <Image className="w-8 h-8 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-orange-800 dark:text-orange-200">{t('dashboard.image_analysis_title')}</h3>
                  <p className="text-orange-700 dark:text-orange-300/80">{t('dashboard.image_analysis_description')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/weather-alerts" className="group">
            <Card className="h-full bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800 hover:shadow-xl transition-shadow">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-blue-200 dark:bg-blue-800 p-3 rounded-full">
                  <Cloud className="w-8 h-8 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <h3 className="font-headline text-xl text-blue-800 dark:text-blue-200">{t('dashboard.weather_title')}</h3>
                  <p className="text-blue-700 dark:text-blue-300/80">{t('dashboard.weather_description')}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
