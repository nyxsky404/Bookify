import { User } from '../../domain/User';
import { UserRole } from '../../domain/enums';

export class UserFactory {
  static create(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    role: UserRole,
    address: string | null,
    phone: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, email, passwordHash, name, role, address, phone, createdAt, updatedAt);
  }

  static createCustomer(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    address: string | null,
    phone: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return this.create(id, email, passwordHash, name, UserRole.CUSTOMER, address, phone, createdAt, updatedAt);
  }

  static createAdmin(
    id: string,
    email: string,
    passwordHash: string,
    name: string,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return this.create(id, email, passwordHash, name, UserRole.ADMIN, null, null, createdAt, updatedAt);
  }
}
