import { Card, CardContent, CardHeader, CardTitle } from "../../primitives/card";
import { Badge } from "../../primitives/badge";
import { formatCurrency, formatDate } from "@havenspace/shared";

interface PaymentCardProps {
  payment: {
    id: string;
    amount: number | { toNumber(): number };
    status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
    type: string;
    dueDate: Date;
    paidDate?: Date | null;
    boarder?: {
      firstName: string;
      lastName: string;
      room?: { roomNumber: string } | null;
    };
  };
  onClick?: () => void;
}

function PaymentStatusBadge({ status }: { status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED" }) {
  const statusConfig = {
    PENDING: { label: "Pending", variant: "warning" as const },
    PAID: { label: "Paid", variant: "success" as const },
    OVERDUE: { label: "Overdue", variant: "destructive" as const },
    CANCELLED: { label: "Cancelled", variant: "secondary" as const },
  };

  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function PaymentCard({ payment, onClick }: PaymentCardProps) {
  const amount = typeof payment.amount === 'number' ? payment.amount : payment.amount.toNumber();

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          {formatCurrency(amount)}
        </CardTitle>
        <PaymentStatusBadge status={payment.status} />
      </CardHeader>
      <CardContent className="space-y-1">
        {payment.boarder && (
          <div className="text-sm font-medium">
            {payment.boarder.firstName} {payment.boarder.lastName}
            {payment.boarder.room && (
              <span className="text-muted-foreground">
                {" "}- Room {payment.boarder.room.roomNumber}
              </span>
            )}
          </div>
        )}
        <div className="text-sm text-muted-foreground">
          {payment.type} • Due: {formatDate(payment.dueDate)}
        </div>
        {payment.paidDate && (
          <div className="text-xs text-green-600">
            Paid: {formatDate(payment.paidDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}