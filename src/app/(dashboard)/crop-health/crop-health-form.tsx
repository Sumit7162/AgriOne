"use client";

import { useActionState } from "react";
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
import { getCropHealthReport, type CropHealthState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImageUp, ScanSearch } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialState: CropHealthState = {};

export function CropHealthForm() {
  const [state, formAction] = useActionState(getCropHealthReport, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string>('');
  const formRef = useRef<HTMLFormElement>(null);

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

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form ref={formRef} action={handleFormAction}>
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
          <CardTitle className="font-headline">Health Report</CardTitle>
          <CardDescription>
            The analysis of your crop will appear here.
          </CardDescription>
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
    </div>
  );
}
