import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import * as argon2 from "argon2";
import { SignUpDto } from "../dto/sign_up.dto";
import { SignInDto } from "../dto/sign_in.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { IUser } from "@libs/interfaces";

@Injectable()
export class AuthService {
	private readonly logger: Logger = new Logger(AuthService.name);
	constructor(
		private readonly userRepo: UserRepository,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async register(dto: SignUpDto) {
		const isUserExists = await this.userRepo.findOneByEmail(dto.email);
		if (isUserExists)
			throw new BadRequestException("User which such email already exists");

		dto.password = await argon2.hash(dto.password);

		return this.userRepo.create(dto);
	}

	/** Validate users credentionals */
	async validate(dto: SignInDto) {
		const user = await this.userRepo.findOneByEmail(dto.email);
		if (!user) throw new BadRequestException("Wrong email password");

		const comparePasswords = await argon2.verify(user.password, dto.password);
		if (!comparePasswords)
			throw new BadRequestException("Wrong email password");

		return user;
	}

	signIn(user: IUser) {
		const payload = { email: user.email, id: user.id };

		return {
			at: this.jwtService.sign(payload, {
				secret: this.configService.get("JWT_SECRET"),
				expiresIn: this.configService.get("JWT_EXPIRES_IN"),
			}),
		};
	}

	getUserById(id: number) {
		return this.userRepo.findOneById(id);
	}
}
