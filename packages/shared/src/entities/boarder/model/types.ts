// Boarder entity types

export interface Boarder {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomId?: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  moveInDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoarderWithRoom extends Boarder {
  room?: {
    id: string;
    roomNumber: string;
  } | null;
}

export interface BoarderStats {
  total: number;
  active: number;
  inactive: number;
}

export interface CreateBoarderInput {
  name: string;
  email: string;
  phone: string;
  roomId?: string;
}

export interface UpdateBoarderInput {
  name?: string;
  email?: string;
  phone?: string;
  roomId?: string;
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
}
