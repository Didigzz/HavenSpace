// Room entity types

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Boarder {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roomId?: string | null;
}

export interface UtilityReading {
  id: string;
  type: 'ELECTRICITY' | 'WATER' | 'INTERNET' | 'OTHER';
  previousReading: number | { toNumber(): number };
  currentReading: number | { toNumber(): number };
  ratePerUnit: number | { toNumber(): number };
  readingDate: Date;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  roomId: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  capacity: number;
  monthlyRate: number | { toNumber(): number };
  description?: string | null;
  amenities: string[];
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
  boarders?: Boarder[];
  utilityReadings?: UtilityReading[];
}

export type RoomWithBoarders = Room & {
  boarders: { id: string; firstName: string; lastName: string }[];
  _count: { boarders: number };
};

export type RoomWithDetails = Room & {
  boarders: Boarder[];
  utilityReadings: UtilityReading[];
};

export interface RoomFilters {
  status?: RoomStatus;
  search?: string;
  floor?: number;
}

export interface RoomStats {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
}