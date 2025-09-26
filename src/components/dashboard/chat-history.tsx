
"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bug, CheckCircle, Info, Loader2, Sparkles, User } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/context/language-context";

interface ChatHistoryProps {
  history: any[];
  isLoading: boolean;
}

export function ChatHistory({ history, isLoading }: ChatHistoryProps) {
  const { t } = useTranslation();

  const renderAccordionItem = (section: 'info' | 'diagnosis' | 'solution', title: string, text: string, icon: React.ElementType) => {
    const Icon = icon;
    return (
      <AccordionItem value={section}>
        <AccordionTrigger className="flex-1">
          <div className="flex items-center">
            <Icon className="mr-2 text-primary" />
            <span className="text-lg font-bold">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-base pl-2 whitespace-pre-wrap">{text}</AccordionContent>
      </AccordionItem>
    );
  };


  return (
    <div className="space-y-6">
      {history.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{item.role === 'user' ? <User /> : <Sparkles />}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <p className="font-bold">{item.role === 'user' ? 'You' : 'AgriOne AI'}</p>
            {item.type === 'image' && item.content && (
              <div className="relative w-64 h-64 rounded-lg overflow-hidden border">
                <Image src={item.content} alt="User upload" fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            {item.type === 'report' && item.content && (
              <Card className="max-w-2xl w-full">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">{t('crop_health.report_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible defaultValue="diagnosis" className="w-full">
                    {renderAccordionItem("info", t('crop_health.plant_info_title'), item.content.plantInfo, Info)}
                    {renderAccordionItem("diagnosis", t('crop_health.diagnosis_title'), item.content.diseaseDiagnosis, Bug)}
                    {renderAccordionItem("solution", t('crop_health.solution_title'), item.content.solution, CheckCircle)}
                  </Accordion>
                </CardContent>
              </Card>
            )}
            {item.type === 'error' && (
                <div className="text-destructive">{item.content}</div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback><Sparkles /></AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2 pt-2">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
