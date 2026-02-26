// Boarder entity utilities

import type { Boarder, BoarderWithRoom } from "./types";

export function isBoarderActive(boarder: Boarder): boolean {
  return boarder.status === "ACTIVE";
}

export function formatBoarderName(boarder: Boarder): string {
  return `${boarder.name} (${boarder.email})`;
}

export function getBoarderFullName(boarder: Boarder): string {
  return boarder.name;
}

export function filterBoarders(
  boarders: BoarderWithRoom[],
  filters: {
    search?: string;
    isActive?: boolean;
    roomId?: string;
  }
): BoarderWithRoom[] {
  return boarders.filter(boarder => {
    if (filters.isActive !== undefined && isBoarderActive(boarder) !== filters.isActive) {
      return false;
    }
    if (filters.roomId && boarder.roomId !== filters.roomId) {
      return false;
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const fullName = getBoarderFullName(boarder).toLowerCase();
      const email = boarder.email.toLowerCase();
      if (!fullName.includes(searchLower) && !email.includes(searchLower)) {
        return false;
      }
    }
    return true;
  });
}
