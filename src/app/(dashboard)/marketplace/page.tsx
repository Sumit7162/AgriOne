import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const products = [
  { ...PlaceHolderImages.find(img => img.id === "seeds")!, name: "Hybrid Maize Seeds", price: "₹250 / kg", category: "Seeds" },
  { ...PlaceHolderImages.find(img => img.id === "fertilizers")!, name: "NPK 20-20-20 Fertilizer", price: "₹1200 / 50kg bag", category: "Fertilizers" },
  { ...PlaceHolderImages.find(img => img.id === "pesticides")!, name: "Organic Neem Oil", price: "₹450 / litre", category: "Pesticides" },
  { ...PlaceHolderImages.find(img => img.id === "tools")!, name: "Steel Shovel", price: "₹300", category: "Tools" },
  { ...PlaceHolderImages.find(img => img.id === "organic-compost")!, name: "Vermicompost", price: "₹500 / 25kg", category: "Organic" },
  { ...PlaceHolderImages.find(img => img.id === "irrigation-system")!, name: "Drip Irrigation Kit", price: "₹3500", category: "Equipment" }
];

export default function MarketplacePage() {
  return (
    <>
      <Header>Marketplace</Header>
      <div className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
              <CardHeader className="p-0">
                <div className="relative aspect-video">
                   <Image src={product.imageUrl} alt={product.description} fill style={{objectFit: "cover"}} data-ai-hint={product.imageHint} />
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-grow">
                <Badge variant="outline" className="mb-2">{product.category}</Badge>
                <CardTitle className="font-headline text-lg mb-1">{product.name}</CardTitle>
                <CardDescription className="font-bold text-primary">{product.price}</CardDescription>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4"/>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
