"use client";

import { useActionState, useState, useEffect, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFarmingPlan, getTranslatedPlan, type FarmingPlanState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BotMessageSquare, Percent, Tractor, Droplets, FlaskConical, Bug, Languages, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "@/context/language-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { PersonalizedFarmingAdviceOutput } from "@/ai/flows/get-personalized-farming-advice";

const initialState: FarmingPlanState = {};

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

export function FarmingPlansForm() {
  const [state, formAction] = useActionState(getFarmingPlan, initialState);
  const { t } = useTranslation();
  const [displayedAdvice, setDisplayedAdvice] = useState<PersonalizedFarmingAdviceOutput | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0].value);
  const [isTranslationLoading, startTranslationTransition] = useTransition();
  const { toast } = useToast();

   useEffect(() => {
    if (state.advice) {
        setDisplayedAdvice(state.advice);
        setSelectedLanguage('en');
    }
  }, [state.advice]);

  const handleLanguageChange = async (languageCode: string) => {
      setSelectedLanguage(languageCode);
      if (!state.advice) return;

      startTranslationTransition(async () => {
          const result = await getTranslatedPlan(state.advice!, languageCode);
          if (result.error) {
              toast({
                  variant: "destructive",
                  title: "Translation Error",
                  description: result.error,
              });
          } else if (result.translatedAdvice) {
              setDisplayedAdvice(result.translatedAdvice);
          }
      });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">{t('farming_plans.form_title')}</CardTitle>
            <CardDescription>
              {t('farming_plans.form_description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmDetails">{t('farming_plans.farm_details_label')}</Label>
              <Textarea
                id="farmDetails"
                name="farmDetails"
                placeholder={t('farming_plans.farm_details_placeholder')}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">{t('farming_plans.crop_type_label')}</Label>
              <Input
                id="cropType"
                name="cropType"
                placeholder={t('farming_plans.crop_type_placeholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPractices">{t('farming_plans.current_practices_label')}</Label>
              <Textarea
                id="currentPractices"
                name="currentPractices"
                placeholder={t('farming_plans.current_practices_placeholder')}
                rows={3}
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
              <BotMessageSquare />
              {t('farming_plans.submit_button')}
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-start flex-wrap justify-between gap-2">
             <div>
                <CardTitle className="font-headline">{t('farming_plans.plan_title')}</CardTitle>
                <CardDescription>
                  {t('farming_plans.plan_description')}
                </CardDescription>
            </div>
            {state.advice && (
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
        <CardContent>
          {isTranslationLoading ? (
             <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20 text-muted-foreground">
                  <Loader2 className="animate-spin mr-2"/>
                  <p>Translating...</p>
              </div>
          ) : displayedAdvice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('farming_plans.yield_increase')}</CardTitle>
                        <Tractor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{displayedAdvice.expectedYieldIncrease}</div>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('farming_plans.waste_reduction')}</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{displayedAdvice.resourceWasteReduction}</div>
                    </CardContent>
                </Card>
              </div>
              <Accordion type="single" collapsible defaultValue="irrigation" className="w-full">
                <AccordionItem value="irrigation">
                  <AccordionTrigger className="text-base font-semibold"><Droplets className="mr-2 text-primary" />{t('farming_plans.irrigation')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2 whitespace-pre-wrap">{displayedAdvice.irrigationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="fertilization">
                  <AccordionTrigger className="text-base font-semibold"><FlaskConical className="mr-2 text-primary" />{t('farming_plans.fertilization')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2 whitespace-pre-wrap">{displayedAdvice.fertilizationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="pest-control">
                  <AccordionTrigger className="text-base font-semibold"><Bug className="mr-2 text-primary" />{t('farming_plans.pest_control')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2 whitespace-pre-wrap">{displayedAdvice.pestControlRecommendations}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20 text-muted-foreground">
              <p>{t('farming_plans.awaiting_details')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
