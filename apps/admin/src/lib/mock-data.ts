// Mock data types
import type { PropertyImage, PropertyAmenity, PropertyRule } from "@/types";

export interface MockProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  status: "active" | "inactive" | "maintenance";
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  managerName?: string;
  parkingSpaces?: number;
  parkingType?: "none" | "free" | "paid";
  parkingRate?: number;
  amenities?: string[];
  imageCount?: number;
  images?: string[];
  location?: { latitude: number; longitude: number; address?: string };
  rules?: { id: string; title: string; description: string; icon?: string }[];
  nearbyLandmarks?: string[];
  publicTransport?: string[];
  totalRooms?: number;
  occupiedRooms?: number;
  monthlyRevenue?: number;
  minRent?: number;
  maxRent?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MockRoom {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: number;
  status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
  description?: string;
  amenities?: string[];
  currentTenants?: MockTenant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MockTenant {
  id: string;
  propertyId: string;
  roomId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  moveInDate: string;
  moveOutDate?: string;
  monthlyRent?: number;
  depositAmount?: number;
  balance?: number;
}

export interface MockPayment {
  id: string;
  propertyId: string;
  tenantId: string;
  amount: number;
  type: "RENT" | "UTILITY" | "DEPOSIT" | "OTHER";
  status: "PENDING" | "PAID" | "OVERDUE";
  dueDate: string;
  paidDate?: string;
  description?: string;
  paymentMethod?: "CASH" | "BANK_TRANSFER" | "GCASH" | "OTHER";
}

export interface MockExpense {
  id: string;
  propertyId: string;
  category:
    | "UTILITIES"
    | "MAINTENANCE"
    | "SUPPLIES"
    | "SALARY"
    | "TAXES"
    | "INSURANCE"
    | "OTHER";
  amount: number;
  description: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  vendor?: string;
}

export interface MockMaintenanceRequest {
  id: string;
  propertyId: string;
  roomId?: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  category:
    | "PLUMBING"
    | "ELECTRICAL"
    | "HVAC"
    | "APPLIANCE"
    | "STRUCTURAL"
    | "OTHER";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  estimatedCost?: number;
  assignedTo?: string;
}

export interface MockRevenueData {
  month: string;
  revenue: number;
  expenses: number;
}

// Mock data
export const mockProperties: MockProperty[] = [
  {
    id: "prop-1",
    name: "Sunrise Boarding House",
    address: "123 Main Street",
    city: "Manila",
    status: "active",
    description: "A cozy boarding house near the university",
    contactEmail: "contact@sunrise.com",
    contactPhone: "+63 912 345 6789",
    managerName: "Juan Dela Cruz",
    parkingSpaces: 5,
    parkingType: "paid",
    parkingRate: 500,
    amenities: ["WiFi", "CCTV", "Laundry"],
    imageCount: 12,
    images: ["/images/prop1-1.jpg", "/images/prop1-2.jpg"],
    location: {
      latitude: 14.5995,
      longitude: 120.9842,
      address: "123 Main Street, Manila",
    },
    rules: [
      {
        id: "rule-1",
        title: "No Smoking",
        description: "Smoking is not allowed inside the premises",
        icon: "🚭",
      },
      {
        id: "rule-2",
        title: "Quiet Hours",
        description: "Quiet hours from 10 PM to 6 AM",
        icon: "🤫",
      },
    ],
    nearbyLandmarks: [
      "University of the Philippines - 0.5 km",
      "SM City Manila - 1.2 km",
    ],
    publicTransport: ["Jeepney Stop", "LRT Central Station"],
    totalRooms: 20,
    occupiedRooms: 15,
    monthlyRevenue: 125000,
    minRent: 4000,
    maxRent: 8000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-01T00:00:00Z",
  },
  {
    id: "prop-2",
    name: "Moonlight Residences",
    address: "456 Oak Avenue",
    city: "Quezon City",
    status: "active",
    description: "Modern boarding house with excellent amenities",
    contactEmail: "info@moonlight.com",
    contactPhone: "+63 923 456 7890",
    managerName: "Maria Santos",
    parkingSpaces: 10,
    parkingType: "free",
    parkingRate: 0,
    amenities: ["WiFi", "Pool", "Gym"],
    imageCount: 8,
    images: ["/images/prop2-1.jpg", "/images/prop2-2.jpg"],
    location: {
      latitude: 14.676,
      longitude: 121.0437,
      address: "456 Oak Avenue, Quezon City",
    },
    rules: [
      {
        id: "rule-3",
        title: "No Pets",
        description: "Pets are not allowed",
        icon: "🚫",
      },
      {
        id: "rule-4",
        title: "Visitor Policy",
        description: "Visitors allowed until 9 PM",
        icon: "👥",
      },
    ],
    nearbyLandmarks: [
      "Ayala Malls - 0.3 km",
      "Quezon City Medical Center - 0.8 km",
    ],
    publicTransport: ["Bus Stop", "MRT North Station"],
    totalRooms: 30,
    occupiedRooms: 28,
    monthlyRevenue: 210000,
    minRent: 6000,
    maxRent: 10000,
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-11-05T00:00:00Z",
  },
  {
    id: "prop-3",
    name: "Garden View Apartments",
    address: "789 Pine Road",
    city: "Makati",
    status: "maintenance",
    description: "Apartments with beautiful garden views",
    contactEmail: "support@gardenview.com",
    contactPhone: "+63 934 567 8901",
    managerName: "Pedro Reyes",
    parkingSpaces: 3,
    parkingType: "none",
    parkingRate: 0,
    amenities: ["WiFi", "Garden"],
    imageCount: 6,
    images: ["/images/prop3-1.jpg"],
    location: {
      latitude: 14.5547,
      longitude: 121.0244,
      address: "789 Pine Road, Makati",
    },
    rules: [
      {
        id: "rule-5",
        title: "Garden Hours",
        description: "Garden access from 6 AM to 8 PM",
        icon: "🌳",
      },
    ],
    nearbyLandmarks: [
      "Glorietta Mall - 0.4 km",
      "Makati Medical Center - 1.0 km",
    ],
    publicTransport: ["Jeepney Terminal"],
    totalRooms: 15,
    occupiedRooms: 10,
    monthlyRevenue: 75000,
    minRent: 5000,
    maxRent: 9000,
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-10-20T00:00:00Z",
  },
];

export const mockRooms: MockRoom[] = [
  {
    id: "room-1",
    propertyId: "prop-1",
    roomNumber: "101",
    floor: 1,
    capacity: 2,
    monthlyRate: 5000,
    status: "OCCUPIED",
    description: "Standard room with shared bathroom",
    amenities: ["Bed", "Desk", "Closet"],
    currentTenants: [
      {
        id: "tenant-1",
        propertyId: "prop-1",
        roomId: "room-1",
        firstName: "Ana",
        lastName: "Garcia",
        name: "Ana Garcia",
        email: "ana.garcia@email.com",
        phone: "+63 945 678 9012",
        isActive: true,
        moveInDate: "2024-01-15",
        monthlyRent: 5000,
        depositAmount: 5000,
        balance: 0,
      },
      {
        id: "tenant-2",
        propertyId: "prop-1",
        roomId: "room-1",
        firstName: "Luis",
        lastName: "Rodriguez",
        name: "Luis Rodriguez",
        email: "luis.r@email.com",
        phone: "+63 956 789 0123",
        isActive: true,
        moveInDate: "2024-01-15",
        monthlyRent: 5000,
        depositAmount: 5000,
        balance: 0,
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "room-2",
    propertyId: "prop-1",
    roomNumber: "102",
    floor: 1,
    capacity: 1,
    monthlyRate: 4000,
    status: "AVAILABLE",
    description: "Single room with window",
    amenities: ["Bed", "Desk"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "room-3",
    propertyId: "prop-1",
    roomNumber: "201",
    floor: 2,
    capacity: 2,
    monthlyRate: 6000,
    status: "MAINTENANCE",
    description: "Deluxe room with private bathroom",
    amenities: ["Bed", "Desk", "Closet", "AC"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-11-20T00:00:00Z",
  },
  {
    id: "room-4",
    propertyId: "prop-2",
    roomNumber: "301",
    floor: 3,
    capacity: 2,
    monthlyRate: 7000,
    status: "OCCUPIED",
    description: "Premium room with city view",
    amenities: ["Bed", "Desk", "Closet", "AC", "Mini Fridge"],
    currentTenants: [
      {
        id: "tenant-3",
        propertyId: "prop-2",
        roomId: "room-4",
        firstName: "Sofia",
        lastName: "Martinez",
        name: "Sofia Martinez",
        email: "sofia.m@email.com",
        phone: "+63 967 890 1234",
        isActive: true,
        moveInDate: "2024-03-01",
        monthlyRent: 7000,
        depositAmount: 7000,
        balance: 0,
      },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-03-01T00:00:00Z",
  },
];

export const mockTenants: MockTenant[] = [
  {
    id: "tenant-1",
    propertyId: "prop-1",
    roomId: "room-1",
    firstName: "Ana",
    lastName: "Garcia",
    name: "Ana Garcia",
    email: "ana.garcia@email.com",
    phone: "+63 945 678 9012",
    isActive: true,
    moveInDate: "2024-01-15",
    monthlyRent: 5000,
    depositAmount: 5000,
    balance: 0,
  },
  {
    id: "tenant-2",
    propertyId: "prop-1",
    roomId: "room-1",
    firstName: "Luis",
    lastName: "Rodriguez",
    name: "Luis Rodriguez",
    email: "luis.r@email.com",
    phone: "+63 956 789 0123",
    isActive: true,
    moveInDate: "2024-01-15",
    monthlyRent: 5000,
    depositAmount: 5000,
    balance: 0,
  },
  {
    id: "tenant-3",
    propertyId: "prop-2",
    roomId: "room-4",
    firstName: "Sofia",
    lastName: "Martinez",
    name: "Sofia Martinez",
    email: "sofia.m@email.com",
    phone: "+63 967 890 1234",
    isActive: true,
    moveInDate: "2024-03-01",
    monthlyRent: 7000,
    depositAmount: 7000,
    balance: 0,
  },
];

export const mockPayments: MockPayment[] = [
  {
    id: "payment-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    amount: 5000,
    type: "RENT",
    status: "PAID",
    dueDate: "2024-12-01",
    paidDate: "2024-11-28",
    paymentMethod: "GCASH",
  },
  {
    id: "payment-2",
    propertyId: "prop-1",
    tenantId: "tenant-2",
    amount: 5000,
    type: "RENT",
    status: "PENDING",
    dueDate: "2024-12-01",
    paymentMethod: "BANK_TRANSFER",
  },
  {
    id: "payment-3",
    propertyId: "prop-2",
    tenantId: "tenant-3",
    amount: 7000,
    type: "RENT",
    status: "PAID",
    dueDate: "2024-12-01",
    paidDate: "2024-11-30",
    paymentMethod: "CASH",
  },
];

export const mockExpenses: MockExpense[] = [
  {
    id: "expense-1",
    propertyId: "prop-1",
    category: "UTILITIES",
    amount: 3500,
    description: "Electricity bill - November",
    date: "2024-11-15",
    status: "APPROVED",
  },
  {
    id: "expense-2",
    propertyId: "prop-1",
    category: "MAINTENANCE",
    amount: 2000,
    description: "Plumbing repair - Room 201",
    date: "2024-11-20",
    status: "APPROVED",
  },
  {
    id: "expense-3",
    propertyId: "prop-2",
    category: "SUPPLIES",
    amount: 1500,
    description: "Cleaning supplies",
    date: "2024-11-25",
    status: "PENDING",
  },
];

export const mockMaintenanceRequests: MockMaintenanceRequest[] = [
  {
    id: "maint-1",
    propertyId: "prop-1",
    roomId: "room-3",
    title: "Leaking faucet",
    description: "Bathroom faucet is leaking",
    priority: "MEDIUM",
    category: "PLUMBING",
    status: "IN_PROGRESS",
    createdAt: "2024-11-20",
    estimatedCost: 1500,
  },
  {
    id: "maint-2",
    propertyId: "prop-1",
    title: "AC not cooling",
    description: "Air conditioning unit in Room 201 not cooling properly",
    priority: "HIGH",
    category: "HVAC",
    status: "PENDING",
    createdAt: "2024-11-22",
    estimatedCost: 5000,
  },
];

export const propertyAmenities = [
  "WiFi",
  "CCTV Security",
  "Laundry Facilities",
  "Parking",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Pool",
  "Gym",
  "Garden",
  "Common Area",
  "Study Room",
  "Bike Storage",
  "Pet Friendly",
  "24/7 Access",
  "Elevator",
];

// Filter functions
export function getRoomsByProperty(propertyId: string): MockRoom[] {
  return mockRooms.filter((r) => r.propertyId === propertyId);
}

export function getTenantsByProperty(propertyId: string): MockTenant[] {
  return mockTenants.filter((t) => t.propertyId === propertyId);
}

export function getPaymentsByProperty(propertyId: string): MockPayment[] {
  return mockPayments.filter((p) => p.propertyId === propertyId);
}

export function getExpensesByProperty(propertyId: string): MockExpense[] {
  return mockExpenses.filter((e) => e.propertyId === propertyId);
}

export function getMaintenanceByProperty(
  propertyId: string
): MockMaintenanceRequest[] {
  return mockMaintenanceRequests.filter((m) => m.propertyId === propertyId);
}

// Revenue data generator
export function getRevenueData(propertyId?: string): MockRevenueData[] {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month, index) => {
    const baseRevenue = propertyId ? 15000 : 45000;
    const baseExpenses = propertyId ? 5000 : 15000;
    const variation = Math.random() * 0.3 + 0.85;

    return {
      month,
      revenue: Math.round(baseRevenue * variation),
      expenses: Math.round(baseExpenses * variation),
    };
  });
}
