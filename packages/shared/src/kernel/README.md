# @havenspace/shared/kernel - Domain-Driven Design Base Classes

This package provides the foundational building blocks for implementing Domain-Driven Design (DDD) patterns in the Haven Space platform.

## Overview

The kernel package contains the core abstractions and base classes that all domain modules extend:

- **Entity** - Objects with distinct identity
- **ValueObject** - Immutable objects defined by their attributes
- **AggregateRoot** - Entity that maintains consistency boundary
- **DomainEvent** - Events representing meaningful domain occurrences

## Installation

```bash
# Already available as workspace dependency
import { ... } from '@havenspace/shared/kernel';
```

## Usage

### Entity

Entities are objects with a distinct identity that persists through different states:

```typescript
import { Entity } from '@havenspace/shared/kernel';

interface UserProps {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export class User extends Entity<UserProps> {
  constructor(props: UserProps) {
    super(props.id, props);
  }

  get email(): string {
    return this.props.email;
  }

  get name(): string {
    return this.props.name;
  }

  updateName(newName: string): void {
    this.props.name = newName;
  }
}
```

### ValueObject

Value objects are immutable objects defined by their attributes, not identity:

```typescript
import { ValueObject } from '@havenspace/shared/kernel';

interface MoneyProps {
  amount: number;
  currency: string;
}

export class Money extends ValueObject<MoneyProps> {
  constructor(props: MoneyProps) {
    super(props);
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  add(other: Money): Money {
    if (this.props.currency !== other.props.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money({
      amount: this.props.amount + other.props.amount,
      currency: this.props.currency,
    });
  }
}
```

### AggregateRoot

Aggregate roots are entities that maintain consistency boundaries and collect domain events:

```typescript
import { AggregateRoot } from '@havenspace/shared/kernel';
import { OrderCreatedDomainEvent } from './events/order-created.domain-event';

interface OrderProps {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: Date;
}

export class Order extends AggregateRoot<OrderProps> {
  constructor(props: OrderProps) {
    super(props.id, props);
  }

  static create(customerId: string, items: OrderItem[]): Order {
    const order = new Order({
      id: crypto.randomUUID(),
      customerId,
      items,
      status: OrderStatus.PENDING,
      createdAt: new Date(),
    });

    // Raise domain event
    order.raise(OrderCreatedDomainEvent.create({ orderId: order.id }));

    return order;
  }

  cancel(): void {
    if (this.props.status !== OrderStatus.PENDING) {
      throw new Error('Can only cancel pending orders');
    }
    this.props.status = OrderStatus.CANCELLED;
  }

  // Get uncommitted events for publishing
  const events = order.pullUncommittedEvents();
  await eventPublisher.publish(events);
}
```

### DomainEvent

Domain events represent something meaningful that happened in the domain:

```typescript
import { DomainEvent } from '@havenspace/shared/kernel';

interface PaymentProcessedEventData {
  paymentId: string;
  orderId: string;
  amount: number;
  processedAt: Date;
}

export class PaymentProcessedDomainEvent extends DomainEvent<PaymentProcessedEventData> {
  constructor(data: PaymentProcessedEventData) {
    super('PaymentProcessed', data);
  }

  static create(data: PaymentProcessedEventData): PaymentProcessedDomainEvent {
    return new PaymentProcessedDomainEvent(data);
  }
}
```

## Architecture

```
kernel/
â”œâ”€â”€ domain/
â”‚   â”œâ”€â”€ entity.ts          # Entity base class
â”‚   â”œâ”€â”€ value-object.ts    # ValueObject base class
â”‚   â””â”€â”€ aggregate-root.ts  # AggregateRoot base class
â”œâ”€â”€ events/
â”‚   â””â”€â”€ domain-event.ts    # DomainEvent base class
â””â”€â”€ index.ts               # Public exports
```

## Best Practices

1. **Entities** should have a single identity property (id)
2. **Value Objects** should be immutable - never modify props after creation
3. **Aggregates** should be the only way to modify child entities
4. **Domain Events** should use past tense (e.g., `OrderCreated`, `PaymentProcessed`)
5. **Pull uncommitted events** after persisting aggregates, then publish them

## Related Packages

- `@havenspace/api` - Uses kernel classes in domain modules
- `@havenspace/database` - Persistence layer for aggregates
- `@havenspace/validation` - Validation schemas for domain objects

