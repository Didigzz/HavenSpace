import { NextResponse } from "next/server";
import { db } from "@havenspace/database";

// GET /api/properties - Fetch all published/available properties for the tenant map
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase();
    const availableOnly = searchParams.get("availableOnly") === "true";

    // Fetch properties from database
    const where: any = {
      isPublished: true,
    };

    if (availableOnly) {
      where.availableRooms = { gt: 0 };
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { address: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
      ];
    }

    const properties = await db.property.findMany({
      where,
      select: {
        id: true,
        name: true,
        address: true,
        city: true,
        description: true,
        monthlyRent: true,
        amenities: true,
        images: true,
        latitude: true,
        longitude: true,
        availableRooms: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

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
