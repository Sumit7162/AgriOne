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

const initialState: FarmingPlanState = {};

export function FarmingPlansForm() {
  const [state, formAction] = useActionState(getFarmingPlan, initialState);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        <form action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline">AI Farming Advisor</CardTitle>
            <CardDescription>
              Provide details about your farm to receive a personalized plan for
              optimizing yield and reducing waste.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmDetails">Farm Details</Label>
              <Textarea
                id="farmDetails"
                name="farmDetails"
                placeholder="e.g., 5-acre farm in Punjab, sandy loam soil, temperate climate."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input
                id="cropType"
                name="cropType"
                placeholder="e.g., Wheat, Rice, Cotton"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentPractices">Current Practices</Label>
              <Textarea
                id="currentPractices"
                name="currentPractices"
                placeholder="e.g., Flood irrigation twice a week, manual pest control."
                rows={3}
              />
            </div>
            {state?.error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <SubmitButton className="w-full">
              <BotMessageSquare />
              Generate Plan
            </SubmitButton>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Personalized Farming Plan</CardTitle>
          <CardDescription>
            Your AI-generated recommendations will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state.advice ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Expected Yield Increase</CardTitle>
                        <Tractor className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{state.advice.expectedYieldIncrease}</div>
                    </CardContent>
                </Card>
                 <Card className="bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resource Waste Reduction</CardTitle>
                        <Percent className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary">{state.advice.resourceWasteReduction}</div>
                    </CardContent>
                </Card>
              </div>
              <Accordion type="single" collapsible defaultValue="irrigation" className="w-full">
                <AccordionItem value="irrigation">
                  <AccordionTrigger className="text-base font-semibold"><Droplets className="mr-2 text-primary" />Irrigation</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.irrigationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="fertilization">
                  <AccordionTrigger className="text-base font-semibold"><FlaskConical className="mr-2 text-primary" />Fertilization</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.fertilizationRecommendations}</AccordionContent>
                </AccordionItem>
                <AccordionItem value="pest-control">
                  <AccordionTrigger className="text-base font-semibold"><Bug className="mr-2 text-primary" />Pest Control</AccordionTrigger>
                  <AccordionContent className="text-base pl-2">{state.advice.pestControlRecommendations}</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] border rounded-md bg-muted/20 text-muted-foreground">
              <p>Awaiting your farm details...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
