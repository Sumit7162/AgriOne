
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getCropHealthReport, getReportAudio, getTranslatedReport, type CropHealthState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImageUp, ScanSearch, Volume2, Loader2, Languages, Camera, Info, Bug, CheckCircle } from "lucide-react";
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
import type { GenerateCropHealthReportOutput } from "@/ai/flows/generate-crop-health-report";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const initialState: CropHealthState = {};

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
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(getCropHealthReport, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioDataUri, setAudioDataUri] = useState<string | undefined>(undefined);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const [loadingAudioSection, setLoadingAudioSection] = useState<string | null>(null);
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();
  const [displayedReport, setDisplayedReport] = useState<GenerateCropHealthReportOutput | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const { toast } = useToast();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setPhotoDataUri(result);
        stopCamera();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCamera = async () => {
    setIsCameraOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera: ", error);
        setHasCameraPermission(false);
        setIsCameraOpen(false);
        toast({
          variant: "destructive",
          title: t('crop_health.camera_denied_title'),
          description: t('crop_health.camera_denied_description'),
        });
      }
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL("image/jpeg");
        setImagePreview(dataUri);
        setPhotoDataUri(dataUri);
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };
  
  const handleFormAction = (formData: FormData) => {
    if (!photoDataUri) {
        toast({
            variant: "destructive",
            title: t('crop_health.image_required_title'),
            description: t('crop_health.image_required_description'),
        });
        return;
    }
    setIsSubmitting(true);
    formData.append('photoDataUri', photoDataUri);
    formAction(formData);
  };

  useEffect(() => {
    if (state.report) {
        setDisplayedReport(state.report);
        setSelectedLanguage('en');
        setAudioDataUri(undefined); 
    }
    if (state.error || state.report) {
        setIsSubmitting(false);
    }
  }, [state.report, state.error]);

  useEffect(() => {
    if (audioDataUri && audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }, [audioDataUri]);
  

  const playSectionAudio = (section: 'info' | 'diagnosis' | 'solution', text: string) => {
    if (isAudioLoading) return;
    setLoadingAudioSection(section);
    startAudioTransition(async () => {
      const result = await getReportAudio(text, selectedVoice);
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
      setLoadingAudioSection(null);
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
                  title: t('crop_health.translation_error_title'),
                  description: result.error,
              });
          } else if (result.translatedReport) {
              setDisplayedReport(result.translatedReport);
              setAudioDataUri(undefined);
          }
      });
  };
  
  const handleReset = () => {
    startResetTransition(() => {
        formRef.current?.reset();
        setImagePreview(null);
        setPhotoDataUri('');
        setDisplayedReport(undefined);
        setAudioDataUri(undefined);
        formAction(new FormData());
        setIsSubmitting(false);
    });
  };


  if (isSubmitting && !state.report && !state.error) {
    return (
        <Card className="max-w-2xl mx-auto w-full">
            <CardContent className="p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
                <Loader2 className="w-16 h-16 animate-spin text-primary"/>
                <h2 className="text-2xl font-headline">{t('crop_health.analyzing_title')}</h2>
                <p className="text-muted-foreground">{t('crop_health.analyzing_description')}</p>
            </CardContent>
        </Card>
    )
  }

  if (state.report && displayedReport) {
    const renderAccordionItem = (section: 'info' | 'diagnosis' | 'solution', title: string, text: string, icon: React.ElementType) => {
      const Icon = icon;
      return (
        <AccordionItem value={section}>
          <div className="flex items-center w-full">
            <AccordionTrigger className="flex-1">
              <div className="flex items-center">
                <Icon className="mr-2 text-primary" />
                <span className="text-lg font-semibold">{title}</span>
              </div>
            </AccordionTrigger>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                playSectionAudio(section, text);
              }}
              disabled={isAudioLoading}
              className="mr-2"
            >
              {isAudioLoading && loadingAudioSection === section ? <Loader2 className="animate-spin" /> : <Volume2 />}
            </Button>
          </div>
          <AccordionContent className="text-base pl-2 whitespace-pre-wrap">{text}</AccordionContent>
        </AccordionItem>
      );
    };

    return (
        <Card className="max-w-2xl mx-auto w-full">
            <CardHeader>
                 <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <CardTitle className="font-headline text-2xl">{t('crop_health.report_title')}</CardTitle>
                    </div>
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
                        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                            <SelectTrigger className="w-auto">
                                <SelectValue placeholder={t('crop_health.select_voice_placeholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {voices.map(voice => (
                                    <SelectItem key={voice.value} value={voice.value} disabled={selectedLanguage !== voice.lang && selectedLanguage !== 'en'}>
                                        {voice.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                         <Button variant="outline" onClick={handleReset} disabled={isResetting}>
                            {isResetting ? <Loader2 className="animate-spin" /> : t('crop_health.analyze_another_button')}
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {imagePreview && (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                         <Image src={imagePreview} alt={t('crop_health.image_preview_alt')} fill style={{ objectFit: "cover" }} />
                    </div>
                )}
                
                {isTranslationLoading ? (
                     <div className="flex items-center justify-center h-[200px] border rounded-md bg-muted/20 text-muted-foreground">
                        <Loader2 className="animate-spin mr-2"/>
                        <p>{t('crop_health.translating_text')}</p>
                    </div>
                ) : (
                    <Accordion type="single" collapsible defaultValue="diagnosis" className="w-full">
                        {renderAccordionItem("info", t('crop_health.plant_info_title'), displayedReport.plantInfo, Info)}
                        {renderAccordionItem("diagnosis", t('crop_health.diagnosis_title'), displayedReport.diseaseDiagnosis, Bug)}
                        {renderAccordionItem("solution", t('crop_health.solution_title'), displayedReport.solution, CheckCircle)}
                    </Accordion>
                )}
            </CardContent>
            {audioDataUri && <audio ref={audioRef} src={audioDataUri} className="hidden" />}
        </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto w-full">
        <form ref={formRef} action={handleFormAction}>
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl">{t('crop_health.form_title')}</CardTitle>
            <CardDescription>
                {t('crop_health.form_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-center w-full">
                 <div 
                    className="relative w-64 h-64 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer bg-card hover:bg-muted/50 overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                 >
                    {imagePreview ? (
                        <Image src={imagePreview} alt={t('crop_health.image_preview_alt')} fill style={{ objectFit: "cover" }} />
                    ) : isCameraOpen ? (
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    ) : (
                        <div className="text-center text-muted-foreground p-4">
                            <ImageUp className="w-12 h-12 mx-auto mb-2"/>
                            <p className="font-semibold">{t('crop_health.upload_cta_strong')}</p>
                            <p className="text-xs">{t('crop_health.upload_cta_text')}</p>
                        </div>
                    )}
                 </div>
               </div>
                <Input ref={fileInputRef} id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
               <div className="flex justify-center gap-4">
                {isCameraOpen ? (
                     <>
                        <Button type="button" onClick={handleCapture} className="flex-1">{t('crop_health.capture_button')}</Button>
                        <Button type="button" variant="outline" onClick={stopCamera} className="flex-1">{t('crop_health.close_camera_button')}</Button>
                     </>
                ) : (
                    <Button type="button" variant="outline" onClick={(e) => { e.stopPropagation(); handleOpenCamera(); }}>
                        <Camera className="mr-2"/>
                        {t('crop_health.open_camera_button')}
                    </Button>
                )}
               </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t('crop_health.description_label')}</Label>
              <Input
                id="description"
                name="description"
                placeholder={t('crop_health.description_placeholder')}
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
            <SubmitButton className="w-full text-lg py-6">
              <ScanSearch />
              {t('crop_health.submit_button')}
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>
  );
}
