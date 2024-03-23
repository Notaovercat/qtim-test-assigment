import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app/app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "nestjs-pino";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ bufferLogs: true },
	);

	app.setGlobalPrefix("api/v1");

	const config = new DocumentBuilder()
		.setTitle("Docs")
		.setDescription("Qtim Test Assignment")
		.setVersion("0.1")
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("docs", app, document);

	app.enableCors({
		origin: "*",
	});

	const logger = app.get(Logger);
	app.useLogger(logger);

	const configService = app.get(ConfigService);
	const app_port = configService.get<number>("API_PORT");

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: { enableImplicitConversion: true },
		}),
	);

	await app.listen(app_port, () =>
		logger.log(`Server is started on port ${app_port}`),
	);
}

bootstrap();
