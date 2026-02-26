import { useMemo } from 'react';
import type { BoarderWithRoom, BoarderStats } from '@/entities/boarder';
import { getBoarderFullName, isBoarderActive, filterBoarders } from '@/entities/boarder';

/**
 * Hook to calculate boarder statistics
 */
export function useBoarderStats(boarders: BoarderWithRoom[]): BoarderStats {
  return useMemo(() => {
    const active = boarders.filter(b => isBoarderActive(b));
    const inactive = boarders.filter(b => !isBoarderActive(b));

    return {
      total: boarders.length,
      active: active.length,
      inactive: inactive.length,
    };
  }, [boarders]);
}

/**
 * Hook to filter and search boarders
 */
export function useFilteredBoarders(
  boarders: BoarderWithRoom[],
  filters: {
    search?: string;
    isActive?: boolean;
    roomId?: string;
  }
) {
  return useMemo(() => {
    return filterBoarders(boarders, filters);
  }, [boarders, filters]);
}

/**
 * Hook to get boarders by room occupancy status
 */
export function useBoardersByOccupancy(boarders: BoarderWithRoom[]) {
  return useMemo(() => {
    const withRoom = boarders.filter(b => b.roomId && isBoarderActive(b));
    const withoutRoom = boarders.filter(b => !b.roomId && isBoarderActive(b));

    return {
      withRoom,
      withoutRoom,
      occupancyRate: boarders.length > 0 ? (withRoom.length / boarders.length) * 100 : 0,
    };
  }, [boarders]);
}

/**
 * Hook to get recent boarders (moved in within specified days)
 */
export function useRecentBoarders(boarders: BoarderWithRoom[], daysBack: number = 30) {
  return useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);

    return boarders
      .filter(boarder =>
        boarder.moveInDate !== undefined &&
        boarder.moveInDate >= cutoffDate &&
        isBoarderActive(boarder)
      )
      .sort((a, b) => {
        if (a.moveInDate === undefined || b.moveInDate === undefined) return 0;
        return b.moveInDate.getTime() - a.moveInDate.getTime();
      });
  }, [boarders, daysBack]);
}

/**
 * Hook to get boarders grouped by room
 */
export function useBoardersByRoom(boarders: BoarderWithRoom[]) {
  return useMemo(() => {
    const grouped = boarders.reduce((groups, boarder) => {
      const roomKey = boarder.room?.roomNumber || 'Unassigned';
      if (!groups[roomKey]) {
        groups[roomKey] = [];
      }
      groups[roomKey].push(boarder);
      return groups;
    }, {} as Record<string, BoarderWithRoom[]>);

    return grouped;
  }, [boarders]);
}

/**
 * Hook to search boarders by name or email
 */
export function useSearchBoarders(boarders: BoarderWithRoom[], searchTerm: string) {
  return useMemo(() => {
    if (!searchTerm.trim()) return boarders;

    const searchLower = searchTerm.toLowerCase();
    return boarders.filter(boarder => {
      const fullName = getBoarderFullName(boarder).toLowerCase();
      const email = boarder.email.toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
  }, [boarders, searchTerm]);
}