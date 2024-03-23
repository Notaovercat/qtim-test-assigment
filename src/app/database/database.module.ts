import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: "postgres",
				host: configService.get("POSTGRES_HOST"),
				port: configService.get("POSTGRES_PORT"),
				username: configService.get("POSTGRES_USER"),
				password: configService.get("POSTGRES_PASSWORD"),
				database: configService.get("POSTGRES_DB"),
				// entities: [`${__dirname}/../**/*.entity.{js,ts}`],
				synchronize: false,
				autoLoadEntities: true,
			}),
		}),
	],
})
export class DatabaseModule {}
