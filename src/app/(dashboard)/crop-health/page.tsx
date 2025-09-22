import { Header } from "@/components/dashboard/header";
import { CropHealthForm } from "./crop-health-form";

export default function CropHealthPage() {
  return (
    <>
      <Header>Crop Health</Header>
      <div className="flex-1 p-4 md:p-8">
        <CropHealthForm />
      </div>
    </>
  );
}
