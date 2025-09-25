
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import {
  ArrowRight,
} from 'lucide-react';
import { Header } from '@/components/dashboard/header';
import { useTranslation } from '@/context/language-context';
import Image from 'next/image';
import images from '@/lib/placeholder-images';

export default function DashboardPage() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('dashboard.crop_health_card_title'),
      description: t('dashboard.crop_health_card_description'),
      href: '/crop-health',
      image: images.cropHealth,
    },
    {
      title: t('dashboard.weather_alerts_card_title'),
      description: t('dashboard.weather_alerts_card_description'),
      href: '/weather-alerts',
      image: images.weather,
    },
    {
      title: t('dashboard.mandi_prices_card_title'),
      description: t('dashboard.mandi_prices_card_description'),
      href: '/mandi-prices',
      image: images.mandi,
    },
    {
      title: t('dashboard.farming_plans_card_title'),
      description: t('dashboard.farming_plans_card_description'),
      href: '/farming-plans',
      image: images.farmingPlans,
    },
    {
      title: t('dashboard.forums_card_title'),
      description: t('dashboard.forums_card_description'),
      href: '/forums',
      image: images.forums,
    },
  ];


  return (
    <>
      <Header>{t('dashboard.title')}</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.href}
              className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative w-full h-40">
                <Image
                  src={feature.image.src}
                  alt={feature.image.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  data-ai-hint={feature.image['data-ai-hint']}
                />
              </div>
              <CardHeader className="pb-4">
                <CardTitle className="font-headline">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Link
                  href={feature.href}
                  className="flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent-foreground"
                >
                  {t('dashboard.go_to_feature')} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
