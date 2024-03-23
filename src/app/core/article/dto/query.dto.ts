import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional } from "class-validator";

export class QueryDto {
	@ApiProperty({ required: false, type: Date, description: "Filter by date" })
	@IsDate()
	@IsOptional()
	date?: Date;

	@ApiProperty({
		required: false,
		enum: ["lt", "mt"],
		description: "Date comparison option (lt: less than, mt: more than)",
	})
	@IsOptional()
	date_option?: "lt" | "mt";

	@ApiProperty({
		required: false,
		type: Number,
		description: "Filter by author ID",
	})
	@IsNumber()
	@IsOptional()
	author_id?: number;

	@ApiProperty({
		required: false,
		type: Number,
		description: "Number of records to take",
		default: 10,
	})
	@IsNumber()
	@IsOptional()
	take?: number;

	@ApiProperty({
		required: false,
		type: Number,
		description: "Number of records to skip",
		default: 0,
	})
	@IsNumber()
	@IsOptional()
	skip?: number;
}
