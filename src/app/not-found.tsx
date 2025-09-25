
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-muted rounded-full p-4 w-fit">
            <SearchX className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-3xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            Sorry, we couldn&apos;t find the page you were looking for. It might have been moved, deleted, or you might have mistyped the URL.
          </CardDescription>
        </CardContent>
        <div className="p-6 pt-0">
          <Button asChild>
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
