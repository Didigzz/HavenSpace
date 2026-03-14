import Link from "next/link";
import { Button } from "@havenspace/ui";
import {
  Search,
  MapPin,
  Shield,
  Clock,
  Home,
  Users,
  Star,
  ArrowRight,
  Building2,
} from "lucide-react";
import { SearchFilters } from "@/components/listings";
import { ListingCard } from "@/components/listings";
import { getFeaturedListings, getRecentListings } from "@/lib/mock-data";

export default function HomePage() {
  const featuredListings = getFeaturedListings();
  const recentListings = getRecentListings();

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Find Your Perfect{" "}
              <span className="text-primary">Boarding House</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Discover affordable and comfortable boarding houses near you. Browse
              listings, compare prices, and find your ideal accommodation today.
            </p>

            {/* Search Bar */}
            <div className="mt-10 flex justify-center">
              <SearchFilters compact />
            </div>

            {/* Quick Stats */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Boarding Houses
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2,000+</div>
                <div className="text-sm text-muted-foreground">Happy Boarders</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Why Choose Us?</h2>
            <p className="mt-4 text-muted-foreground">
              We make finding your perfect boarding house simple and hassle-free
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Easy Search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Find boarding houses by location, price, and amenities with our
                powerful search
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Verified Listings</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                All our listings are verified to ensure quality and
                trustworthiness
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Map View</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Explore boarding houses on an interactive map to find the perfect
                location
              </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">Quick Booking</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Contact landlords directly and secure your room with ease
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-muted/40 py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Listings</h2>
              <p className="mt-2 text-muted-foreground">
                Top-rated boarding houses recommended for you
              </p>
            </div>
            <Link href="/listings?sort=rating">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Listings */}
      <section className="py-20">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Recently Added</h2>
              <p className="mt-2 text-muted-foreground">
                New boarding houses just listed on our platform
              </p>
            </div>
            <Link href="/listings?sort=newest">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Become a Landlord */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Building2 className="mx-auto h-12 w-12" />
            <h2 className="mt-6 text-3xl font-bold">
              Own a Boarding House? List It Here!
            </h2>
            <p className="mt-4 text-primary-foreground/80">
              Join hundreds of landlords who trust our platform to manage their
              boarding houses. Get access to our tenant management tools, online
              payments, and reach thousands of potential boarders.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/become-landlord">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2"
                >
                  <Home className="h-5 w-5" />
                  Become a Landlord
                </Button>
              </Link>
              <Link href="/landlord-info">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold">What Our Users Say</h2>
            <p className="mt-4 text-muted-foreground">
              Hear from boarders and landlords who use our platform
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">
                "Found my perfect boarding house within a day! The search filters
                made it so easy to find exactly what I was looking for."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">Anna Garcia</div>
                  <div className="text-sm text-muted-foreground">
                    Student, Manila
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">
                "As a landlord, this platform has made managing my boarding house
                so much easier. Highly recommended!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">Pedro Reyes</div>
                  <div className="text-sm text-muted-foreground">
                    Landlord, Quezon City
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-4 text-muted-foreground">
                "The map feature helped me find a boarding house close to my
                workplace. Great platform!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div>
                  <div className="font-medium">Lisa Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Professional, Makati
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
