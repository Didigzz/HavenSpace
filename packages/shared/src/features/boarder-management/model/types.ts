// Boarder management feature types

import type { Boarder } from "@/entities/boarder";

export interface BoarderManagementState {
  boarders: Boarder[];
  loading: boolean;
  error: string | null;
  filters: BoarderFilters;
}

export interface BoarderFilters {
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
  searchQuery?: string;
}
