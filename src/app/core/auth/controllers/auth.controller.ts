import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseGuards,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { SignUpDto } from "../dto/sign_up.dto";
import { User } from "@libs/decorators";
import { LocalGuard } from "@libs/guards/local.guard";
import { IUser } from "@libs/interfaces";
import {
	ApiBadRequestResponse,
	ApiBody,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
} from "@nestjs/swagger";
import { SignInDto } from "../dto/sign_in.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({ summary: "Sign in" })
	@ApiBody({ type: SignInDto })
	@ApiOkResponse({ description: "Get a jwt token" })
	@ApiBadRequestResponse({ description: "Wrong email or password" })
	@HttpCode(HttpStatus.OK)
	@Post("signin")
	@UseGuards(LocalGuard)
	async signIn(@User() user: IUser) {
		return this.authService.signIn(user);
	}

	@ApiOperation({ summary: "Sign up" })
	@ApiCreatedResponse({ description: "User has created" })
	@ApiBadRequestResponse({
		description: "User which such email already exists",
	})
	@Post("signup")
	async signUp(@Body() dto: SignUpDto) {
		await this.authService.register(dto);
		return "Success";
	}
}
