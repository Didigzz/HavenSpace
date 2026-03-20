// Admin dashboard types

// ============ ENUMS ============

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";

export type PaymentStatus = "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";

export type PaymentType = "RENT" | "UTILITY" | "DEPOSIT" | "OTHER";

export type MaintenanceStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// ============ BASE TYPES ============

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  totalRooms: number;
  occupiedRooms: number;
  status: "active" | "inactive" | "maintenance";
  monthlyRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  propertyIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: number;
  description?: string;
  amenities: string[];
  status: RoomStatus;
  currentTenants: number;
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  propertyId: string;
  roomId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  moveInDate: string;
  moveOutDate?: string;
  isActive: boolean;
  leaseStartDate: string;
  leaseEndDate?: string;
  monthlyRent: number;
  depositAmount: number;
  depositPaid: boolean;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  propertyId: string;
  tenantId: string;
  tenantName: string;
  roomNumber: string;
  amount: number;
  type: PaymentType;
  status: PaymentStatus;
  dueDate: string;
  paidDate?: string;
  description?: string;
  receiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceRequest {
  id: string;
  propertyId: string;
  roomId: string;
  roomNumber: string;
  tenantId?: string;
  tenantName?: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  assignedTo?: string;
  estimatedCost?: number;
  actualCost?: number;
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  propertyId: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// ============ DASHBOARD STATS ============

export interface DashboardStats {
  totalProperties: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  occupancyRate: number;
  totalTenants: number;
  activeTenants: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  outstandingPayments: number;
  overduePayments: number;
  pendingMaintenance: number;
  expiringSoonLeases: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface OccupancyData {
  month: string;
  occupied: number;
  available: number;
  maintenance: number;
}

export interface PaymentDistribution {
  status: PaymentStatus;
  count: number;
  amount: number;
}

// ============ FORM TYPES ============

export interface TenantFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  roomId?: string;
  moveInDate: string;
  leaseStartDate: string;
  leaseEndDate?: string;
  monthlyRent: number;
  depositAmount: number;
}

export interface RoomFormData {
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: number;
  description?: string;
  amenities: string[];
  status: RoomStatus;
}

export interface PaymentFormData {
  tenantId: string;
  amount: number;
  type: PaymentType;
  dueDate: string;
  description?: string;
}

export interface MaintenanceFormData {
  roomId: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  assignedTo?: string;
  estimatedCost?: number;
  scheduledDate?: string;
}

export interface ExpenseFormData {
  category: string;
  description: string;
  amount: number;
  date: string;
  vendor?: string;
}

// ============ API RESPONSE TYPES ============

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
