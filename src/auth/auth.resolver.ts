import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AuthService} from './auth.service';
import {Auth} from './entities/auth.entity';
import {SignUpInput} from './dto/sign-up.input';
import {SignResponse} from "./dto/sign-response";
import {SignInInput} from "./dto/sign-in.input";
import {LogoutResponse} from "./dto/logout-response";
import {Public} from "./decorators/public.decorator";

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignResponse)
  signUp(@Args('signUpInput') signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @Public()
  @Mutation(() => SignResponse)
  signIn(@Args('signInInput') signInInput: SignInInput) {
    return this.authService.signIn(signInInput)
  }

  @Mutation(() => LogoutResponse)
  logout(@Args('id') id: string) {
    return this.authService.logout(id)
  }


  @Public()
  @Query(() => String, { name: 'hello' })
  hello() {
    return this.authService.hello();
  }
}
