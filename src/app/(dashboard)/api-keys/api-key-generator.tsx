"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ApiKeyGenerator() {
  const [apiKey, setApiKey] = useState("********************************");
  const { toast } = useToast();

  const generateApiKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "agri_";
    for (let i = 0; i < 32; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setApiKey(result);
  };

  useEffect(() => {
    generateApiKey();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    toast({
      title: "API Key Copied",
      description: "The API key has been copied to your clipboard.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your API Key</CardTitle>
        <CardDescription>
          Use this key to integrate AgriSuper services into your applications. Keep it secret!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <Input readOnly value={apiKey} className="pr-10 font-code" />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={copyToClipboard}
            aria-label="Copy API Key"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateApiKey} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Generate New Key
        </Button>
      </CardFooter>
    </Card>
  );
}
