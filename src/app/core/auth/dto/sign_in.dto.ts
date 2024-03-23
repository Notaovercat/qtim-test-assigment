import { ISignIn } from "@libs/interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class SignInDto implements ISignIn {
	@ApiProperty({
		example: "example@email.org",
	})
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@ApiProperty({ required: true })
	@IsStrongPassword()
	@IsNotEmpty()
	password: string;
}
