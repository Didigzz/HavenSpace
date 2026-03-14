import { Card, CardContent, CardHeader, CardTitle } from "../../primitives/card";
import { Badge } from "../../primitives/badge";
import { Users, DoorOpen } from "lucide-react";
import { formatCurrency } from "@havenspace/shared";

interface RoomCardProps {
  room: {
    id: string;
    roomNumber: string;
    floor: number;
    capacity: number;
    monthlyRate: number | { toNumber(): number };
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE";
    amenities?: string[];
    _count?: { boarders: number };
  };
  onClick?: () => void;
}

function RoomStatusBadge({ status }: { status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" }) {
  const statusConfig = {
    AVAILABLE: { label: "Available", variant: "success" as const },
    OCCUPIED: { label: "Occupied", variant: "default" as const },
    MAINTENANCE: { label: "Maintenance", variant: "warning" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function RoomCard({ room, onClick }: RoomCardProps) {
  const monthlyRate = typeof room.monthlyRate === 'number' ? room.monthlyRate : room.monthlyRate.toNumber();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          Room {room.roomNumber}
        </CardTitle>
        <RoomStatusBadge status={room.status} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <DoorOpen className="h-4 w-4" />
            <span>Floor {room.floor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {room._count?.boarders ?? 0}/{room.capacity}
            </span>
          </div>
        </div>
        <div className="mt-2 text-lg font-semibold">
          {formatCurrency(monthlyRate)}/mo
        </div>
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="text-xs bg-muted px-2 py-0.5 rounded"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{room.amenities.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}