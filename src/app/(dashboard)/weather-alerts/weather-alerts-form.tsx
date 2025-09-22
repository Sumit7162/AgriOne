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
import { BellRing, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Siren, Snowflake, Sun, Thermometer, Wind } from "lucide-react";

const initialState: WeatherAlertState = {};

export function WeatherAlertsForm() {
  const [state, formAction] = useActionState(getWeatherAlerts, initialState);

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card>
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="font-headline">Get Pest & Disease Alerts</CardTitle>
              <CardDescription>
                Enter your location and crop to get AI-powered predictive alerts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g., Chandigarh, India"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type</Label>
                <Input
                  id="cropType"
                  name="cropType"
                  placeholder="e.g., Maize"
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
                <BellRing />
                Get Alerts
              </SubmitButton>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Alerts & Forecast</CardTitle>
            <CardDescription>
              {state.location && state.cropType ? `Showing alerts for ${state.cropType} in ${state.location}` : "Weather information and alerts will be displayed here."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2 font-headline"><Siren className="text-destructive"/>Predictive Alerts</h3>
                {state.alerts && state.alerts.length > 0 ? (
                    <ul className="space-y-2 list-disc pl-5">
                        {state.alerts.map((alert, index) => (
                            <li key={index} className="text-destructive-foreground bg-destructive/80 p-3 rounded-md">{alert}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center justify-center h-24 border rounded-md bg-muted/20 text-muted-foreground">
                        <p>{state.location ? 'No immediate threats detected.' : 'Submit details to see alerts.'}</p>
                    </div>
                )}
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-4 font-headline flex items-center gap-2"><CloudSun/>Hyperlocal Weather</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <Card className="p-4 bg-card/50">
                        <Thermometer className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">28°C</p>
                        <p className="text-muted-foreground text-sm">Temperature</p>
                    </Card>
                    <Card className="p-4 bg-card/50">
                        <Wind className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">12 km/h</p>
                        <p className="text-muted-foreground text-sm">Wind</p>
                    </Card>
                    <Card className="p-4 bg-card/50">
                        <CloudDrizzle className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">78%</p>
                        <p className="text-muted-foreground text-sm">Humidity</p>
                    </Card>
                     <Card className="p-4 bg-card/50">
                        <CloudRain className="mx-auto h-8 w-8 text-primary mb-2"/>
                        <p className="font-bold text-xl">15%</p>
                        <p className="text-muted-foreground text-sm">Precipitation</p>
                    </Card>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
