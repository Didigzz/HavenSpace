// Export all entities
export * from './entities';

// Export all features
export * from './features';

// Export UI components (primitives and composite)
// Note: hooks and utils are exported separately to avoid duplicates
export * from './ui/components/primitives/alert-dialog';
export * from './ui/components/primitives/avatar';
export * from './ui/components/primitives/badge';
export * from './ui/components/primitives/button';
export * from './ui/components/primitives/calendar';
export * from './ui/components/primitives/card';
export * from './ui/components/primitives/command';
export * from './ui/components/primitives/data-table';
export * from './ui/components/primitives/date-picker';
export * from './ui/components/primitives/dialog';
export * from './ui/components/primitives/dropdown-menu';
export * from './ui/components/primitives/form';
export * from './ui/components/primitives/input';
export * from './ui/components/primitives/label';
export * from './ui/components/primitives/popover';
export * from './ui/components/primitives/progress';
export * from './ui/components/primitives/select';
export * from './ui/components/primitives/separator';
export * from './ui/components/primitives/sheet';
export * from './ui/components/primitives/skeleton';
export * from './ui/components/primitives/switch';
export * from './ui/components/primitives/table';
export * from './ui/components/primitives/tabs';
export * from './ui/components/primitives/textarea';
export * from './ui/components/primitives/toast';
export * from './ui/components/primitives/toaster';
export * from './ui/components/primitives/use-toast';
export * from './ui/components/composite';
export * from './ui/components/app-switcher';
export * from './ui/theme';

// Export components (layouts, providers)
export * from './components';

// Export shared utilities (excluding cn which is in ui/utils)
export * from './lib/constants';
export * from './lib/formatters';
export * from './lib/utils';

// Export types
export * from './types';

// Export kernel (DDD base classes)
export * from './kernel';

// Export UI hooks and utils (single source of truth)
export * from './ui/hooks';
export * from './ui/utils';