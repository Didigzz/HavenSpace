import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatShortDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatShortDate(date);
}

export function calculateOccupancyRate(
  occupied: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((occupied / total) * 100);
}

export function getStatusColor(status: string): {
  color: string;
  bg: string;
  border: string;
} {
  switch (status.toUpperCase()) {
    case "ACTIVE":
    case "AVAILABLE":
    case "COMPLETED":
    case "APPROVED":
    case "PAID":
      return {
        color: "text-green-700",
        bg: "bg-green-50",
        border: "border-green-200",
      };
    case "INACTIVE":
    case "OCCUPIED":
    case "PENDING":
    case "PROCESSING":
      return {
        color: "text-yellow-700",
        bg: "bg-yellow-50",
        border: "border-yellow-200",
      };
    case "MAINTENANCE":
    case "CANCELLED":
    case "REJECTED":
      return {
        color: "text-orange-700",
        bg: "bg-orange-50",
        border: "border-orange-200",
      };
    case "HIGH":
    case "URGENT":
      return {
        color: "text-red-700",
        bg: "bg-red-50",
        border: "border-red-200",
      };
    case "MEDIUM":
      return {
        color: "text-blue-700",
        bg: "bg-blue-50",
        border: "border-blue-200",
      };
    case "LOW":
      return {
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
    default:
      return {
        color: "text-gray-700",
        bg: "bg-gray-50",
        border: "border-gray-200",
      };
  }
}
