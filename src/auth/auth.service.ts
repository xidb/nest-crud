import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interfaces/user.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async validateUser(email: string): Promise<IUser | null> {
    const user = await this.usersService.findOne({ email });
    return user ? user : null;
  }

  async login(email: any): Promise<object> {
    const user = await this.usersService.findOne({ email });

    return {
      accessToken: this.jwtService.sign({ sub: user._id }),
    };
  }
}
