import { User } from '../../domain/User';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<Pick<User, 'name' | 'address' | 'phone' | 'passwordHash' | 'updatedAt'>>): Promise<User>;
  delete(id: string): Promise<void>;
}
