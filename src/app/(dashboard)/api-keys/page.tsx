import { Header } from "@/components/dashboard/header";
import { ApiKeyGenerator } from "./api-key-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const apiEndpoints = [
  "Weather API",
  "Crop Health API",
  "Market Prices API",
  "Farm Operations API",
  "Insurance & Finance API"
];

export default function ApiKeysPage() {
  return (
    <>
      <Header>API Keys</Header>
      <div className="flex-1 p-4 md:p-8 space-y-8">
        <ApiKeyGenerator />

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Available APIs</CardTitle>
            <CardDescription>Your API key grants access to the following endpoints:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {apiEndpoints.map((api) => (
                <Badge key={api} variant="secondary" className="text-sm">
                  {api}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
