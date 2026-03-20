import { IEventBus } from '../infrastructure/messaging/event-bus.interface';

export class EventBus implements IEventBus {
  private static instance: EventBus;
  private handlers: Map<string, Set<(event: unknown) => Promise<void>>>;

  private constructor() {
    this.handlers = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  async publish(event: unknown): Promise<void> {
    const eventType = (event as { type: string }).type;
    const handlers = this.handlers.get(eventType);

    if (handlers) {
      await Promise.all(
        Array.from(handlers).map(handler => handler(event))
      );
    }
  }

  public subscribe(eventType: string, handler: (event: unknown) => Promise<void>): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  public unsubscribe(eventType: string, handler: (event: unknown) => Promise<void>): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.delete(handler);
    }
  }
}

export const eventBus = EventBus.getInstance();