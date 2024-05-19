import {ForbiddenException, Injectable} from '@nestjs/common';
import { SignUpInput } from './dto/sign-up.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import {PrismaService} from "../prisma.service";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import * as argon from "argon2"
import {User} from "@prisma/client";
import {SignInInput} from "./dto/sign-in.input";

@Injectable()
export class AuthService {

  constructor(
      private readonly prismaService: PrismaService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService
  ) {
  }

  async signUp(signUpInput: SignUpInput) {
    const hashedPassword = await argon.hash(signUpInput.password);
    const user= await this.prismaService.user.create({
      data: {
        email: signUpInput.email,
        username: signUpInput.username,
        hashedPassword
      }
    });

    const {accessToken, refreshToken} = await this.createTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, refreshToken);
    return {accessToken, refreshToken, user}
  }

  async createTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign({
      userId, email
    }, {expiresIn: '60s', secret: this.configService.get('ACCESS_TOKEN_SECRET')});

    const refreshToken = this.jwtService.sign({
      userId, email, accessToken
    }, {expiresIn: '7d', secret: this.configService.get('REFRESH_TOKEN_SECRET')});

    return {accessToken, refreshToken};
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await argon.hash(refreshToken);
    await this.prismaService.user.update({where: {id: userId}, data: {hashedRefreshToken}})
  }

  async signIn(signIn: SignInInput) {
    const user = await this.prismaService.user.findUnique({where: {email: signIn.email}})
    if (!user) throw new ForbiddenException('Access Denied')
    const comparePass = await argon.verify(user.hashedPassword, signIn.password)
    if (!comparePass) throw new ForbiddenException('Access Denied')

    const {accessToken, refreshToken} = await this.createTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, refreshToken);
    return {accessToken, refreshToken, user}
  }

  async logout(userId: string) {
    await this.prismaService.user.updateMany({
      where: {
        id: userId,
        hashedRefreshToken: {not: null}
      },
      data: {hashedRefreshToken: null}
    })
    return {loggedOut: true}
  }

  hello() {
    return `hello world!`;
  }
}
