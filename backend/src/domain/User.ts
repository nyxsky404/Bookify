import { UserRole } from './enums';

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public name: string,
    public role: UserRole,
    public address: string | null,
    public phone: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  updateProfile(name: string, address: string | null, phone: string | null): void {
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.updatedAt = new Date();
  }

  toPublic(): Omit<User, 'passwordHash'> {
    const { passwordHash: _, ...rest } = this;
    return rest as Omit<User, 'passwordHash'>;
  }
}
