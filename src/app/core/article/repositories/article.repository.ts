import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArticleEntity } from "../entity/article.entity";
import {
	FindOperator,
	LessThan,
	MoreThan,
	Repository,
	TypeORMError,
} from "typeorm";
import { CreateArticleDto } from "../dto/create_article,dto";
import { QueryDto } from "../dto/query.dto";
import { IArticle } from "@libs/interfaces";

@Injectable()
export class ArticleRepository {
	private readonly logger: Logger = new Logger(ArticleRepository.name);

	constructor(
		@InjectRepository(ArticleEntity)
		private readonly article: Repository<ArticleEntity>,
	) {}

	/** Returns an array of articles */
	async findAllWithFilter(params: QueryDto) {
		/** Define parametrs for pagination */
		const take = params.take || 10;
		const skip = params.skip || 0;

		const queryBuilder = this.article.createQueryBuilder("article");
		queryBuilder.take(take).skip(skip);

		queryBuilder.innerJoin("article.author", "author");
		queryBuilder.select([
			"article.id",
			"article.title",
			"article.content",
			"article.created_at",
			"author.id",
			"author.email",
			"author.username",
		]);

		// if (params.title) {
		// 	queryBuilder.andWhere("article.title = :title", { title: params.title });
		// }

		if (params.date) {
			if (params.date_option === "mt") {
				queryBuilder.andWhere("article.created_at > :date", {
					date: params.date,
				});
			} else if (params.date_option === "lt") {
				queryBuilder.andWhere("article.created_at < :date", {
					date: params.date,
				});
			} else {
				queryBuilder.andWhere("article.created_at = :date", {
					date: params.date,
				});
			}
		}

		if (params.author_id) {
			queryBuilder.andWhere("author.id = :author_id", {
				author_id: params.author_id,
			});
		}

		const articles = await queryBuilder.getMany();

		return articles;
	}

	findOneById(id: number): Promise<ArticleEntity> {
		// return this.article.findOneBy({ id });
		return this.article
			.createQueryBuilder("article")
			.innerJoin("article.author", "author")
			.select([
				"article.id",
				"article.title",
				"article.content",
				"article.created_at",
				"author.id",
				"author.email",
				"author.username",
			])
			.where("article.id = :id", { id })
			.getOne();
	}

	async findOneByTitle(title: string): Promise<ArticleEntity> {
		return this.article.findOneBy({ title });
	}

	async create(data: CreateArticleDto, userId: number) {
		try {
			const newArticle = this.article.create({
				...data,
				author: { id: userId },
			});

			const article = await this.article.save(newArticle);

			return article;
		} catch (err) {
			this.logger.error(err);
			if (err instanceof TypeORMError) {
				switch (err.name) {
					case "QueryFailedError":
						throw new BadRequestException(err.message);

					default:
						throw new InternalServerErrorException(
							"Unknown error while creating a row",
						);
				}
			}
		}
	}

	async update(article: IArticle) {
		return this.article.save(article);
	}

	async delete(id: number) {
		return this.article.delete({ id });
	}
}
