
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

export default function DashboardPage() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('dashboard.crop_health_card_title'),
      description: t('dashboard.crop_health_card_description'),
      href: '/crop-health',
    },
    {
      title: t('dashboard.weather_alerts_card_title'),
      description: t('dashboard.weather_alerts_card_description'),
      href: '/weather-alerts',
    },
    {
      title: t('dashboard.mandi_prices_card_title'),
      description: t('dashboard.mandi_prices_card_description'),
      href: '/mandi-prices',
    },
    {
      title: t('dashboard.farming_plans_card_title'),
      description: t('dashboard.farming_plans_card_description'),
      href: '/farming-plans',
    },
    {
      title: t('dashboard.forums_card_title'),
      description: t('dashboard.forums_card_description'),
      href: '/forums',
    },
  ];


  return (
    <>
      <Header>{t('dashboard.title')}</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
             <Link href={feature.href} key={feature.href} className="group">
                <Card
                className="flex flex-col h-full transition-all group-hover:shadow-lg group-hover:-translate-y-1"
                >
                <CardHeader className="pb-4">
                    <CardTitle className="font-headline">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                    <CardDescription>{feature.description}</CardDescription>
                </CardContent>
                <div className="p-6 pt-0">
                    <div
                    className="flex items-center gap-2 text-sm font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100"
                    >
                    {t('dashboard.go_to_feature')} <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
