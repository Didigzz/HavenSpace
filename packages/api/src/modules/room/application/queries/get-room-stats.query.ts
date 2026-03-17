// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GetRoomStatsQuery {
  // No parameters needed
}

export type RoomStats = {
  total: number;
  available: number;
  occupied: number;
  maintenance: number;
};