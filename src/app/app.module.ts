import { Module } from "@nestjs/common";
import { CoreModule } from "./core/core.module";
import { ConfigModule } from "@app/config";
import { DatabaseModule } from "./database/database.module";
import { LoggerModule } from "nestjs-pino";
import { CacheModule } from "@nestjs/cache-manager";
import { RedisClientOptions } from "redis";
import { ConfigService } from "@nestjs/config";
import { StoreConfig } from "cache-manager";
import { redisStore } from "cache-manager-redis-yet";

@Module({
	imports: [
		CoreModule,
		ConfigModule,
		DatabaseModule,
		LoggerModule.forRoot({
			pinoHttp: {
				autoLogging: false,
				transport: {
					target: "pino-pretty",
					options: { singleLine: false },
				},
				quietReqLogger: true,
			},
		}),
		CacheModule.registerAsync<RedisClientOptions>({
			isGlobal: true,
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				({
					store: redisStore,
					host: configService.get("REDIS_HOST"),
					port: configService.get("REDIS_PORT"),
					ttl: 36000,
				}) as StoreConfig,
		}),
	],
})
export class AppModule {}
