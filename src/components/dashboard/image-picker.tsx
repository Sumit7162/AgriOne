
"use client";

import { useRef, useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, CircleDot, RefreshCw } from "lucide-react";
import { getCropHealthReport } from "@/app/(dashboard)/crop-health/actions";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ImagePickerProps {
  isOpen: boolean;
  onClose: () => void;
  setHistory: React.Dispatch<React.SetStateAction<any[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImagePicker({ isOpen, onClose, setHistory, setIsLoading }: ImagePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (showCamera) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings to use this app.',
          });
        }
      };
      getCameraPermission();
    } else if (videoRef.current?.srcObject) {
      // Stop the camera stream when not showing
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [showCamera, toast]);
  
  const handleClose = () => {
      setShowCamera(false);
      onClose();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        handleClose();
        handleImageSubmission(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        handleClose();
        handleImageSubmission(dataUri);
      }
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
      <Sheet open={isOpen} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="rounded-t-lg">
          <SheetHeader>
            <SheetTitle>What can I help with?</SheetTitle>
          </SheetHeader>
          
          {!showCamera ? (
              <div className="grid grid-cols-2 gap-4 p-4">
                <Button
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => setShowCamera(true)}
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
          ) : (
             <div className="p-4 space-y-4">
                <div className="relative aspect-video rounded-md overflow-hidden bg-muted">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                    <canvas ref={canvasRef} className="hidden" />
                    {hasCameraPermission === false && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <Alert variant="destructive">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                    Please enable camera permissions to use this feature. You may need to refresh the page after granting permission.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
                 <div className="flex justify-center gap-4">
                    <Button onClick={() => setShowCamera(false)} variant="ghost" size="lg">
                        <RefreshCw className="mr-2"/>
                        Retake
                    </Button>
                    <Button onClick={handleCapture} size="lg" disabled={!hasCameraPermission}>
                        <CircleDot className="mr-2"/>
                        Capture
                    </Button>
                </div>
             </div>
          )}
          
        </SheetContent>
      </Sheet>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
}
