import type { SignDTO } from "src/dtos/sign.dto";
import { User } from "../entities/user.entity";
import AppDataSource from "../ormconfig";
import { ILike, Repository } from "typeorm";
import { EncryptorService } from "./encryptor.service";
import { RoleService } from "./role.service";
import { JwtService } from "./jwt.service";
import { TokenResponse } from "src/models/token-response.model";
import { VerifyService } from "./verify.service";

export class UserService {
  private userRepository: Repository<User>;
  private encryptorService: EncryptorService;
  private roleService: RoleService;
  private jwtService: JwtService;
  private verifyService: VerifyService

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
    this.encryptorService = new EncryptorService();
    this.roleService = new RoleService();
    this.jwtService = new JwtService()
    this.verifyService = new VerifyService()
  }

  async signUp(data: SignDTO): Promise<TokenResponse> {
    if (!this.verifyService.isValidEmail(data.email))
      throw new Error(`Email not valid`)
    if (!this.verifyService.isValidPassword(data.password))
      throw new Error(`The password must be between 3 and 5 characters long`)

    if (!data.birthday)
      throw new Error('Birthday date is empty')

    const hasUser = await this.getUserByEmail(data.email); 
    if (hasUser)
      throw new Error('Email is busy, try another')

    const { hash, salt } = this.encryptorService.hashPassword(data.password);

    const userRole = await this.roleService.getRoleByName('user');

    if (!userRole)
      throw new Error('Не удалось получить роль!')

    const user = this.userRepository.create({
      email: data.email.toLowerCase(),
      passwordHash: hash,
      passwordSalt: salt,
      birthday: data.birthday,
      role: { id: userRole.id },
      isActive: true
    })


    try {
      const tokens = this.jwtService.writeTokens(user.id, user.email.toLowerCase(), hash, userRole.name);
      await this.userRepository.save(user);
      return tokens;
    } catch (error) {
      throw new Error(error)
    }
  }

  async signIn(data: SignDTO): Promise<TokenResponse> {
    const user = await this.getUserByEmail(data.email);
    if (!user)
      throw new Error('User not found');

    const isVerifyPassword = this.verifyService.verifyPassword(
      data.password,
      user.passwordHash,
      user.passwordSalt
    );

    if (!isVerifyPassword)
      throw new Error('Invalid password')
    if (!user.isActive)
      throw new Error('Account blocked')

    try {
      return this.jwtService.writeTokens(
        user.id, 
        user.email.toLowerCase(), 
        user.passwordHash, 
        user.role.name
      )
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    if (!userId)
      throw new Error('Params is empty')
    return await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role']
    })
  }

  async getAllUsers(): Promise<User[] | []> {
    return await this.userRepository.find({
      relations: ['role']
    });
  }

  async blockUserById(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user)
      throw new Error('User not found!');
    user.isActive = false;
    user.blockedAt = new Date()
    try {
      await this.userRepository.save(user);
      return true;
    } catch (error) {
     throw new Error(`Failed to block user: ${error.message}`)
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email: ILike(email) },
      relations: ['role']
    })
  }
}

