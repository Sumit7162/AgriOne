import { Header } from "@/components/dashboard/header";
import { FarmingPlansForm } from "./farming-plans-form";

export default function FarmingPlansPage() {
  return (
    <>
      <Header>Personalized Farming Plans</Header>
      <div className="flex-1 p-4 md:p-8">
        <FarmingPlansForm />
      </div>
    </>
  );
}
