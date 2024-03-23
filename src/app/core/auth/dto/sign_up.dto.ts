import { ISignUp } from "@libs/interfaces";
import { ApiProperty } from "@nestjs/swagger";
import {
	IsEmail,
	IsNotEmpty,
	IsString,
	IsStrongPassword,
	MinLength,
} from "class-validator";

export class SignUpDto implements ISignUp {
	@ApiProperty({
		example: "example@email.org",
	})
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@ApiProperty({
		example: "AnrewD",
	})
	@IsNotEmpty()
	@IsString()
	@MinLength(4)
	username: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
