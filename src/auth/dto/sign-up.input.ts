import {Field, InputType} from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsString, Validate} from 'class-validator';
import {IsUnique} from "../decorators/isUnique.validate-decorator";


@InputType()
export class SignUpInput {
  @Validate(IsUnique, ['username'])
  @IsNotEmpty()
  @IsString()
  @Field()
  username: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Validate(IsUnique, ['email'])
  @Field()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field()
  password: string;
}
