import { JwtService } from "@nestjs/jwt";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "./auth.service";
import { Test, TestingModule } from "@nestjs/testing";
import { createMock } from "@golevelup/ts-jest";
import { SignUpDto } from "../dto/sign_up.dto";
import { UserEntity } from "../entity/user.entity";
import { ConfigService } from "@nestjs/config";
import { BadRequestException } from "@nestjs/common";
import { SignInDto } from "../dto/sign_in.dto";
import * as argon2 from "argon2";

describe("ArticleService", () => {
	let service: AuthService;
	let repo: UserRepository;
	let jwt: JwtService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				ConfigService,
				{
					provide: UserRepository,
					useValue: createMock<UserRepository>(),
				},
				{
					provide: JwtService,
					useValue: createMock<JwtService>(),
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		repo = module.get<UserRepository>(UserRepository);
		jwt = module.get<JwtService>(JwtService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("register", () => {
		it("Should register a new user", async () => {
			const dto: SignUpDto = {
				email: "example@email.com",
				username: "AnderD",
				password: "12345qweR!",
			};

			const result = {
				id: 1,
				email: "example@email.com",
				username: "AnderD",
				password: "12345qweR",
			} as UserEntity;

			jest.spyOn(repo, "findOneByEmail").mockResolvedValue(null);
			jest.spyOn(repo, "create").mockResolvedValue(result);

			const createdUser = await service.register(dto);

			expect(createdUser).toBe(result);
		});

		it("Should throw an error if user with same email exists", async () => {
			const dto: SignUpDto = {
				email: "example@email.com",
				username: "AnderD",
				password: "12345qweR!",
			};

			const foundUser = {
				id: 2,
				email: "example@email.com",
				username: "TestUser",
				password: "12345qweR",
			} as UserEntity;

			jest.spyOn(repo, "findOneByEmail").mockResolvedValue(foundUser);

			const createdUser = service.register(dto);

			expect(createdUser).rejects.toThrow(BadRequestException);
		});
	});

	describe("validate", () => {
		it("Should return user object", async () => {
			const foundUser = {
				id: 2,
				email: "example@email.com",
				username: "TestUser",
				password: await argon2.hash("12345qweR!"),
			} as UserEntity;

			jest.spyOn(repo, "findOneByEmail").mockResolvedValue(foundUser);

			const dto: SignInDto = {
				email: "example@email.com",
				password: "12345qweR!",
			};

			const user = await service.validate(dto);

			expect(user).toBe(foundUser);
		});

		it("Should throw an error cause of wrong password", async () => {
			const foundUser = {
				id: 2,
				email: "example@email.com",
				username: "TestUser",
				password: await argon2.hash("test12345qweR!"),
			} as UserEntity;

			jest.spyOn(repo, "findOneByEmail").mockResolvedValue(foundUser);

			const dto: SignInDto = {
				email: "example@email.com",
				password: "12345qweR!",
			};

			const user = service.validate(dto);

			expect(user).rejects.toThrow(BadRequestException);
		});

		it("Should throw an error cause of wrong email", async () => {
			jest.spyOn(repo, "findOneByEmail").mockResolvedValue(null);

			const dto: SignInDto = {
				email: "new@email.com",
				password: "12345qweR!",
			};

			const user = service.validate(dto);

			expect(user).rejects.toThrow(BadRequestException);
		});
	});

	describe("signIn", () => {
		it("Should return jwt token", async () => {
			const user = {
				id: 2,
				email: "example@email.com",
				username: "TestUser",
				password: await argon2.hash("12345qweR!"),
			} as UserEntity;

			const jwtResult = service.signIn(user);

			const result = {
				at: jwt.sign(
					{ email: user.email, id: user.id },
					{
						secret: process.env.JWT_SECRET,
						expiresIn: process.env.JWT_EXPIRES_IN,
					},
				),
			};

			expect(jwtResult).toStrictEqual(result);
		});
	});
});
