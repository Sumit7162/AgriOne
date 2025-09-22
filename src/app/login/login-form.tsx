"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { sendLoginLink } from "./actions";
import { Mail } from "lucide-react";
import { useTranslation } from "@/context/language-context";

interface LoginState {
  error?: string;
  message?: string;
}

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(sendLoginLink, initialState);
  const { t } = useTranslation();

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t('login.email_label')}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t('login.email_placeholder')}
          required
        />
      </div>
      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>{t('common.error')}</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.message && (
        <Alert>
          <AlertTitle>{t('login.success_title')}</AlertTitle>
          <AlertDescription>{t('login.success_message')}</AlertDescription>
        </Alert>
      )}
      <SubmitButton className="w-full">
        <Mail />
        {t('login.submit_button')}
      </SubmitButton>
    </form>
  );
}
