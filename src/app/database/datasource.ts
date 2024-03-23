import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { config } from "dotenv";

config();

const configService = new ConfigService();

export const options: DataSourceOptions = {
	type: "postgres",
	host: configService.get("POSTGRES_HOST"),
	port: configService.get("POSTGRES_PORT"),
	username: configService.get("POSTGRES_USER"),
	password: configService.get("POSTGRES_PASSWORD"),
	database: configService.get("POSTGRES_DB"),
	entities: ["dist/**/*.entity.js"],
	migrations: ["dist/migrations/*.js"],
};

const dataSource = new DataSource(options);

export default dataSource;
