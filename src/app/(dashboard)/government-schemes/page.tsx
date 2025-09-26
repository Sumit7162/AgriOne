
"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function GovernmentSchemesPage() {
  const { t } = useTranslation();

  const schemes = [
    {
      title: t('schemes.scheme1_title'),
      description: t('schemes.scheme1_description'),
      eligibility: t('schemes.scheme1_eligibility'),
    },
    {
      title: t('schemes.scheme2_title'),
      description: t('schemes.scheme2_description'),
      eligibility: t('schemes.scheme2_eligibility'),
    },
    {
      title: t('schemes.scheme3_title'),
      description: t('schemes.scheme3_description'),
      eligibility: t('schemes.scheme3_eligibility'),
    },
  ];

  return (
    <>
      <Header>{t('schemes.title')}</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="grid gap-6">
          {schemes.map((scheme, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="font-headline">{scheme.title}</CardTitle>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold text-foreground mb-1">{t('schemes.eligibility_label')}</p>
                <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
              </CardContent>
              <div className="p-6 pt-0 flex justify-end">
                <Button variant="outline">
                    {t('schemes.learn_more_button')} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
