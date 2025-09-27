
"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bug, CheckCircle, Info, Languages, Loader2, Sparkles, User, Volume2 } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/context/language-context";
import { getReportAudio, getTranslatedReport } from "@/app/(dashboard)/crop-health/actions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GenerateCropHealthReportOutput } from "@/ai/flows/generate-crop-health-report";

const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'as', label: 'অসমীয়া (Assamese)' },
    { value: 'mai', label: 'मैथिली (Maithili)' },
];

interface ChatHistoryProps {
  history: any[];
  isLoading: boolean;
}

function ReportCard({ item, index }: { item: any, index: number }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(undefined);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const [loadingAudioItem, setLoadingAudioItem] = useState<string | null>(null);
  const [displayedReport, setDisplayedReport] = useState<GenerateCropHealthReportOutput | undefined>(item.content);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [isTranslationLoading, startTranslationTransition] = useTransition();

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioDataUri]);

  const handleLanguageChange = async (languageCode: string) => {
      setSelectedLanguage(languageCode);
      if (!item.content) return;
      setAudioDataUri(undefined);

      startTranslationTransition(async () => {
          const result = await getTranslatedReport(item.content, languageCode);
          if (result.error) {
              toast({
                  variant: "destructive",
                  title: t('crop_health.translation_error_title'),
                  description: result.error,
              });
          } else if (result.translatedReport) {
              setDisplayedReport(result.translatedReport);
          }
      });
  };
  
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

  const renderAccordionItem = (section: 'info' | 'diagnosis' | 'solution', title: string, text: string, icon: React.ElementType, itemIndex: number) => {
    const Icon = icon;
    const uniqueId = `${section}-${itemIndex}`;

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
  
  if (!displayedReport) return null;

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <div className="flex items-start flex-wrap justify-between gap-2">
            <CardTitle className="font-headline text-2xl">{t('crop_health.report_title')}</CardTitle>
             <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-auto">
                    <SelectValue>
                        <div className="flex items-center gap-2">
                            <Languages className="h-4 w-4" />
                            <span>{languages.find(l => l.value === selectedLanguage)?.label}</span>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isTranslationLoading ? (
            <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/20 text-muted-foreground">
                <Loader2 className="animate-spin mr-2"/>
                <p>{t('crop_health.translating_text')}</p>
            </div>
        ) : (
          <Accordion type="single" collapsible defaultValue="diagnosis" className="w-full">
            {renderAccordionItem("info", t('crop_health.plant_info_title'), displayedReport.plantInfo, Info, index)}
            {renderAccordionItem("diagnosis", t('crop_health.diagnosis_title'), displayedReport.diseaseDiagnosis, Bug, index)}
            {renderAccordionItem("solution", t('crop_health.solution_title'), displayedReport.solution, CheckCircle, index)}
          </Accordion>
        )}
      </CardContent>
      {audioDataUri && <audio ref={audioRef} src={audioDataUri} className="hidden" />}
    </Card>
  )
}


export function ChatHistory({ history, isLoading }: ChatHistoryProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(undefined);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const [loadingAudioItem, setLoadingAudioItem] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestAiTextResponseRef = useRef<string | null>(null);

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
  
  // Effect to handle auto-playing the latest AI response
  useEffect(() => {
    const lastMessage = history[history.length - 1];
    if (!isLoading && lastMessage?.role === 'ai' && lastMessage?.type === 'text' && lastMessage.content !== latestAiTextResponseRef.current) {
      latestAiTextResponseRef.current = lastMessage.content;
      playAudioForItem(lastMessage.content, `auto-play-${history.length-1}`);
    }
  }, [history, isLoading]);


  const playAudioForItem = (text: string, section: string) => {
    if (isAudioLoading) return;
    setLoadingAudioItem(section);
    startAudioTransition(async () => {
      // Consolidating to use a single, reliable server action for all TTS needs in this component.
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
  
  return (
    <div className="space-y-6">
      {history.map((item, index) => (
        <div key={index} className="flex items-start gap-4">
          <Avatar>
            <AvatarFallback>{item.role === 'user' ? <User /> : <Sparkles />}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <p className="font-bold">{item.role === 'user' ? 'You' : 'AgriOne AI'}</p>
             {item.type === 'text' && (
                <div className="flex items-start gap-2">
                    <p 
                      className="flex-1"
                      dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }}
                    />
                    {item.role === 'ai' && (
                         <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => playAudioForItem(item.content, `text-${index}`)}
                            disabled={isAudioLoading}
                            className="text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        >
                            {isAudioLoading && loadingAudioItem === `text-${index}` ? <Loader2 className="animate-spin" /> : <Volume2 />}
                        </Button>
                    )}
                </div>
            )}
            {item.type === 'image' && item.content && (
              <div className="relative w-64 h-64 rounded-lg overflow-hidden border">
                <Image src={item.content} alt="User upload" fill style={{ objectFit: 'cover' }} />
              </div>
            )}
            {item.type === 'report' && item.content && (
              <ReportCard item={item} index={index} />
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
