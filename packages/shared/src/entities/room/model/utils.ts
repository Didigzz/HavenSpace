import type { Room, RoomWithBoarders, RoomStatus } from './types';

/**
 * Check if a room is available for new boarders
 */
export function isRoomAvailable(room: RoomWithBoarders): boolean {
  return room.status === 'AVAILABLE' && room._count.boarders < room.capacity;
}

/**
 * Get the occupancy rate of a room
 */
export function getRoomOccupancyRate(room: RoomWithBoarders): number {
  if (room.capacity === 0) return 0;
  return (room._count.boarders / room.capacity) * 100;
}

/**
 * Get the display status of a room
 */
export function getRoomDisplayStatus(room: RoomWithBoarders): RoomStatus {
  // Auto-update status based on occupancy
  if (room._count.boarders >= room.capacity && room.status === 'AVAILABLE') {
    return 'OCCUPIED';
  }
  if (room._count.boarders === 0 && room.status === 'OCCUPIED') {
    return 'AVAILABLE';
  }
  return room.status;
}

/**
 * Calculate monthly revenue potential for a room
 */
export function getRoomMonthlyRevenue(room: Room): number {
  return typeof room.monthlyRate === 'number' 
    ? room.monthlyRate 
    : room.monthlyRate.toNumber();
}

/**
 * Get available space in a room
 */
export function getRoomAvailableSpace(room: RoomWithBoarders): number {
  return Math.max(0, room.capacity - room._count.boarders);
}

/**
 * Filter rooms based on criteria
 */
export function filterRooms(
  rooms: RoomWithBoarders[],
  filters: {
    status?: RoomStatus;
    search?: string;
    floor?: number;
    availableOnly?: boolean;
  }
): RoomWithBoarders[] {
  return rooms.filter((room) => {
    // Status filter
    if (filters.status && room.status !== filters.status) {
      return false;
    }

    // Floor filter
    if (filters.floor !== undefined && room.floor !== filters.floor) {
      return false;
    }

    // Available only filter
    if (filters.availableOnly && !isRoomAvailable(room)) {
      return false;
    }

    // Search filter (room number or description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const roomNumber = room.roomNumber.toLowerCase();
      const description = room.description?.toLowerCase() || '';
      
      if (!roomNumber.includes(searchLower) && !description.includes(searchLower)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Sort rooms by room number
 */
export function sortRoomsByNumber(rooms: Room[]): Room[] {
  return [...rooms].sort((a, b) => {
    // Try to sort numerically if possible, otherwise alphabetically
    const aNum = parseInt(a.roomNumber);
    const bNum = parseInt(b.roomNumber);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    return a.roomNumber.localeCompare(b.roomNumber);
  });
}

/**
 * Group rooms by floor
 */
export function groupRoomsByFloor(rooms: Room[]): Record<number, Room[]> {
  return rooms.reduce((groups, room) => {
    const floorKey = room.floor;
    if (!groups[floorKey]) {
      groups[floorKey] = [];
    }
    groups[floorKey].push(room);
    return groups;
  }, {} as Record<number, Room[]>);
}

/**
 * Calculate total capacity across rooms
 */
export function getTotalCapacity(rooms: Room[]): number {
  return rooms.reduce((total, room) => total + room.capacity, 0);
}

/**
 * Calculate total occupied spaces across rooms
 */
export function getTotalOccupied(rooms: RoomWithBoarders[]): number {
  return rooms.reduce((total, room) => total + room._count.boarders, 0);
}

/**
 * Calculate overall occupancy rate
 */
export function getOverallOccupancyRate(rooms: RoomWithBoarders[]): number {
  const totalCapacity = getTotalCapacity(rooms);
  const totalOccupied = getTotalOccupied(rooms);
  
  if (totalCapacity === 0) return 0;
  return (totalOccupied / totalCapacity) * 100;
}