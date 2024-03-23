import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from "@nestjs/common";
import { ArticleRepository } from "../repositories/article.repository";
import { CreateArticleDto } from "../dto/create_article,dto";
import { QueryDto } from "../dto/query.dto";
import { UpdateArticleDto } from "../dto/update_article.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Injectable()
export class ArticleService {
	private readonly logger: Logger = new Logger(ArticleService.name);

	constructor(
		private readonly articleRepo: ArticleRepository,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	/** Clear cache with keys defined by pattern */
	async clearCache(pattern: string) {
		const keys: string[] = await this.cacheManager.store.keys(`*${pattern}*`);
		const promises = [];
		for (const i of keys) {
			promises.push(this.cacheManager.del(i));
		}

		return Promise.all(promises);
	}

	/** Checks is user is author of an article */
	private async checkAuthor(authorId: number, userId: number) {
		if (authorId !== userId)
			throw new ForbiddenException("User is not an author");
	}

	/** Checks is article with same title exists */
	private async checkIsTitleExists(title: string) {
		const isExists = await this.articleRepo.findOneByTitle(title);
		if (isExists)
			throw new BadRequestException(
				"An article with the same title already exists",
			);
	}

	async getAllArticles(params: QueryDto) {
		const key = `articles:${JSON.stringify(params)}`;
		const cache: string = await this.cacheManager.get(key);

		if (cache) return JSON.parse(cache);

		const articles = await this.articleRepo.findAllWithFilter(params);

		await this.cacheManager.set(key, JSON.stringify(articles));

		return articles;
	}

	async getArticleById(id: number) {
		const key = `article:${id}`;
		const cache: string = await this.cacheManager.get(key);
		if (cache) return JSON.parse(cache);

		const article = await this.articleRepo.findOneById(id);
		if (!article) throw new NotFoundException("No such article with this id");

		await this.cacheManager.set(key, JSON.stringify(article));

		return article;
	}

	async createNewArticle(dto: CreateArticleDto, userId: number) {
		await this.checkIsTitleExists(dto.title);

		return this.articleRepo.create(dto, userId);
	}

	async updateArticle(
		articleId: number,
		dto: UpdateArticleDto,
		userId: number,
	) {
		const article = await this.getArticleById(articleId);

		await this.checkAuthor(article.author.id, userId);
		await this.checkIsTitleExists(dto.title);

		const updatedArticle = await this.articleRepo.update({
			...article,
			...dto,
		});

		await this.clearCache("article");

		return updatedArticle;
	}

	async deleteArticle(articleId: number, userId: number) {
		const article = await this.getArticleById(articleId);

		await this.checkAuthor(article.author.id, userId);

		await this.clearCache("article");
		return this.articleRepo.delete(articleId);
	}
}
