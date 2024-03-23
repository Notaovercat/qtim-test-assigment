import { Test, TestingModule } from "@nestjs/testing";
import { ArticleService } from "./article.service";
import { ArticleRepository } from "../repositories/article.repository";
import { createMock } from "@golevelup/ts-jest";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { QueryDto } from "../dto/query.dto";
import { ArticleEntity } from "../entity/article.entity";
import { Cache } from "cache-manager";
import {
	BadRequestException,
	ForbiddenException,
	NotFoundException,
} from "@nestjs/common";
import { CreateArticleDto } from "../dto/create_article,dto";
import { UpdateArticleDto } from "../dto/update_article.dto";
import { DeleteResult } from "typeorm";

describe("ArticleService", () => {
	let service: ArticleService;
	let repo: ArticleRepository;
	let cache: Cache;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ArticleService,
				{
					provide: CACHE_MANAGER,
					useValue: createMock<Cache>(),
				},
				{
					provide: ArticleRepository,
					useValue: createMock<ArticleRepository>(),
				},
			],
		}).compile();

		service = module.get<ArticleService>(ArticleService);
		repo = module.get<ArticleRepository>(ArticleRepository);
		cache = module.get<Cache>(CACHE_MANAGER);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("Should be defined", () => {
		expect(service).toBeDefined();
	});

	describe("getAllArticles", () => {
		it("Should get an array from repository", async () => {
			const mockParams: QueryDto = {};

			const repositoryData = [
				{
					id: 1,
					title: "Article 1",
					content: "Description",
					author: {
						id: 1,
						username: "User",
						email: "test@test.com",
					},
				},
			] as ArticleEntity[];

			jest.spyOn(repo, "findAllWithFilter").mockResolvedValue(repositoryData);
			jest.spyOn(cache, "get").mockResolvedValue("");

			const articles = await service.getAllArticles(mockParams);

			expect(articles).toBe(repositoryData);
		});

		it("Should get an array from cache", async () => {
			const mockParams: QueryDto = {};

			const cacheData = [
				{
					id: 1,
					title: "Article 1",
					content: "Description",
					author: { id: 1, username: "User", email: "test@test.com" },
				},
			];

			jest.spyOn(cache, "get").mockResolvedValue(JSON.stringify(cacheData));

			const articles = await service.getAllArticles(mockParams);

			expect(articles).toStrictEqual(cacheData);
		});
	});

	describe("getArticleById", () => {
		it("Should get an article from repository", async () => {
			const repositoryData = {
				id: 1,
				title: "Article 1",
				content: "Description",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest.spyOn(repo, "findOneById").mockResolvedValue(repositoryData);
			jest.spyOn(cache, "get").mockResolvedValue("");

			const spyOnCacheSet = jest.spyOn(cache, "set");

			const articles = await service.getArticleById(repositoryData.id);

			expect(articles).toBe(repositoryData);
			expect(spyOnCacheSet).toHaveBeenCalledWith(
				`article:${repositoryData.id}`,
				JSON.stringify(articles),
			);
		});

		it("Should throw a 404 error", async () => {
			jest.spyOn(cache, "get").mockResolvedValue("");
			jest.spyOn(repo, "findOneById").mockResolvedValue(null);

			expect(service.getArticleById(1)).rejects.toThrow(NotFoundException);
		});

		it("Should get an array from cache", async () => {
			const repositoryData = {
				id: 1,
				title: "Article 1",
				content: "Description",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest
				.spyOn(cache, "get")
				.mockResolvedValue(JSON.stringify(repositoryData));

			const articles = await service.getArticleById(1);

			expect(articles).toStrictEqual(repositoryData);
		});
	});

	describe("createNewArticle", () => {
		it("Should create new article", async () => {
			const dto: CreateArticleDto = {
				title: "Test Title",
				content: "Content for a title",
			};

			const result = {
				id: 1,
				title: "Test Title",
				content: "Content for a title",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest.spyOn(repo, "create").mockResolvedValue(result);
			jest.spyOn(repo, "findOneByTitle").mockResolvedValue(null);

			const createdArticle = await service.createNewArticle(dto, 1);
			expect(createdArticle).toBe(result);
		});

		it("Should throw bad request error on duplicate title", async () => {
			const dto: CreateArticleDto = {
				title: "Test Title",
				content: "Content for a title",
			};

			const existedArticle = {
				id: 1,
				title: "Test Title",
				content: "Content for a title",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest.spyOn(repo, "findOneByTitle").mockResolvedValue(existedArticle);

			const createdArticle = service.createNewArticle(dto, 1);
			expect(createdArticle).rejects.toThrow(BadRequestException);
		});
	});

	describe("updateArticle", () => {
		it("Should update article", async () => {
			const dto: UpdateArticleDto = {
				title: "New Title",
			};

			const oldArticle = {
				id: 1,
				title: "Test Title",
				content: "Content for a title",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			const userId = oldArticle.author.id;

			const newArticle = {
				id: 1,
				title: "New Title",
				content: "Content for a title",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest.spyOn(service, "getArticleById").mockResolvedValue(oldArticle);
			jest.spyOn(repo, "findOneByTitle").mockResolvedValue(null);
			jest.spyOn(repo, "update").mockResolvedValue(newArticle);

			const spyOnClearCache = jest
				.spyOn(service, "clearCache")
				.mockResolvedValue([]);

			const updatedArticle = await service.updateArticle(
				oldArticle.id,
				dto,
				userId,
			);

			expect(updatedArticle).toBe(newArticle);
			expect(spyOnClearCache).toHaveBeenCalled();
		});

		it("Should throw an error if user is not an author", async () => {
			const dto: UpdateArticleDto = {
				title: "New Title",
			};

			const oldArticle = {
				id: 1,
				title: "Test Title",
				content: "Content for a title",
				author: {
					id: 2,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			const userId = 1;

			jest.spyOn(service, "getArticleById").mockResolvedValue(oldArticle);
			jest.spyOn(repo, "findOneByTitle").mockResolvedValue(null);

			const updatedArticle = service.updateArticle(oldArticle.id, dto, userId);

			expect(updatedArticle).rejects.toThrow(ForbiddenException);
		});
	});

	describe("deleteArticle", () => {
		it("Should delete an article", async () => {
			const oldArticle = {
				id: 1,
				title: "Test Title",
				content: "Content for a title",
				author: {
					id: 1,
					username: "User",
					email: "test@test.com",
				},
			} as ArticleEntity;

			jest.spyOn(service, "getArticleById").mockResolvedValue(oldArticle);
			jest.spyOn(service, "clearCache").mockResolvedValue([]);

			const result: DeleteResult = {
				raw: [],
				affected: 1,
			};
			jest.spyOn(repo, "delete").mockResolvedValue(result);

			const deleteArticle = await service.deleteArticle(
				oldArticle.id,
				oldArticle.author.id,
			);

			expect(deleteArticle).toBe(result);
		});
	});
});
