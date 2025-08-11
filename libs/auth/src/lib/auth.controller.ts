import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '@chat-app/users';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User created' })
  async register(@Body() dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      username: dto.username,
      email: dto.email,
      passwordHash,
    });
    return { id: (user as any)._id, username: user.username, email: user.email };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Returns JWT access token' })
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);
    if (!user) {
      return { ok: false };
    }
    const match = await bcrypt.compare(dto.password, (user as any).passwordHash);
    if (!match) {
      return { ok: false };
    }
    const payload = { sub: (user as any)._id, username: user.username };
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token };
  }
}


