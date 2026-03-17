import { ValueObject } from "../../../../shared/kernel/domain/value-object";

export class UserRole extends ValueObject<string> {
  private static readonly VALID_ROLES = ["LANDLORD", "BOARDER"] as const;

  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UserRole {
    if (!Array.prototype.includes.call(UserRole.VALID_ROLES, value)) {
      throw new Error(`Invalid user role: ${value}`);
    }
    return new UserRole(value);
  }

  static get LANDLORD(): UserRole {
    return new UserRole("LANDLORD");
  }

  static get BOARDER(): UserRole {
    return new UserRole("BOARDER");
  }

  isLandlord(): boolean {
    return this.value === "LANDLORD";
  }

  isBoarder(): boolean {
    return this.value === "BOARDER";
  }
}