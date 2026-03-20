import { Entity } from './entity';

/**
 * Base Aggregate Root class
 * Aggregate roots are entities that can contain other entities
 * They maintain invariants and publish domain events
 */
export abstract class AggregateRoot<TProps> extends Entity<TProps> {
  private _domainEvents: unknown[] = [];
  protected props: TProps;

  constructor(id: string, props: TProps) {
    super(id);
    this.props = props;
  }

  get domainEvents(): unknown[] {
    return this._domainEvents;
  }

  protected addDomainEvent(event: unknown): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}