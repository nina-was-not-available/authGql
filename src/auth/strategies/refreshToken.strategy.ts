import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {JwtPayload, JwtPayloadWithRefreshToken} from "../types";
import {Request} from "express";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor(public readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("REFRESH_TOKEN_SECRET"),
            passReqToCallback: true
        });
    }
    validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim()
        console.log(payload, refreshToken)
        return {...payload, refreshToken}
    }
}