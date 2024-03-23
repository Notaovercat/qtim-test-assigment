import { IUpdateArticleDto } from "@libs/interfaces";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class UpdateArticleDto implements IUpdateArticleDto {
	@ApiProperty({
		example: "Test Title",
		required: false,
		minLength: 5,
	})
	@IsString()
	@MinLength(5)
	@IsOptional()
	title?: string;

	@ApiProperty({
		example: "The content of a article",
		required: false,
		minLength: 5,
	})
	@IsString()
	@MinLength(5)
	@IsOptional()
	content?: string;
}
