
"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { sendLoginLink } from "./actions";
import { Mail } from "lucide-react";

interface LoginState {
  error?: string;
  message?: string;
}

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(sendLoginLink, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          required
        />
      </div>
      {state.error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      {state.message && (
        <Alert>
          <AlertTitle>Check your inbox</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <SubmitButton className="w-full">
        <Mail />
        Send Magic Link
      </SubmitButton>
    </form>
  );
}
