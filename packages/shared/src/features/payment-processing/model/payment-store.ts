import { create } from "zustand";
import type { PaymentStatus, PaymentType } from "@/entities/payment";

interface PaymentFilters {
  status: PaymentStatus | "ALL";
  type: PaymentType | "ALL";
  boarderId: string | null;
}

interface PaymentStore {
  filters: PaymentFilters;
  setFilters: (filters: Partial<PaymentFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: PaymentFilters = {
  status: "ALL",
  type: "ALL",
  boarderId: null,
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
