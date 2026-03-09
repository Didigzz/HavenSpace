import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@bhms/database";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
  password: z.string().min(8),
  role: z.enum(["BOARDER", "LANDLORD"]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email, phone, password, role } = validationResult.data;

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Determine status based on role
    // Boarders are auto-approved, Landlords need admin approval
    const status = role === "BOARDER" ? "APPROVED" : "PENDING";

    // Create user with transaction to also create role-specific profile
    const user = await db.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role,
          status,
        },
      });

      // Create role-specific profile
      if (role === "BOARDER") {
        const [firstName, lastName] = name.split(" ");
        await tx.boarder.create({
          data: {
            userId: newUser.id,
            firstName: firstName || name,
            lastName: lastName || "",
            email,
          },
        });
      } else if (role === "LANDLORD") {
        await tx.landlordProfile.create({
          data: {
            userId: newUser.id,
          },
        });
      }

      return newUser;
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
