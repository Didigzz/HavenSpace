# @havenspace/ui

Shared React UI component library for the Haven Space platform.

## Overview

A comprehensive component library built on Radix UI primitives with Tailwind CSS styling and Material Design principles.

## Installation

```bash
# Already available as workspace dependency
import { Button, Card, ... } from '@havenspace/ui';
```

## Components

### Primitives

Basic building block components:

| Component | Description |
|-----------|-------------|
| `Button` | Action buttons with variants |
| `Card` | Content containers |
| `Dialog` | Modal dialogs |
| `Input` | Form input fields |
| `Label` | Form labels |
| `Select` | Dropdown selection |
| `Checkbox` | Checkbox inputs |
| `Radio` | Radio button inputs |
| `Switch` | Toggle switches |
| `Slider` | Range sliders |
| `Tabs` | Tabbed navigation |
| `Accordion` | Expandable sections |
| `DropdownMenu` | Context menus |
| `NavigationMenu` | Nav menus |
| `Menubar` | Menu bars |
| `Toolbar` | Action toolbars |
| `Tooltip` | Hover tooltips |
| `Toast` | Notification toasts |
| `Progress` | Progress indicators |
| `Spinner` | Loading spinners |
| `Avatar` | User avatars |
| `Badge` | Status badges |
| `Alert` | Alert messages |
| `Separator` | Visual dividers |
| `Skeleton` | Loading placeholders |

### Composite Components

Higher-level domain-specific components:

| Component | Description |
|-----------|-------------|
| `BoarderCard` | Boarder profile display |
| `PaymentCard` | Payment information |
| `RoomCard` | Room listing card |
| `PropertyCard` | Property listing |
| `BookingCard` | Booking details |
| `AppSwitcher` | Cross-app navigation |

## Usage

### Basic Components

```typescript
import { Button, Card, Input, Label } from '@havenspace/ui';

function MyComponent() {
  return (
    <Card>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter email" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

### Button Variants

```typescript
import { Button } from '@havenspace/ui';

<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outlined</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Composite Components

```typescript
import { RoomCard, BoarderCard, PaymentCard } from '@havenspace/ui';

<RoomCard
  roomNumber="101"
  floor={1}
  capacity={2}
  monthlyRate={5000}
  status="AVAILABLE"
  amenities={['WiFi', 'AC', 'Balcony']}
/>

<BoarderCard
  firstName="John"
  lastName="Doe"
  email="john@example.com"
  roomNumber="101"
  isActive={true}
/>
```

## Package Structure

```
ui/
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ components/
â”‚   â”‚   â”œâ”€â”€ primitives/    # Base components
â”‚   â”‚   â””â”€â”€ composite/     # Domain components
â”‚   â”œâ”€â”€ hooks/             # Custom React hooks
â”‚   â”œâ”€â”€ utils/             # Utility functions
â”‚   â””â”€â”€ index.ts           # Main exports
â”œâ”€â”€ package.json
â””â”€â”€ README.md
```

## Styling

Components use Tailwind CSS with class-variance-authority for variants:

```typescript
import { cva } from 'class-variance-authority';

const buttonVariants = cva('base styles', {
  variants: {
    variant: {
      primary: 'primary styles',
      secondary: 'secondary styles',
    },
    size: {
      sm: 'small styles',
      lg: 'large styles',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

## Accessibility

All components follow WAI-ARIA guidelines:
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Proper ARIA attributes

## Theming

Components support light and dark themes via CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## Best Practices

1. **Use primitives** - Build custom components from primitives
2. **Consistent variants** - Follow existing variant patterns
3. **Accessibility first** - Always test with keyboard and screen readers
4. **Responsive design** - Components should work on all screen sizes
5. **Type-safe props** - Always define proper TypeScript types

## Related Packages

- `@havenspace/shared` - Utility functions (cn)
- `@havenspace/providers` - Theme and app providers
- `@havenspace/layouts` - Layout components
- `@havenspace/config` - Tailwind configuration

