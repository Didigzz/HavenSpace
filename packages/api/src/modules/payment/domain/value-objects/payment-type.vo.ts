import { ValueObject } from '../../../../shared/kernel/domain/value-object';

/**
 * Payment Type Value Object
 */
export class PaymentType extends ValueObject<'RENT' | 'UTILITY' | 'DEPOSIT' | 'OTHER'> {
  public static readonly RENT = 'RENT' as const;
  public static readonly UTILITY = 'UTILITY' as const;
  public static readonly DEPOSIT = 'DEPOSIT' as const;
  public static readonly OTHER = 'OTHER' as const;

  private constructor(value: 'RENT' | 'UTILITY' | 'DEPOSIT' | 'OTHER') {
    super(value);
  }

  public static get Rent(): PaymentType {
    return new PaymentType(PaymentType.RENT);
  }

  public static get Utility(): PaymentType {
    return new PaymentType(PaymentType.UTILITY);
  }

  public static get Deposit(): PaymentType {
    return new PaymentType(PaymentType.DEPOSIT);
  }

  public static get Other(): PaymentType {
    return new PaymentType(PaymentType.OTHER);
  }

  public static fromString(value: string): PaymentType {
    switch (value) {
      case PaymentType.RENT:
        return PaymentType.Rent;
      case PaymentType.UTILITY:
        return PaymentType.Utility;
      case PaymentType.DEPOSIT:
        return PaymentType.Deposit;
      case PaymentType.OTHER:
        return PaymentType.Other;
      default:
        throw new Error(`Invalid payment type: ${value}`);
    }
  }

  public isRent(): boolean {
    return this.value === PaymentType.RENT;
  }

  public isUtility(): boolean {
    return this.value === PaymentType.UTILITY;
  }

  public isDeposit(): boolean {
    return this.value === PaymentType.DEPOSIT;
  }

  public isOther(): boolean {
    return this.value === PaymentType.OTHER;
  }

  public toString(): string {
    return this.value;
  }
}