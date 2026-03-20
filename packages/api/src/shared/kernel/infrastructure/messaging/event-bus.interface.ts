export interface IEventBus {
  publish(event: unknown): Promise<void>;
  subscribe(eventType: string, handler: (event: unknown) => Promise<void>): void;
  unsubscribe(eventType: string, handler: (event: unknown) => Promise<void>): void;
}