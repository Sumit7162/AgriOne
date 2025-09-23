
"use client";

import { useActionState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCropHealthReport, getReportAudio, getTranslatedReport, type CropHealthState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImageUp, ScanSearch, Volume2, Loader2, Languages } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/context/language-context";

const initialState: CropHealthState = {
  formKey: 1,
};

const voices = [
    { value: 'Algenib', label: 'Voice 1 (English)', lang: 'en' },
    { value: 'hi-IN-Standard-A', label: 'आवाज 2 (हिन्दी)', lang: 'hi' },
    { value: 'Hadar', label: 'Voice 3 (English)', lang: 'en' },
];

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

export function CropHealthForm() {
  const [state, formAction] = useActionState(getCropHealthReport, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const [displayedReport, setDisplayedReport] = useState<string | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setPhotoDataUri(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormAction = (formData: FormData) => {
    formData.append('photoDataUri', photoDataUri);
    formAction(formData);
  };

  const playAudio = () => {
    if (audioRef.current?.src) {
      audioRef.current.play();
    }
  };
  
  const handleVoiceChange = async (voiceValue: string) => {
    setSelectedVoice(voiceValue);
    if (!displayedReport) return;
    
    startAudioTransition(async () => {
      const result = await getReportAudio(displayedReport, voiceValue);
       if (result.error) {
        toast({
            variant: "destructive",
            title: t('crop_health.audio_error_title'),
            description: result.error,
        });
      } else {
        if (result.audioDataUri && audioRef.current) {
          audioRef.current.src = result.audioDataUri;
          audioRef.current.play();
        }
      }
    });
  };

  const handleLanguageChange = async (languageCode: string) => {
      setSelectedLanguage(languageCode);
      if (!state.report) return;

      startTranslationTransition(async () => {
          const result = await getTranslatedReport(state.report!, languageCode);
          if (result.error) {
              toast({
                  variant: "destructive",
                  title: "Translation Error",
                  description: result.error,
              });
          } else if (result.translatedText) {
              setDisplayedReport(result.translatedText);
          }
      });
  };

  useEffect(() => {
    if (state.report) {
        setDisplayedReport(state.report);
        setSelectedLanguage('en');
    }
  }, [state.report]);

  useEffect(() => {
    if (state.audioDataUri && audioRef.current) {
      audioRef.current.src = state.audioDataUri;
    }
  }, [state.audioDataUri]);

  // Reset image preview when form is successfully submitted
  useEffect(() => {
    if(state.report) {
      setImagePreview(null);
      setPhotoDataUri('');
    }
  }, [state.formKey, state.report]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form key={state.formKey} action={handleFormAction}>
          <CardHeader>
            <CardTitle className="font-headline">{t('crop_health.form_title')}</CardTitle>
            <CardDescription>
              {t('crop_health.form_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">{t('crop_health.photo_label')}</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image src={imagePreview} alt={t('crop_health.image_preview_alt')} fill style={{ objectFit: "contain" }} className="rounded-lg p-2" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{t('crop_health.upload_cta_strong')}</span>{t('crop_health.upload_cta_text')}</p>
                      <p className="text-xs text-muted-foreground">{t('crop_health.upload_formats')}</p>
                    </div>
                  )}
                </label>
              </div>
              <Input id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('crop_health.description_label')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('crop_health.description_placeholder')}
                rows={4}
              />
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertTitle>{t('common.error')}</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">
              <ScanSearch />
              {t('crop_health.submit_button')}
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start flex-wrap justify-between gap-2">
            <div>
              <CardTitle className="font-headline">{t('crop_health.report_title')}</CardTitle>
              <CardDescription>
                {t('crop_health.report_description')}
              </CardDescription>
            </div>
            {state.report && state.audioDataUri && (
                <div className="flex items-center gap-2">
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
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder={t('crop_health.select_voice_placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                            {voices.map(voice => (
                                <SelectItem key={voice.value} value={voice.value}>
                                    {voice.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={playAudio} disabled={isAudioLoading}>
                        {isAudioLoading ? <Loader2 className="animate-spin" /> : <Volume2 />}
                        <span className="sr-only">{t('crop_health.read_aloud_sr')}</span>
                    </Button>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full p-4 border rounded-md bg-muted/20">
            {isTranslationLoading ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="animate-spin mr-2"/>
                    <p>Translating...</p>
                </div>
            ) : displayedReport ? (
              <p className="whitespace-pre-wrap">{displayedReport}</p>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>{t('crop_health.awaiting_analysis')}</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {state.audioDataUri && <audio ref={audioRef} src={state.audioDataUri} className="hidden" />}
    </div>
  );
}
