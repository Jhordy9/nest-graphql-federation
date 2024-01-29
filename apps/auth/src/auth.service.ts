import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { hash, compare } from 'bcrypt';
import { SignUpInput } from './dto/signup.input';
import { SignInInput } from './dto/signin.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    const { password, ...restSignUpInput } = signUpInput;

    const hashPassword = await hash(password, 10);

    console.log(hashPassword, restSignUpInput);

    const user = await this.prisma.user.create({
      data: {
        ...restSignUpInput,
        password: hashPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async signIn(signInInput: SignInInput) {
    const { email, password } = signInInput;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
