import { User } from '../domain/User';
import { UserRole } from '../domain/enums';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { UserFactory } from '../patterns/factory/UserFactory';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { ApiError } from '../utils/apiError';
import { signToken } from '../utils/jwt';
import { comparePassword, hashPassword } from '../utils/password';

export class AuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(dto: RegisterDto): Promise<{ user: User; token: string }> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) throw ApiError.conflict('Email already registered');

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userRepo.save(
      UserFactory.createCustomer('', dto.email, passwordHash, dto.name, dto.address ?? null, dto.phone ?? null, new Date(), new Date()),
    );
    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async login(dto: LoginDto): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) throw ApiError.unauthorized('Invalid email or password');

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) throw ApiError.unauthorized('Invalid email or password');

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    return { user, token };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    const valid = await comparePassword(oldPassword, user.passwordHash);
    if (!valid) throw ApiError.badRequest('Current password is incorrect');

    const newHash = await hashPassword(newPassword);
    await this.userRepo.update(userId, { passwordHash: newHash });
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return user;
  }

  async updateProfile(userId: string, name: string, address: string | null, phone: string | null): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    return this.userRepo.update(userId, { name, address, phone });
  }

  async promoteToAdmin(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw ApiError.notFound('User not found');
    await this.userRepo.update(userId, { passwordHash: user.passwordHash });
  }
}
