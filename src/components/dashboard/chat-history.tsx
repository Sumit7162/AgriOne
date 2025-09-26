
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bug, CheckCircle, Info, Loader2, Sparkles, User, Volume2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/context/language-context";
import { getReportAudio } from "@/app/(dashboard)/crop-health/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";


interface ChatHistoryProps {
  history: any[];
  isLoading: boolean;
}

export function ChatHistory({ history, isLoading }: ChatHistoryProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(undefined);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const [loadingAudioItem, setLoadingAudioItem] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history, isLoading]);

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioDataUri]);


  const playAudioForItem = (text: string, section: string) => {
    if (isAudioLoading) return;
    setLoadingAudioItem(section);
    startAudioTransition(async () => {
      const result = await getReportAudio(text);
      if (result.error) {
        toast({
          variant: "destructive",
          title: t('crop_health.audio_error_title'),
          description: result.error,
        });
        setAudioDataUri(undefined);
      } else {
        setAudioDataUri(result.audioDataUri);
      }
      setLoadingAudioItem(null);
    });
  };

  const renderAccordionItem = (section: 'info' | 'diagnosis' | 'solution', title: string, text: string, icon: React.ElementType) => {
    const Icon = icon;
    const uniqueId = section;

    return (
      <AccordionItem value={section}>
        <AccordionTrigger className="flex-1 text-left">
          <div className="flex items-center">
            <Icon className="mr-2 text-primary" />
            <span className="text-lg font-bold">{title}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-base pl-2 whitespace-pre-wrap">
          <div className="flex items-start gap-2">
            <p className="flex-1">{text}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => playAudioForItem(text, uniqueId)}
              disabled={isAudioLoading}
              className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              {isAudioLoading && loadingAudioItem === uniqueId ? <Loader2 className="animate-spin" /> : <Volume2 />}
            </Button>
          </div>
        </AccordionContent>
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
             {item.type === 'text' && <p className="whitespace-pre-wrap">{item.content}</p>}
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
      <div ref={scrollRef} />
      {audioDataUri && <audio ref={audioRef} src={audioDataUri} className="hidden" />}
    </div>
  );
}
