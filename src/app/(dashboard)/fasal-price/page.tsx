import { Header } from "@/components/dashboard/header";
import { FasalPriceForm } from "./fasal-price-form";

export default function FasalPricePage() {
  return (
    <>
      <Header>Commodity Prices</Header>
      <div className="flex-1 p-4 md:p-8">
        <FasalPriceForm />
      </div>
    </>
  );
}
