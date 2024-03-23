import { FindOperator } from "typeorm";

export interface IArticle {
	id: number;
	title: string;
	content: string;
	created_at: Date;
}

export interface ICreateArticleDto {
	title: string;
	content: string;
}

export interface IUpdateArticleDto extends Partial<ICreateArticleDto> {}

export interface IFilterParams {
	title?: string;
	// author_id?: number;
	created_at?: FindOperator<Date> | Date;
}
