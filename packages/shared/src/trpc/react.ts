// Mock TRPC API for shared package
// This is a placeholder to resolve typecheck errors
// In a real implementation, this would connect to your TRPC router

export const api = {
  boarder: {
    getAll: {
      useQuery: (_params: unknown) => ({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
    getById: {
      useQuery: (_params: { id: string }) => ({
        data: null,
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
    getStats: {
      useQuery: () => ({
        data: { total: 0, active: 0, inactive: 0 },
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
  },
  payment: {
    getAll: {
      useQuery: (_params: unknown) => ({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
    getStats: {
      useQuery: () => ({
        data: { pending: { count: 0, amount: 0 }, paid: { count: 0, amount: 0 }, overdue: { count: 0, amount: 0 } },
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
    getMonthlyRevenue: {
      useQuery: (_params: { year?: number }) => ({
        data: [],
        isLoading: false,
        isError: false,
        error: null,
      }),
    },
  },
};
