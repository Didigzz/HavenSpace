import { DomainEvent } from '../../../../shared/kernel/events/domain-event';

export class BoarderCreatedEvent extends DomainEvent<{ boarderId: string }> {
  constructor(boarderId: string) {
    super('BoarderCreatedEvent', { boarderId });
  }
}

export class BoarderUpdatedEvent extends DomainEvent<{ boarderId: string; changes: string[] }> {
  constructor(
    boarderId: string,
    changes: string[]
  ) {
    super('BoarderUpdatedEvent', { boarderId, changes });
  }
}

export class BoarderDeletedEvent extends DomainEvent<{ boarderId: string }> {
  constructor(boarderId: string) {
    super('BoarderDeletedEvent', { boarderId });
  }
}

export class BoarderDeactivatedEvent extends DomainEvent<{ boarderId: string; moveOutDate: Date }> {
  constructor(
    boarderId: string,
    moveOutDate: Date
  ) {
    super('BoarderDeactivatedEvent', { boarderId, moveOutDate });
  }
}

export class BoarderReactivatedEvent extends DomainEvent<{ boarderId: string }> {
  constructor(boarderId: string) {
    super('BoarderReactivatedEvent', { boarderId });
  }
}

export class RoomAssignedEvent extends DomainEvent<{ boarderId: string; roomId: string }> {
  constructor(
    boarderId: string,
    roomId: string
  ) {
    super('RoomAssignedEvent', { boarderId, roomId });
  }
}

export class RoomRemovedEvent extends DomainEvent<{ boarderId: string }> {
  constructor(boarderId: string) {
    super('RoomRemovedEvent', { boarderId });
  }
}

export class AccessCodeRegeneratedEvent extends DomainEvent<{ boarderId: string; newAccessCode: string }> {
  constructor(
    boarderId: string,
    newAccessCode: string
  ) {
    super('AccessCodeRegeneratedEvent', { boarderId, newAccessCode });
  }
}