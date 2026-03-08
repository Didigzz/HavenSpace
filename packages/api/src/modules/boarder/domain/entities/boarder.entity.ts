import { AggregateRoot } from '../../../../shared/kernel/domain/aggregate-root';

export interface BoarderProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  accessCode: string;
  moveInDate: Date;
  moveOutDate?: Date;
  isActive: boolean;
  roomId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Boarder Aggregate Root
 * Represents a boarder in the boarding house
 */
export class Boarder extends AggregateRoot<BoarderProps> {
  constructor(props: BoarderProps) {
    super(props.id, props);
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  get email(): string {
    return this.props.email;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get emergencyContact(): string | undefined {
    return this.props.emergencyContact;
  }

  get emergencyPhone(): string | undefined {
    return this.props.emergencyPhone;
  }

  get accessCode(): string {
    return this.props.accessCode;
  }

  get moveInDate(): Date {
    return this.props.moveInDate;
  }

  get moveOutDate(): Date | undefined {
    return this.props.moveOutDate;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get roomId(): string | undefined {
    return this.props.roomId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Assign a room to the boarder
   */
  assignRoom(roomId: string): void {
    this.props.roomId = roomId;
    this.props.updatedAt = new Date();
    // TODO: Emit RoomAssignedEvent
  }

  /**
   * Remove boarder from their room
   */
  removeRoom(): void {
    this.props.roomId = undefined;
    this.props.updatedAt = new Date();
    // TODO: Emit RoomRemovedEvent
  }

  /**
   * Deactivate boarder (move out)
   */
  deactivate(moveOutDate: Date): void {
    if (!this.props.isActive) {
      return;
    }
    this.props.isActive = false;
    this.props.moveOutDate = moveOutDate;
    this.props.updatedAt = new Date();
    // TODO: Emit BoarderDeactivatedEvent
  }

  /**
   * Reactivate boarder (move back in)
   */
  reactivate(): void {
    if (this.props.isActive) {
      return;
    }
    this.props.isActive = true;
    this.props.moveOutDate = undefined;
    this.props.updatedAt = new Date();
    // TODO: Emit BoarderReactivatedEvent
  }

  /**
   * Update boarder personal information
   */
  updatePersonalInfo(details: Partial<Omit<BoarderProps, 'id' | 'accessCode' | 'createdAt' | 'isActive'>>): void {
    this.props = {
      ...this.props,
      ...details,
      updatedAt: new Date(),
    };
  }

  /**
   * Generate a new access code
   */
  regenerateAccessCode(): void {
    const newCode = `${this.props.firstName.charAt(0)}${this.props.lastName.charAt(0)}${Date.now().toString(36)}`.toUpperCase();
    this.props.accessCode = newCode;
    this.props.updatedAt = new Date();
    // TODO: Emit AccessCodeRegeneratedEvent
  }

  static create(props: Omit<BoarderProps, 'id' | 'accessCode' | 'createdAt' | 'updatedAt'>): Boarder {
    const accessCode = `${props.firstName.charAt(0)}${props.lastName.charAt(0)}${Date.now().toString(36)}`.toUpperCase();
    return new Boarder({
      ...props,
      id: crypto.randomUUID(),
      accessCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}