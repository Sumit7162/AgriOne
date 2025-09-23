"use client";

import { useActionState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmitButton } from "@/components/ui/submit-button";
import { sendLoginLink, sendOtp, verifyOtp } from "./actions";
import { Mail, Smartphone, KeyRound } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface AuthState {
  error?: string;
  message?: string;
  otpSent?: boolean;
}

const initialState: AuthState = {};

export function LoginForm() {
  const [emailState, emailFormAction] = useActionState(sendLoginLink, initialState);
  const [phoneState, phoneFormAction] = useActionState(sendOtp, initialState);
  const [otpState, otpFormAction] = useActionState(verifyOtp, initialState);

  const { t } = useTranslation();

  const finalPhoneState = otpState.otpSent ? otpState : phoneState;

  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="email">{t('login.email_tab')}</TabsTrigger>
        <TabsTrigger value="phone">{t('login.phone_tab')}</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <Card>
          <CardHeader>
            <CardTitle>{t('login.email_title')}</CardTitle>
            <CardDescription>{t('login.email_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={emailFormAction} className="space-y-4">
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
              {emailState.error && (
                <Alert variant="destructive">
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>{emailState.error}</AlertDescription>
                </Alert>
              )}
              {emailState.message && (
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
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="phone">
         <Card>
          <CardHeader>
            <CardTitle>{t('login.phone_title')}</CardTitle>
            <CardDescription>{t('login.phone_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            {!finalPhoneState.otpSent ? (
               <form action={phoneFormAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('login.phone_label')}</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder={t('login.phone_placeholder')}
                      required
                    />
                  </div>
                  {finalPhoneState.error && (
                    <Alert variant="destructive">
                      <AlertTitle>{t('common.error')}</AlertTitle>
                      <AlertDescription>{finalPhoneState.error}</AlertDescription>
                    </Alert>
                  )}
                  <SubmitButton className="w-full">
                    <Smartphone />
                    {t('login.send_otp_button')}
                  </SubmitButton>
               </form>
            ) : (
                <form action={otpFormAction} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="otp">{t('login.otp_label')}</Label>
                        <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder={t('login.otp_placeholder')}
                        required
                        maxLength={6}
                        />
                    </div>
                    {finalPhoneState.error && (
                        <Alert variant="destructive">
                        <AlertTitle>{t('common.error')}</AlertTitle>
                        <AlertDescription>{finalPhoneState.error}</AlertDescription>
                        </Alert>
                    )}
                    {otpState.message ? (
                       <Alert>
                          <AlertTitle>{t('login.success_title')}</AlertTitle>
                          <AlertDescription>{otpState.message}</AlertDescription>
                       </Alert>
                    ) : finalPhoneState.message && (
                        <Alert>
                            <AlertTitle>{t('login.otp_sent_title')}</AlertTitle>
                            <AlertDescription>{finalPhoneState.message}</AlertDescription>
                        </Alert>
                    )}
                    <SubmitButton className="w-full">
                        <KeyRound />
                        {t('login.verify_otp_button')}
                    </SubmitButton>
                </form>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
