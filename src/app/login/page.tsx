"use client";

import { Tractor } from "lucide-react";
import { LoginForm } from "./login-form";
import { useTranslation } from "@/context/language-context";
import { LanguageProvider } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/dashboard/language-switcher";

function LoginPageContent() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
         <div className="flex items-center justify-center gap-2 mb-4">
            <Tractor className="w-10 h-10 text-primary" />
            <span className="font-headline text-4xl text-foreground">
                AgriOne
            </span>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}


export default function LoginPage() {
  return (
    <LanguageProvider>
      <LoginPageContent />
    </LanguageProvider>
  )
}
