/**
 * Value Object Base Class
 * 
 * Value objects are immutable objects that describe characteristics or attributes.
 * They are defined by their attributes, not by an identity.
 * Two value objects are equal if all their attributes are equal.
 */

export abstract class ValueObject<TProps = unknown> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  /**
   * Get all value object properties
   */
  getProps(): TProps {
    return this.props;
  }

  /**
   * Check if two value objects are equal
   * Value objects are equal if all their attributes are equal
   */
  equals(vo?: ValueObject<TProps>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (this === vo) {
      return true;
    }

    if (!(vo instanceof ValueObject)) {
      return false;
    }

    return this.shallowEqual(this.props as Record<string, unknown>, vo.props as Record<string, unknown>);
  }

  /**
   * Shallow equality check for objects
   */
  private shallowEqual(obj1: Record<string, unknown>, obj2: Record<string, unknown>): boolean {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
      return obj1 === obj2;
    }

    if (obj1 === null || obj2 === null) {
      return false;
    }

    const keys1 = Object.keys(obj1) as string[];
    const keys2 = Object.keys(obj2) as string[];

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!keys2.includes(key)) {
        return false;
      }

      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Convert value object to plain object
   */
  toObject(): TProps {
    return { ...this.props };
  }

  /**
   * Get string representation of value object
   */
  toString(): string {
    return JSON.stringify(this.props);
  }
}
