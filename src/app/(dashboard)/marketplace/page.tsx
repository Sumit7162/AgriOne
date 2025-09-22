"use client";

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/context/language-context";

export default function MarketplacePage() {
  const { t } = useTranslation();
  
  const products = [
    { ...PlaceHolderImages.find(img => img.id === "seeds")!, name: t('marketplace.product1_name'), price: t('marketplace.product1_price'), category: t('marketplace.category_seeds') },
    { ...PlaceHolderImages.find(img => img.id === "fertilizers")!, name: t('marketplace.product2_name'), price: t('marketplace.product2_price'), category: t('marketplace.category_fertilizers') },
    { ...PlaceHolderImages.find(img => img.id === "pesticides")!, name: t('marketplace.product3_name'), price: t('marketplace.product3_price'), category: t('marketplace.category_pesticides') },
    { ...PlaceHolderImages.find(img => img.id === "tools")!, name: t('marketplace.product4_name'), price: t('marketplace.product4_price'), category: t('marketplace.category_tools') },
    { ...PlaceHolderImages.find(img => img.id === "organic-compost")!, name: t('marketplace.product5_name'), price: t('marketplace.product5_price'), category: t('marketplace.category_organic') },
    { ...PlaceHolderImages.find(img => img.id === "irrigation-system")!, name: t('marketplace.product6_name'), price: t('marketplace.product6_price'), category: t('marketplace.category_equipment') }
  ];

  return (
    <>
      <Header>{t('marketplace.title')}</Header>
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
                  {t('marketplace.add_to_cart_button')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
