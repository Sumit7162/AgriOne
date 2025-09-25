
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
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getWeatherAlerts, type WeatherAlertState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BellRing, CloudDrizzle, CloudRain, CloudSun, Siren, Thermometer, Wind } from "lucide-react";
import { useTranslation } from "@/context/language-context";

const initialState: WeatherAlertState = {};

export function WeatherAlertsForm() {
  const [state, formAction] = useActionState(getWeatherAlerts, initialState);
  const { t } = useTranslation();

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="font-headline">{t('weather_alerts.form_title')}</CardTitle>
              <CardDescription>
                {t('weather_alerts.form_description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t('weather_alerts.location_label')}</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder={t('weather_alerts.location_placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropType">{t('weather_alerts.crop_type_label')}</Label>
                <Input
                  id="cropType"
                  name="cropType"
                  placeholder={t('weather_alerts.crop_type_placeholder')}
                />
              </div>
              {state?.error && (
                <Alert variant="destructive">
                  <AlertTitle>{t('common.error')}</AlertTitle>
                  <AlertDescription>{state.error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <SubmitButton className="w-full">
                <BellRing />
                {t('weather_alerts.submit_button')}
              </SubmitButton>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{t('weather_alerts.forecast_title')}</CardTitle>
            <CardDescription>
              {state.location && state.cropType ? t('weather_alerts.forecast_description_dynamic', { cropType: state.cropType, location: state.location }) : t('weather_alerts.forecast_description_static')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 font-headline"><Siren className="text-destructive"/>{t('weather_alerts.predictive_alerts_title')}</h3>
                {state.alerts && state.alerts.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                        {state.alerts.map((alert, index) => (
                            <li key={index} className="text-destructive-foreground bg-destructive/80 p-3 rounded-md">{alert}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-24 border rounded-md bg-muted/20 text-muted-foreground">
                        <p>{state.location ? t('weather_alerts.no_threats') : t('weather_alerts.submit_for_alerts')}</p>
                    </div>
                )}
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 font-headline flex items-center gap-2"><CloudSun/>{t('weather_alerts.hyperlocal_weather_title')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <Card className="p-4 bg-card/50">
                        <Thermometer className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">{state.weather?.temperature || '...'}</p>
                        <p className="text-muted-foreground text-sm">{t('weather_alerts.temperature')}</p>
                    </Card>
                    <Card className="p-4 bg-card/50">
                        <Wind className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">{state.weather?.wind || '...'}</p>
                        <p className="text-muted-foreground text-sm">{t('weather_alerts.wind')}</p>
                    </Card>
                    <Card className="p-4 bg-card/50">
                        <CloudDrizzle className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">{state.weather?.humidity || '...'}</p>
                        <p className="text-muted-foreground text-sm">{t('weather_alerts.humidity')}</p>
                    </Card>
                     <Card className="p-4 bg-card/50">
                        <CloudRain className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">{state.weather?.precipitation || '...'}</p>
                        <p className="text-muted-foreground text-sm">{t('weather_alerts.precipitation')}</p>
                    </Card>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
