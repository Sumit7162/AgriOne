"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tractor } from "lucide-react";
import { LoginForm } from "./login-form";
import { useTranslation } from "@/context/language-context";
import { LanguageProvider } from "@/context/language-context";
import { LanguageSwitcher } from "@/components/dashboard/language-switcher";

function LoginPageContent() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <div className="w-full max-w-md">
        <Card className="mb-8">
          <CardHeader className="items-center text-center">
            <div className="flex items-center gap-2 mb-4">
                <Tractor className="w-10 h-10 text-primary" />
                <span className="font-headline text-4xl">
                    AgriSuper
                </span>
            </div>
            <CardTitle className="font-headline text-2xl">{t('login.title')}</CardTitle>
            <CardDescription>{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
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
