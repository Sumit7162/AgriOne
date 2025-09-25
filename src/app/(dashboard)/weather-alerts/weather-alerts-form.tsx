
"use client";

import { useActionState, useState, useTransition, useEffect } from "react";
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
import { getWeatherAlerts, getTranslatedAlerts, type WeatherAlertState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BellRing, CloudDrizzle, CloudRain, CloudSun, Siren, Thermometer, Wind, Languages, Loader2 } from "lucide-react";
import { useTranslation } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const initialState: WeatherAlertState = {};

const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
    { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
    { value: 'or', label: 'ଓଡ଼ିଆ (Odia)' },
    { value: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
    { value: 'ml', label: 'മലയാളം (Malayalam)' },
    { value: 'as', label: 'অসমীয়া (Assamese)' },
    { value: 'mai', label: 'मैथिली (Maithili)' },
];

export function WeatherAlertsForm() {
  const [state, formAction] = useActionState(getWeatherAlerts, initialState);
  const { t } = useTranslation();
  const [displayedAlerts, setDisplayedAlerts] = useState<string[] | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (state.alerts) {
        setDisplayedAlerts(state.alerts);
        setSelectedLanguage('en');
    }
  }, [state.alerts]);

  const handleLanguageChange = async (languageCode: string) => {
      setSelectedLanguage(languageCode);
      if (!state.alerts) return;

      startTranslationTransition(async () => {
          const result = await getTranslatedAlerts(state.alerts!, languageCode);
          if (result.error) {
              toast({
                  variant: "destructive",
                  title: "Translation Error",
                  description: result.error,
              });
          } else if (result.translatedAlerts) {
              setDisplayedAlerts(result.translatedAlerts);
          }
      });
  };

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
             <div className="flex items-start flex-wrap justify-between gap-2">
                <div>
                    <CardTitle className="font-headline">{t('weather_alerts.forecast_title')}</CardTitle>
                    <CardDescription>
                      {state.location && state.cropType ? t('weather_alerts.forecast_description_dynamic', { cropType: state.cropType, location: state.location }) : t('weather_alerts.forecast_description_static')}
                    </CardDescription>
                </div>
                {state.alerts && (
                    <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-auto">
                            <SelectValue>
                                <div className="flex items-center gap-2">
                                    <Languages className="h-4 w-4" />
                                    <span>{languages.find(l => l.value === selectedLanguage)?.label}</span>
                                </div>
                            </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map(lang => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 font-headline"><Siren className="text-destructive"/>{t('weather_alerts.predictive_alerts_title')}</h3>
                {isTranslationLoading ? (
                     <div className="flex items-center justify-center h-24 border rounded-md bg-muted/20 text-muted-foreground">
                        <Loader2 className="animate-spin mr-2"/>
                        <p>Translating alerts...</p>
                    </div>
                ) : displayedAlerts && displayedAlerts.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                        {displayedAlerts.map((alert, index) => (
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
