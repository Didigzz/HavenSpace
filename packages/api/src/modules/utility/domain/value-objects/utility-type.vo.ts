import { ValueObject } from "../../../../shared/kernel/domain/value-object";

export class UtilityType extends ValueObject<string> {
  private static readonly VALID_TYPES = ["ELECTRICITY", "WATER", "INTERNET", "OTHER"] as const;

  private constructor(value: string) {
    super(value);
  }

  static create(value: string): UtilityType {
    if (!Array.prototype.includes.call(UtilityType.VALID_TYPES, value)) {
      throw new Error(`Invalid utility type: ${value}`);
    }
    return new UtilityType(value);
  }

  static get ELECTRICITY(): UtilityType {
    return new UtilityType("ELECTRICITY");
  }

  static get WATER(): UtilityType {
    return new UtilityType("WATER");
  }

  static get INTERNET(): UtilityType {
    return new UtilityType("INTERNET");
  }

  static get OTHER(): UtilityType {
    return new UtilityType("OTHER");
  }

  isElectricity(): boolean {
    return this.value === "ELECTRICITY";
  }

  isWater(): boolean {
    return this.value === "WATER";
  }

  isInternet(): boolean {
    return this.value === "INTERNET";
  }
}