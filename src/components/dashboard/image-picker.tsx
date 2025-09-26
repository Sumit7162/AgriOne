
"use client";

import { useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon } from "lucide-react";
import { getCropHealthReport } from "@/app/(dashboard)/crop-health/actions";

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImagePicker({ isOpen, onClose, setHistory, setIsLoading }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onClose();
        handleImageSubmission(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmission = async (photoDataUri: string) => {
     setHistory(prev => [...prev, { role: 'user', type: 'image', content: photoDataUri }]);
     setIsLoading(true);

     const formData = new FormData();
     formData.append('photoDataUri', photoDataUri);
     
     const result = await getCropHealthReport({}, formData);

     setIsLoading(false);
     if (result.report) {
        setHistory(prev => [...prev, { role: 'ai', type: 'report', content: result.report }]);
     } else if (result.error) {
        setHistory(prev => [...prev, { role: 'ai', type: 'error', content: result.error }]);
     }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom" className="rounded-t-lg">
          <SheetHeader>
            <SheetTitle>What can I help with?</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-4 p-4">
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-8 h-8" />
              <span>Camera</span>
            </Button>
            <Button
              variant="outline"
              className="h-24 flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-8 h-8" />
              <span>Photos</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
      />
    </>
  );
}
