import { Card, CardContent, CardHeader, CardTitle } from "../../primitives/card";
import { Badge } from "../../primitives/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../primitives/avatar";
import { Phone, Mail, DoorOpen } from "lucide-react";
import { formatDate } from "@havenspace/shared";

interface BoarderCardProps {
  boarder: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    isActive: boolean;
    moveInDate: Date;
    room?: { roomNumber: string } | null;
    image?: string | null;
  };
  onClick?: () => void;
}

function BoarderStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge variant={isActive ? "success" : "secondary"}>
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}

function BoarderAvatar({ firstName, lastName, image, className }: { 
  firstName: string; 
  lastName: string; 
  image?: string | null; 
  className?: string;
}) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <Avatar className={className}>
      {image && <AvatarImage src={image} alt={`${firstName} ${lastName}`} />}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

export function BoarderCard({ boarder, onClick }: BoarderCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <BoarderAvatar
          firstName={boarder.firstName}
          lastName={boarder.lastName}
          image={boarder.image}
        />
        <div className="flex-1">
          <CardTitle className="text-lg font-medium">
            {boarder.firstName} {boarder.lastName}
          </CardTitle>
          <BoarderStatusBadge isActive={boarder.isActive} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{boarder.email}</span>
        </div>
        {boarder.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>{boarder.phone}</span>
          </div>
        )}
        {boarder.room && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DoorOpen className="h-4 w-4" />
            <span>Room {boarder.room.roomNumber}</span>
          </div>
        )}
        <div className="text-xs text-muted-foreground">
          Move-in: {formatDate(boarder.moveInDate)}
        </div>
      </CardContent>
    </Card>
  );
}