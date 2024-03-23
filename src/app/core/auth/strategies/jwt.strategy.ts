import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "@app/core/auth/services/auth.service";
import { FastifyRequest } from "fastify";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	private readonly logger: Logger = new Logger(JwtStrategy.name);

	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}

	async validate(payload: { id: number }) {
		const user = await this.authService.getUserById(payload.id);

		if (!user) throw new UnauthorizedException("No such user");

		user.password = undefined;
		return user;
	}
}
