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
} from 'lucide-react';
import { Header } from '@/components/dashboard/header';

const features = [
  {
    title: 'Crop Health AI',
    description: 'Upload an image to detect pests and diseases in your crops instantly.',
    href: '/crop-health',
    icon: <Leaf className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Personalized Farming Plans',
    description: 'Get AI-powered advice to optimize your farming practices and boost yield.',
    href: '/farming-plans',
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Weather & Pest Alerts',
    description: 'Receive hyperlocal weather updates and predictive pest/disease alerts.',
    href: '/weather-alerts',
    icon: <CloudSun className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Farmer Marketplace',
    description: 'Buy and sell seeds, fertilizers, and other agricultural inputs.',
    href: '/marketplace',
    icon: <Store className="h-8 w-8 text-primary" />,
  },
  {
    title: 'Community Forums',
    description: 'Connect with other farmers, share knowledge, and ask questions.',
    href: '/forums',
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header>Dashboard</Header>
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
                  Go to feature <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
