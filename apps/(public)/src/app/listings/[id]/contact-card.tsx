"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@havenspace/ui";
import { Phone, Mail, MessageCircle, Calendar, User } from "lucide-react";
import { BoardingHouse } from "@/lib/types";

interface ContactCardProps {
  listing: BoardingHouse;
}

export function ContactCard({ listing }: ContactCardProps) {
  return (
    <div className="sticky top-24 space-y-6">
      {/* Contact Card */}
      <div className="rounded-xl border bg-card p-6 shadow-lg">
        <h3 className="text-lg font-semibold">Interested in this place?</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Contact the landlord to schedule a visit or ask questions
        </p>

        {/* Landlord Info */}
        {listing.landlord && (
          <div className="mt-6 flex items-center gap-4 rounded-lg border p-4">
            {listing.landlord.image ? (
              <Image
                src={listing.landlord.image}
                alt={listing.landlord.name}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
            )}
            <div>
              <div className="font-medium">{listing.landlord.name}</div>
              <div className="text-sm text-muted-foreground">Property Owner</div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <Link href="/login" className="block">
            <Button className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Send Message
            </Button>
          </Link>

          {listing.landlord?.phone && (
            <a href={`tel:${listing.landlord.phone}`}>
              <Button variant="outline" className="w-full gap-2">
                <Phone className="h-4 w-4" />
                Call Landlord
              </Button>
            </a>
          )}

          <Link href="/login">
            <Button variant="outline" className="w-full gap-2">
              <Calendar className="h-4 w-4" />
              Request a Visit
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Sign in to contact the landlord and request bookings
        </p>
      </div>

      {/* Safety Tips */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <h4 className="font-medium text-sm">Safety Tips</h4>
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          <li>• Always visit the property in person before making a decision</li>
          <li>• Never send money without seeing the place first</li>
          <li>• Ask for a proper contract or agreement</li>
          <li>• Verify the landlord's identity</li>
        </ul>
      </div>
    </div>
  );
}
