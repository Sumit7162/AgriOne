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
import { getCropHealthReport, getReportAudio, type CropHealthState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImageUp, ScanSearch, Volume2, Loader2 } from "lucide-react";
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

const initialState: CropHealthState = {
  formKey: 1,
};

const voices = [
    { value: 'Algenib', label: 'Voice 1 (English)' },
    { value: 'Achernar', label: 'Voice 2 (English)' },
    { value: 'Hadar', label: 'Voice 3 (English)' },
];

export function CropHealthForm() {
  const [state, formAction] = useActionState(getCropHealthReport, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedVoice, setSelectedVoice] = useState(voices[0].value);
  const [isAudioLoading, startAudioTransition] = useTransition();
  const { toast } = useToast();

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

  const handleVoiceChange = async (voice: string) => {
    setSelectedVoice(voice);
    if (!state.report) return;

    startAudioTransition(async () => {
      const result = await getReportAudio(state.report!, voice);
      if (result.error) {
        toast({
            variant: "destructive",
            title: "Audio Error",
            description: result.error,
        });
      } else if (result.audioDataUri && audioRef.current) {
        audioRef.current.src = result.audioDataUri;
      }
    });
  };

  useEffect(() => {
    if (state.audioDataUri && audioRef.current) {
      audioRef.current.src = state.audioDataUri;
    }
  }, [state.audioDataUri]);

  // Reset image preview when form is successfully submitted
  useEffect(() => {
    setImagePreview(null);
    setPhotoDataUri('');
  }, [state.formKey]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form key={state.formKey} action={handleFormAction}>
          <CardHeader>
            <CardTitle className="font-headline">AI Crop Diagnostics</CardTitle>
            <CardDescription>
              Upload a photo of a plant and add a description to get an
              AI-generated health report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Crop Photo</Label>
              <div className="flex items-center justify-center w-full">
                <label htmlFor="photo" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <Image src={imagePreview} alt="Crop preview" fill style={{ objectFit: "contain" }} className="rounded-lg p-2" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageUp className="w-8 h-8 mb-4 text-muted-foreground" />
                      <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, or WEBP</p>
                    </div>
                  )}
                </label>
              </div>
              <Input id="photo" name="photo" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="e.g., Yellow spots on leaves, wilting stems..."
                rows={4}
              />
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">
              <ScanSearch />
              Analyze Crop Health
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start flex-wrap justify-between gap-2">
            <div>
              <CardTitle className="font-headline">Health Report</CardTitle>
              <CardDescription>
                The analysis of your crop will appear here.
              </CardDescription>
            </div>
            {state.report && state.audioDataUri && (
                <div className="flex items-center gap-2">
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Select voice" />
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
                        <span className="sr-only">Read report aloud</span>
                    </Button>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full p-4 border rounded-md bg-muted/20">
            {state.report ? (
              <p className="whitespace-pre-wrap">{state.report}</p>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Awaiting analysis...</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
      {state.audioDataUri && <audio ref={audioRef} src={state.audioDataUri} className="hidden" />}
    </div>
  );
}
