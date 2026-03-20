// Mock data for the admin dashboard
// Replace with actual API calls in production

import type {
  Property,
  Room,
  Tenant,
  Payment,
  MaintenanceRequest,
  Expense,
  AuditLog,
  Notification,
  DashboardStats,
  RevenueData,
  OccupancyData,
} from "@/types";

// ============ PROPERTIES ============

export const mockProperties: Property[] = [
  {
    id: "prop-1",
    name: "Sunrise Boarding House",
    address: "123 Main Street",
    city: "Metro Manila",
    totalRooms: 20,
    occupiedRooms: 15,
    status: "active",
    monthlyRevenue: 150000,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "prop-2",
    name: "Oceanview Residence",
    address: "456 Beach Road",
    city: "Cebu City",
    totalRooms: 30,
    occupiedRooms: 28,
    status: "active",
    monthlyRevenue: 280000,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "prop-3",
    name: "Mountain Lodge",
    address: "789 Highland Ave",
    city: "Baguio City",
    totalRooms: 15,
    occupiedRooms: 10,
    status: "maintenance",
    monthlyRevenue: 95000,
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2026-01-28T00:00:00Z",
  },
];

// ============ ROOMS ============

export const mockRooms: Room[] = [
  {
    id: "room-1",
    propertyId: "prop-1",
    roomNumber: "101",
    floor: 1,
    capacity: 2,
    monthlyRate: 8000,
    description: "Corner room with window",
    amenities: ["WiFi", "Air Conditioning", "Private Bathroom"],
    status: "OCCUPIED",
    currentTenants: 2,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-2",
    propertyId: "prop-1",
    roomNumber: "102",
    floor: 1,
    capacity: 1,
    monthlyRate: 6000,
    description: "Single room",
    amenities: ["WiFi", "Fan", "Shared Bathroom"],
    status: "AVAILABLE",
    currentTenants: 0,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-3",
    propertyId: "prop-1",
    roomNumber: "103",
    floor: 1,
    capacity: 2,
    monthlyRate: 7500,
    description: "Standard double room",
    amenities: ["WiFi", "Fan", "Shared Bathroom"],
    status: "OCCUPIED",
    currentTenants: 1,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-4",
    propertyId: "prop-1",
    roomNumber: "201",
    floor: 2,
    capacity: 2,
    monthlyRate: 8500,
    description: "Premium room with balcony",
    amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Balcony"],
    status: "OCCUPIED",
    currentTenants: 2,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-5",
    propertyId: "prop-1",
    roomNumber: "202",
    floor: 2,
    capacity: 1,
    monthlyRate: 6500,
    description: "Single room with study desk",
    amenities: ["WiFi", "Air Conditioning", "Shared Bathroom", "Study Desk"],
    status: "MAINTENANCE",
    currentTenants: 0,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-6",
    propertyId: "prop-1",
    roomNumber: "203",
    floor: 2,
    capacity: 3,
    monthlyRate: 10000,
    description: "Triple room",
    amenities: ["WiFi", "Air Conditioning", "Private Bathroom"],
    status: "OCCUPIED",
    currentTenants: 3,
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-7",
    propertyId: "prop-2",
    roomNumber: "A101",
    floor: 1,
    capacity: 2,
    monthlyRate: 9000,
    description: "Sea view room",
    amenities: ["WiFi", "Air Conditioning", "Private Bathroom", "Sea View"],
    status: "OCCUPIED",
    currentTenants: 2,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "room-8",
    propertyId: "prop-2",
    roomNumber: "A102",
    floor: 1,
    capacity: 1,
    monthlyRate: 7000,
    description: "Cozy single room",
    amenities: ["WiFi", "Fan", "Shared Bathroom"],
    status: "AVAILABLE",
    currentTenants: 0,
    createdAt: "2024-03-20T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
];

// ============ TENANTS ============

export const mockTenants: Tenant[] = [
  {
    id: "tenant-1",
    propertyId: "prop-1",
    roomId: "room-1",
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan.delacruz@email.com",
    phone: "+63 912 345 6789",
    emergencyContact: "Maria Dela Cruz",
    emergencyPhone: "+63 912 345 6780",
    moveInDate: "2025-01-15T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-01-15T00:00:00Z",
    leaseEndDate: "2026-01-15T00:00:00Z",
    monthlyRent: 8000,
    depositAmount: 16000,
    depositPaid: true,
    balance: 0,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-2",
    propertyId: "prop-1",
    roomId: "room-1",
    firstName: "Maria",
    lastName: "Santos",
    email: "maria.santos@email.com",
    phone: "+63 923 456 7890",
    emergencyContact: "Pedro Santos",
    emergencyPhone: "+63 923 456 7891",
    moveInDate: "2025-02-01T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-02-01T00:00:00Z",
    leaseEndDate: "2026-02-01T00:00:00Z",
    monthlyRent: 8000,
    depositAmount: 16000,
    depositPaid: true,
    balance: 8000,
    createdAt: "2025-01-25T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-3",
    propertyId: "prop-1",
    roomId: "room-3",
    firstName: "Carlos",
    lastName: "Reyes",
    email: "carlos.reyes@email.com",
    phone: "+63 934 567 8901",
    moveInDate: "2025-03-15T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-03-15T00:00:00Z",
    monthlyRent: 7500,
    depositAmount: 15000,
    depositPaid: true,
    balance: 0,
    createdAt: "2025-03-10T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-4",
    propertyId: "prop-1",
    roomId: "room-4",
    firstName: "Ana",
    lastName: "Garcia",
    email: "ana.garcia@email.com",
    phone: "+63 945 678 9012",
    emergencyContact: "Jose Garcia",
    emergencyPhone: "+63 945 678 9013",
    moveInDate: "2024-11-01T00:00:00Z",
    isActive: true,
    leaseStartDate: "2024-11-01T00:00:00Z",
    leaseEndDate: "2025-11-01T00:00:00Z",
    monthlyRent: 8500,
    depositAmount: 17000,
    depositPaid: true,
    balance: 0,
    createdAt: "2024-10-25T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-5",
    propertyId: "prop-1",
    roomId: "room-4",
    firstName: "Rico",
    lastName: "Mendoza",
    email: "rico.mendoza@email.com",
    phone: "+63 956 789 0123",
    moveInDate: "2025-06-01T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-06-01T00:00:00Z",
    leaseEndDate: "2026-06-01T00:00:00Z",
    monthlyRent: 8500,
    depositAmount: 17000,
    depositPaid: false,
    balance: 25500,
    createdAt: "2025-05-25T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-6",
    propertyId: "prop-1",
    roomId: "room-6",
    firstName: "Sofia",
    lastName: "Cruz",
    email: "sofia.cruz@email.com",
    phone: "+63 967 890 1234",
    moveInDate: "2025-08-15T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-08-15T00:00:00Z",
    monthlyRent: 10000,
    depositAmount: 20000,
    depositPaid: true,
    balance: 10000,
    createdAt: "2025-08-10T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "tenant-7",
    propertyId: "prop-2",
    roomId: "room-7",
    firstName: "Miguel",
    lastName: "Torres",
    email: "miguel.torres@email.com",
    phone: "+63 978 901 2345",
    moveInDate: "2025-04-01T00:00:00Z",
    isActive: true,
    leaseStartDate: "2025-04-01T00:00:00Z",
    leaseEndDate: "2026-04-01T00:00:00Z",
    monthlyRent: 9000,
    depositAmount: 18000,
    depositPaid: true,
    balance: 0,
    createdAt: "2025-03-25T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
];

// ============ PAYMENTS ============

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    tenantName: "Juan Dela Cruz",
    roomNumber: "101",
    amount: 8000,
    type: "RENT",
    status: "PAID",
    dueDate: "2026-01-01T00:00:00Z",
    paidDate: "2025-12-28T00:00:00Z",
    receiptNumber: "RCP-2026-001",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2025-12-28T00:00:00Z",
  },
  {
    id: "pay-2",
    propertyId: "prop-1",
    tenantId: "tenant-2",
    tenantName: "Maria Santos",
    roomNumber: "101",
    amount: 8000,
    type: "RENT",
    status: "OVERDUE",
    dueDate: "2026-01-01T00:00:00Z",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "pay-3",
    propertyId: "prop-1",
    tenantId: "tenant-3",
    tenantName: "Carlos Reyes",
    roomNumber: "103",
    amount: 7500,
    type: "RENT",
    status: "PAID",
    dueDate: "2026-01-01T00:00:00Z",
    paidDate: "2026-01-01T00:00:00Z",
    receiptNumber: "RCP-2026-002",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "pay-4",
    propertyId: "prop-1",
    tenantId: "tenant-4",
    tenantName: "Ana Garcia",
    roomNumber: "201",
    amount: 8500,
    type: "RENT",
    status: "PENDING",
    dueDate: "2026-02-01T00:00:00Z",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "pay-5",
    propertyId: "prop-1",
    tenantId: "tenant-5",
    tenantName: "Rico Mendoza",
    roomNumber: "201",
    amount: 8500,
    type: "RENT",
    status: "OVERDUE",
    dueDate: "2026-01-01T00:00:00Z",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "pay-6",
    propertyId: "prop-1",
    tenantId: "tenant-5",
    tenantName: "Rico Mendoza",
    roomNumber: "201",
    amount: 17000,
    type: "DEPOSIT",
    status: "PENDING",
    dueDate: "2025-06-01T00:00:00Z",
    description: "Security deposit - 2 months",
    createdAt: "2025-05-25T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "pay-7",
    propertyId: "prop-1",
    tenantId: "tenant-6",
    tenantName: "Sofia Cruz",
    roomNumber: "203",
    amount: 10000,
    type: "RENT",
    status: "OVERDUE",
    dueDate: "2026-01-01T00:00:00Z",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "pay-8",
    propertyId: "prop-1",
    tenantId: "tenant-1",
    tenantName: "Juan Dela Cruz",
    roomNumber: "101",
    amount: 1500,
    type: "UTILITY",
    status: "PAID",
    dueDate: "2026-01-15T00:00:00Z",
    paidDate: "2026-01-10T00:00:00Z",
    description: "Electricity - December 2025",
    receiptNumber: "RCP-2026-003",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "pay-9",
    propertyId: "prop-2",
    tenantId: "tenant-7",
    tenantName: "Miguel Torres",
    roomNumber: "A101",
    amount: 9000,
    type: "RENT",
    status: "PAID",
    dueDate: "2026-01-01T00:00:00Z",
    paidDate: "2025-12-30T00:00:00Z",
    receiptNumber: "RCP-2026-004",
    createdAt: "2025-12-15T00:00:00Z",
    updatedAt: "2025-12-30T00:00:00Z",
  },
];

// ============ MAINTENANCE REQUESTS ============

export const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: "maint-1",
    propertyId: "prop-1",
    roomId: "room-5",
    roomNumber: "202",
    title: "Air conditioning unit not working",
    description:
      "The AC unit is making strange noises and not cooling properly",
    priority: "HIGH",
    status: "IN_PROGRESS",
    assignedTo: "Technician A",
    estimatedCost: 5000,
    scheduledDate: "2026-02-05T00:00:00Z",
    createdAt: "2026-01-25T00:00:00Z",
    updatedAt: "2026-01-28T00:00:00Z",
  },
  {
    id: "maint-2",
    propertyId: "prop-1",
    roomId: "room-1",
    roomNumber: "101",
    tenantId: "tenant-1",
    tenantName: "Juan Dela Cruz",
    title: "Leaky faucet in bathroom",
    description: "The bathroom faucet has been dripping constantly",
    priority: "MEDIUM",
    status: "PENDING",
    estimatedCost: 500,
    createdAt: "2026-01-30T00:00:00Z",
    updatedAt: "2026-01-30T00:00:00Z",
  },
  {
    id: "maint-3",
    propertyId: "prop-1",
    roomId: "room-3",
    roomNumber: "103",
    tenantId: "tenant-3",
    tenantName: "Carlos Reyes",
    title: "Door lock replacement",
    description: "Door lock is difficult to turn and needs replacement",
    priority: "HIGH",
    status: "PENDING",
    estimatedCost: 1500,
    createdAt: "2026-01-29T00:00:00Z",
    updatedAt: "2026-01-29T00:00:00Z",
  },
  {
    id: "maint-4",
    propertyId: "prop-1",
    roomId: "room-6",
    roomNumber: "203",
    tenantId: "tenant-6",
    tenantName: "Sofia Cruz",
    title: "Light bulb replacement",
    description: "Ceiling light bulb needs to be replaced",
    priority: "LOW",
    status: "COMPLETED",
    assignedTo: "Maintenance Staff",
    estimatedCost: 200,
    actualCost: 150,
    completedDate: "2026-01-28T00:00:00Z",
    createdAt: "2026-01-26T00:00:00Z",
    updatedAt: "2026-01-28T00:00:00Z",
  },
  {
    id: "maint-5",
    propertyId: "prop-2",
    roomId: "room-7",
    roomNumber: "A101",
    tenantId: "tenant-7",
    tenantName: "Miguel Torres",
    title: "Window won't close properly",
    description: "The bedroom window does not close completely, causing draft",
    priority: "MEDIUM",
    status: "PENDING",
    estimatedCost: 2000,
    createdAt: "2026-01-28T00:00:00Z",
    updatedAt: "2026-01-28T00:00:00Z",
  },
];

// ============ EXPENSES ============

export const mockExpenses: Expense[] = [
  {
    id: "exp-1",
    propertyId: "prop-1",
    category: "Utilities",
    description: "Electricity bill - January 2026",
    amount: 15000,
    date: "2026-01-20T00:00:00Z",
    vendor: "Meralco",
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "exp-2",
    propertyId: "prop-1",
    category: "Utilities",
    description: "Water bill - January 2026",
    amount: 5000,
    date: "2026-01-18T00:00:00Z",
    vendor: "Manila Water",
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-01-18T00:00:00Z",
  },
  {
    id: "exp-3",
    propertyId: "prop-1",
    category: "Maintenance",
    description: "Common area cleaning supplies",
    amount: 2500,
    date: "2026-01-15T00:00:00Z",
    vendor: "SM Supermarket",
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-15T00:00:00Z",
  },
  {
    id: "exp-4",
    propertyId: "prop-1",
    category: "Repairs",
    description: "Plumbing repair - 2nd floor bathroom",
    amount: 3500,
    date: "2026-01-10T00:00:00Z",
    vendor: "Quick Fix Plumbing",
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z",
  },
  {
    id: "exp-5",
    propertyId: "prop-1",
    category: "Insurance",
    description: "Property insurance - Q1 2026",
    amount: 25000,
    date: "2026-01-05T00:00:00Z",
    vendor: "Insular Life",
    createdAt: "2026-01-05T00:00:00Z",
    updatedAt: "2026-01-05T00:00:00Z",
  },
  {
    id: "exp-6",
    propertyId: "prop-2",
    category: "Utilities",
    description: "Internet service - January 2026",
    amount: 3000,
    date: "2026-01-22T00:00:00Z",
    vendor: "PLDT",
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
  },
];

// ============ AUDIT LOGS ============

export const mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    userId: "user-1",
    userName: "Admin User",
    action: "CREATE",
    resource: "Payment",
    resourceId: "pay-8",
    details: "Created utility payment for tenant Juan Dela Cruz",
    ipAddress: "192.168.1.100",
    timestamp: "2026-01-30T10:30:00Z",
  },
  {
    id: "log-2",
    userId: "user-1",
    userName: "Admin User",
    action: "UPDATE",
    resource: "Tenant",
    resourceId: "tenant-5",
    details: "Updated balance for tenant Rico Mendoza",
    ipAddress: "192.168.1.100",
    timestamp: "2026-01-30T09:15:00Z",
  },
  {
    id: "log-3",
    userId: "user-2",
    userName: "Manager User",
    action: "CREATE",
    resource: "MaintenanceRequest",
    resourceId: "maint-2",
    details: "Created maintenance request for room 101",
    ipAddress: "192.168.1.101",
    timestamp: "2026-01-30T08:45:00Z",
  },
  {
    id: "log-4",
    userId: "user-1",
    userName: "Admin User",
    action: "UPDATE",
    resource: "Room",
    resourceId: "room-5",
    details: "Changed room status to MAINTENANCE",
    ipAddress: "192.168.1.100",
    timestamp: "2026-01-29T16:20:00Z",
  },
  {
    id: "log-5",
    userId: "user-1",
    userName: "Admin User",
    action: "DELETE",
    resource: "Payment",
    resourceId: "pay-cancelled",
    details: "Cancelled payment for tenant test",
    ipAddress: "192.168.1.100",
    timestamp: "2026-01-29T14:00:00Z",
  },
];

// ============ NOTIFICATIONS ============

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Overdue Payment Alert",
    message: "3 tenants have overdue payments totaling ₱26,500",
    type: "warning",
    isRead: false,
    link: "/payments?status=overdue",
    createdAt: "2026-01-30T08:00:00Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Lease Expiring Soon",
    message: "Juan Dela Cruz's lease expires in 15 days",
    type: "info",
    isRead: false,
    link: "/tenants/tenant-1",
    createdAt: "2026-01-30T07:00:00Z",
  },
  {
    id: "notif-3",
    userId: "user-1",
    title: "New Maintenance Request",
    message: "New high priority maintenance request for room 103",
    type: "warning",
    isRead: true,
    link: "/maintenance/maint-3",
    createdAt: "2026-01-29T16:00:00Z",
  },
  {
    id: "notif-4",
    userId: "user-1",
    title: "Payment Received",
    message: "Payment of ₱9,000 received from Miguel Torres",
    type: "success",
    isRead: true,
    link: "/payments/pay-9",
    createdAt: "2025-12-30T10:00:00Z",
  },
];

// ============ DASHBOARD STATS ============

export function getDashboardStats(propertyId?: string): DashboardStats {
  const filteredRooms = propertyId
    ? mockRooms.filter((r) => r.propertyId === propertyId)
    : mockRooms;
  const filteredTenants = propertyId
    ? mockTenants.filter((t) => t.propertyId === propertyId)
    : mockTenants;
  const filteredPayments = propertyId
    ? mockPayments.filter((p) => p.propertyId === propertyId)
    : mockPayments;
  const filteredMaintenance = propertyId
    ? mockMaintenanceRequests.filter((m) => m.propertyId === propertyId)
    : mockMaintenanceRequests;

  const occupiedRooms = filteredRooms.filter(
    (r) => r.status === "OCCUPIED"
  ).length;
  const availableRooms = filteredRooms.filter(
    (r) => r.status === "AVAILABLE"
  ).length;
  const maintenanceRooms = filteredRooms.filter(
    (r) => r.status === "MAINTENANCE"
  ).length;

  const paidPayments = filteredPayments.filter((p) => p.status === "PAID");
  const monthlyRevenue = paidPayments
    .filter((p) => new Date(p.paidDate!).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);

  const outstandingPayments = filteredPayments
    .filter((p) => p.status === "PENDING" || p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);

  const overduePayments = filteredPayments
    .filter((p) => p.status === "OVERDUE")
    .reduce((sum, p) => sum + p.amount, 0);

  const expiringSoonLeases = filteredTenants.filter((t) => {
    if (!t.leaseEndDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(t.leaseEndDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  }).length;

  return {
    totalProperties: propertyId ? 1 : mockProperties.length,
    totalRooms: filteredRooms.length,
    occupiedRooms,
    availableRooms,
    maintenanceRooms,
    occupancyRate:
      filteredRooms.length > 0
        ? Math.round((occupiedRooms / filteredRooms.length) * 100)
        : 0,
    totalTenants: filteredTenants.length,
    activeTenants: filteredTenants.filter((t) => t.isActive).length,
    monthlyRevenue,
    yearlyRevenue: monthlyRevenue * 12,
    outstandingPayments,
    overduePayments,
    pendingMaintenance: filteredMaintenance.filter(
      (m) => m.status === "PENDING"
    ).length,
    expiringSoonLeases,
  };
}

// ============ CHART DATA ============

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getRevenueData(propertyId?: string): RevenueData[] {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  return months.map((month) => ({
    month,
    revenue: 100000 + Math.random() * 80000,
    expenses: 30000 + Math.random() * 25000,
    profit: 50000 + Math.random() * 40000,
  }));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getOccupancyData(propertyId?: string): OccupancyData[] {
  const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];

  return months.map((month) => ({
    month,
    occupied: Math.floor(15 + Math.random() * 10),
    available: Math.floor(3 + Math.random() * 5),
    maintenance: Math.floor(Math.random() * 3),
  }));
}

// ============ DATA FILTERING HELPERS ============

export function getRoomsByProperty(propertyId: string): Room[] {
  return mockRooms.filter((r) => r.propertyId === propertyId);
}

export function getTenantsByProperty(propertyId: string): Tenant[] {
  return mockTenants.filter((t) => t.propertyId === propertyId);
}

export function getPaymentsByProperty(propertyId: string): Payment[] {
  return mockPayments.filter((p) => p.propertyId === propertyId);
}

export function getMaintenanceByProperty(
  propertyId: string
): MaintenanceRequest[] {
  return mockMaintenanceRequests.filter((m) => m.propertyId === propertyId);
}

export function getExpensesByProperty(propertyId: string): Expense[] {
  return mockExpenses.filter((e) => e.propertyId === propertyId);
}
