import {Module} from '@nestjs/common';
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo";
import {GraphQLModule} from "@nestjs/graphql";
import {join} from "path";
import * as process from "node:process";
import {ConfigModule} from "@nestjs/config";
import {AuthModule} from './auth/auth.module';
import {UserModule} from './user/user.module';
import {PrismaService} from "./prisma.service";
import {APP_GUARD} from "@nestjs/core";
import {AccessTokenGuard} from "./auth/guards/accessToken.guard";

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true
        }),
        ConfigModule.forRoot({isGlobal: true}),
        AuthModule,
        UserModule,
    ],
    providers: [PrismaService, {provide: APP_GUARD, useClass: AccessTokenGuard}]
})
export class AppModule {
}
