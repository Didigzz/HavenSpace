import { IBoarderRepository } from '../repositories/boarder.repository.interface';

/**
 * Boarder Domain Service
 * Contains business logic that doesn't naturally fit in the entity
 */
export class BoarderService {
  constructor(private boarderRepository: IBoarderRepository) {}

  /**
   * Validate boarder data before creation/update
   */
  validateBoarderData(data: {
    firstName: string;
    lastName: string;
    email: string;
    moveInDate: Date;
  }): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.firstName || data.firstName.trim().length === 0) {
      errors.push('First name is required');
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      errors.push('Last name is required');
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push('Invalid email address');
    }

    if (!data.moveInDate || data.moveInDate > new Date()) {
      errors.push('Move-in date cannot be in the future');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if email is unique
   */
  async isEmailUnique(email: string, excludeId?: string): Promise<boolean> {
    return !(await this.boarderRepository.existsByEmail(email, excludeId));
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if boarder can be assigned to a room
   */
  async canAssignRoom(_boarderId: string, _roomId: string): Promise<boolean> {
    // Boarder existence and active status checked by repository
    return true;
  }

  /**
   * Check if boarder can be deactivated
   */
  async canDeactivate(boarderId: string): Promise<boolean> {
    const boarder = await this.boarderRepository.findById(boarderId);
    if (!boarder) {
      return false;
    }
    if (!boarder.isActive) {
      return false;
    }
    // TODO: Check for outstanding payments
    return true;
  }
}