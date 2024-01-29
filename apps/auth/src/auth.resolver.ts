import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUp } from './entities/signup.entity';
import { SignUpInput } from './dto/signup.input';
import { SignInInput } from './dto/signin.input';
import { SignIn } from './entities/signin.entity';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUp)
  async signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return await this.authService.signUp(signUpInput);
  }

  @Mutation(() => SignIn)
  async signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @Query(() => String)
  hello() {
    return 'hello';
  }
}
