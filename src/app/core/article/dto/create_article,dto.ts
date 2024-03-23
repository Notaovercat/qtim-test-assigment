import { ICreateArticleDto } from "@libs/interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateArticleDto implements ICreateArticleDto {
	@ApiProperty({
		example: "Test Title",
		required: true,
		minLength: 5,
	})
	@IsString()
	@MinLength(5)
	@IsNotEmpty()
	title: string;

	@ApiProperty({
		example: "The content of a article",
		required: true,
		minLength: 5,
	})
	@IsString()
	@MinLength(5)
	@IsNotEmpty()
	content: string;
}
