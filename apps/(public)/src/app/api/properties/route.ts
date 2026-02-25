import { NextResponse } from "next/server";
import { mockBoardingHouses } from "@/lib/mock-data";

// GET /api/properties - Fetch all published/available properties for the tenant map
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase();
    const availableOnly = searchParams.get("availableOnly") === "true";

    let properties = mockBoardingHouses;

    // Filter to only available properties (availableRooms > 0) when requested
    if (availableOnly) {
      properties = properties.filter((p) => p.availableRooms > 0);
    }

    // Search filter
    if (query) {
      properties = properties.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.address.toLowerCase().includes(query) ||
          p.city.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      data: properties,
      total: properties.length,
    });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
