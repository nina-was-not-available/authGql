import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ConfigService} from "@nestjs/config";
import {ExtractJwt, Strategy} from "passport-jwt"
import {JwtPayload} from "../types";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(public readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("ACCESS_TOKEN_SECRET"),
        });
    }
    async validate(payload: JwtPayload) {
        return payload
    }
}