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
  ClipboardList,
  CloudSun,
  KeyRound,
  Leaf,
  MessageSquare,
  Store,
  ArrowRight,
  Landmark,
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
      icon: <Leaf className="h-8 w-8 text-primary" />,
    },
    {
      title: t('dashboard.farming_plans_card_title'),
      description: t('dashboard.farming_plans_card_description'),
      href: '/farming-plans',
      icon: <ClipboardList className="h-8 w-8 text-primary" />,
    },
    {
      title: t('dashboard.weather_alerts_card_title'),
      description: t('dashboard.weather_alerts_card_description'),
      href: '/weather-alerts',
      icon: <CloudSun className="h-8 w-8 text-primary" />,
    },
    {
      title: t('dashboard.fasal_price_card_title'),
      description: t('dashboard.fasal_price_card_description'),
      href: '/fasal-price',
      icon: <Landmark className="h-8 w-8 text-primary" />,
    },
    {
      title: t('dashboard.marketplace_card_title'),
      description: t('dashboard.marketplace_card_description'),
      href: '/marketplace',
      icon: <Store className="h-8 w-8 text-primary" />,
    },
    {
      title: t('dashboard.forums_card_title'),
      description: t('dashboard.forums_card_description'),
      href: '/forums',
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
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
              className="flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-4">
                {feature.icon}
                <div className="grid gap-1">
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                </div>
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
