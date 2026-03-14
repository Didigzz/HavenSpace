import Link from "next/link";
import { Button } from "@havenspace/ui";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-muted-foreground/30">404</h1>
        <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
        <p className="mt-2 text-muted-foreground max-w-md">
          Sorry, we couldn't find the page you're looking for. It might have
          been removed or the URL might be incorrect.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/listings">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
