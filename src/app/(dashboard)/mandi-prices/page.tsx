import { Header } from "@/components/dashboard/header";
import { MandiPricesForm } from "./mandi-prices-form";

export default function MandiPricesPage() {
  return (
    <>
      <Header>Mandi Prices</Header>
      <div className="flex-1 p-4 md:p-8">
        <MandiPricesForm />
      </div>
    </>
  );
}
