import { Header } from "@/components/dashboard/header";
import { WeatherAlertsForm } from "./weather-alerts-form";

export default function WeatherAlertsPage() {
  return (
    <>
      <Header>Weather & Pest Alerts</Header>
      <div className="flex-1 p-4 md:p-8">
        <WeatherAlertsForm />
      </div>
    </>
  );
}
