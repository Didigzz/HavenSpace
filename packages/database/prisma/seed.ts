import {
  PrismaClient,
  RoomStatus,
  PaymentStatus,
  PaymentType,
  UtilityType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Use environment variables for credentials (with secure defaults for development)
  const seedEmail = process.env.SEED_USER_EMAIL || "landlord@havenspace.com";
  const seedPassword =
    process.env.SEED_USER_PASSWORD || "HavenSpace2024!Secure";
  const seedName = process.env.SEED_USER_NAME || "John Landlord";

  // Create landlord user
  const hashedPassword = await bcrypt.hash(seedPassword, 12);

  const landlord = await prisma.user.upsert({
    where: { email: seedEmail },
    update: {},
    create: {
      email: seedEmail,
      name: seedName,
      password: hashedPassword,
      role: "LANDLORD",
    },
  });
  console.log("✅ Created landlord:", landlord.email);
  console.log("📝 Login credentials:");
  console.log(`   Email: ${seedEmail}`);
  console.log(`   Password: ${seedPassword}`);
  console.log(
    "⚠️  Change these in production! Set SEED_USER_EMAIL and SEED_USER_PASSWORD environment variables."
  );

  // Create rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { roomNumber: "101" },
      update: {},
      create: {
        roomNumber: "101",
        floor: 1,
        capacity: 2,
        monthlyRate: 5000,
        description: "Corner room with window",
        amenities: ["WiFi", "AC", "Private Bathroom"],
        status: RoomStatus.OCCUPIED,
      },
    }),
    prisma.room.upsert({
      where: { roomNumber: "102" },
      update: {},
      create: {
        roomNumber: "102",
        floor: 1,
        capacity: 1,
        monthlyRate: 3500,
        description: "Single room",
        amenities: ["WiFi", "Fan"],
        status: RoomStatus.AVAILABLE,
      },
    }),
    prisma.room.upsert({
      where: { roomNumber: "201" },
      update: {},
      create: {
        roomNumber: "201",
        floor: 2,
        capacity: 2,
        monthlyRate: 5500,
        description: "Large room with balcony",
        amenities: ["WiFi", "AC", "Balcony", "Private Bathroom"],
        status: RoomStatus.OCCUPIED,
      },
    }),
    prisma.room.upsert({
      where: { roomNumber: "202" },
      update: {},
      create: {
        roomNumber: "202",
        floor: 2,
        capacity: 1,
        monthlyRate: 3000,
        description: "Budget room",
        amenities: ["WiFi"],
        status: RoomStatus.MAINTENANCE,
      },
    }),
  ]);
  console.log("✅ Created rooms:", rooms.length);

  // Create boarders
  const boarder1 = await prisma.boarder.upsert({
    where: { email: "maria@example.com" },
    update: {},
    create: {
      firstName: "Maria",
      lastName: "Santos",
      email: "maria@example.com",
      phone: "09171234567",
      emergencyContact: "Juan Santos",
      emergencyPhone: "09181234567",
      moveInDate: new Date("2024-01-15"),
      isActive: true,
      accessCode: "MS2024",
      roomId: rooms[0].id,
    },
  });

  const boarder2 = await prisma.boarder.upsert({
    where: { email: "pedro@example.com" },
    update: {},
    create: {
      firstName: "Pedro",
      lastName: "Cruz",
      email: "pedro@example.com",
      phone: "09191234567",
      emergencyContact: "Ana Cruz",
      emergencyPhone: "09201234567",
      moveInDate: new Date("2024-02-01"),
      isActive: true,
      accessCode: "PC2024",
      roomId: rooms[2].id,
    },
  });
  console.log("✅ Created boarders");

  // Create payments
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        boarderId: boarder1.id,
        amount: 5000,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        dueDate: new Date("2024-02-01"),
        paidDate: new Date("2024-01-28"),
        receiptNumber: "RCP-2024-001",
        description: "February 2024 Rent",
      },
    }),
    prisma.payment.create({
      data: {
        boarderId: boarder1.id,
        amount: 5000,
        type: PaymentType.RENT,
        status: PaymentStatus.PENDING,
        dueDate: new Date("2024-03-01"),
        description: "March 2024 Rent",
      },
    }),
    prisma.payment.create({
      data: {
        boarderId: boarder2.id,
        amount: 5500,
        type: PaymentType.RENT,
        status: PaymentStatus.PAID,
        dueDate: new Date("2024-03-01"),
        paidDate: new Date("2024-02-25"),
        receiptNumber: "RCP-2024-002",
        description: "March 2024 Rent",
      },
    }),
  ]);
  console.log("✅ Created payments:", payments.length);

  // Create utility readings
  await Promise.all([
    prisma.utilityReading.create({
      data: {
        roomId: rooms[0].id,
        type: UtilityType.ELECTRICITY,
        previousReading: 1000,
        currentReading: 1150,
        ratePerUnit: 12.5,
        readingDate: new Date("2024-02-28"),
        billingPeriodStart: new Date("2024-02-01"),
        billingPeriodEnd: new Date("2024-02-29"),
      },
    }),
    prisma.utilityReading.create({
      data: {
        roomId: rooms[0].id,
        type: UtilityType.WATER,
        previousReading: 500,
        currentReading: 525,
        ratePerUnit: 35,
        readingDate: new Date("2024-02-28"),
        billingPeriodStart: new Date("2024-02-01"),
        billingPeriodEnd: new Date("2024-02-29"),
      },
    }),
  ]);
  console.log("✅ Created utility readings");

  // Create settings
  await prisma.setting.upsert({
    where: { key: "electricity_rate" },
    update: { value: "12.50" },
    create: { key: "electricity_rate", value: "12.50" },
  });
  await prisma.setting.upsert({
    where: { key: "water_rate" },
    update: { value: "35.00" },
    create: { key: "water_rate", value: "35.00" },
  });
  console.log("✅ Created settings");

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
