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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getFarmingPlan, type FarmingPlanState } from "./actions";
import { SubmitButton } from "@/components/ui/submit-button";
import { BotMessageSquare, ChevronsDownUp, ChevronsUpDown, Percent, Tractor, Droplets, FlaskConical, Bug } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/context/language-context";

const initialState: FarmingPlanState = {};

export function FarmingPlansForm() {
  const [state, formAction] = useActionState(getFarmingPlan, initialState);
  const { t } = useTranslation();

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
          <CardTitle className="font-headline">{t('farming_plans.plan_title')}</CardTitle>
          <CardDescription>
            {t('farming_plans.plan_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.advice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('farming_plans.yield_increase')}</CardTitle>
                        <Tractor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{state.advice.expectedYieldIncrease}</div>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t('farming_plans.waste_reduction')}</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{state.advice.resourceWasteReduction}</div>
                    </CardContent>
                </Card>
              </div>
              <Accordion type="single" collapsible defaultValue="irrigation" className="w-full">
                <AccordionItem value="irrigation">
                  <AccordionTrigger className="text-base font-semibold"><Droplets className="mr-2 text-primary" />{t('farming_plans.irrigation')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.irrigationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="fertilization">
                  <AccordionTrigger className="text-base font-semibold"><FlaskConical className="mr-2 text-primary" />{t('farming_plans.fertilization')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.fertilizationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="pest-control">
                  <AccordionTrigger className="text-base font-semibold"><Bug className="mr-2 text-primary" />{t('farming_plans.pest_control')}</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.pestControlRecommendations}</AccordionContent>
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
