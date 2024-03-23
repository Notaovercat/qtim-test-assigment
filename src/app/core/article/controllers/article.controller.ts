import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { ArticleService } from "../services/article.service";
import { CreateArticleDto } from "../dto/create_article,dto";
import JwtAuthGuard from "@libs/guards/jwt.guard";
import { User } from "@libs/decorators";
import { IUser } from "@libs/interfaces";
import { QueryDto } from "../dto/query.dto";
import { UpdateArticleDto } from "../dto/update_article.dto";
import {
	ApiBadRequestResponse,
	ApiBearerAuth,
	ApiCreatedResponse,
	ApiForbiddenResponse,
	ApiInternalServerErrorResponse,
	ApiNotFoundResponse,
	ApiOkResponse,
	ApiOperation,
	ApiTags,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@ApiTags("Articles")
@Controller("articles")
export class ArticlesController {
	private readonly logger: Logger = new Logger(ArticlesController.name);

	constructor(private readonly articleService: ArticleService) {}

	@ApiOperation({ summary: "Get all articles" })
	@Get()
	getAll(@Query() params: QueryDto) {
		return this.articleService.getAllArticles(params);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Create new article" })
	@ApiCreatedResponse({ description: "The article has successfully created" })
	@ApiBadRequestResponse({
		description: "An article with the same title already exists",
	})
	@ApiInternalServerErrorResponse({
		description: "Unknown error while creating a row",
	})
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	@UseGuards(JwtAuthGuard)
	@Post()
	addNew(@Body() dto: CreateArticleDto, @User() user: IUser) {
		return this.articleService.createNewArticle(dto, user.id);
	}

	@ApiOperation({ summary: "Get articles by id" })
	@ApiOkResponse({ description: "Get article" })
	@ApiNotFoundResponse({ description: "No such article with this id" })
	@Get(":id")
	getOne(@Param("id") id: number) {
		return this.articleService.getArticleById(id);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Update an article by id" })
	@ApiOkResponse({ description: "The article has successfully updated" })
	@ApiForbiddenResponse({ description: "User is not an author" })
	@ApiBadRequestResponse({
		description: "An article with the same title already exists",
	})
	@ApiUnauthorizedResponse({ description: "Unauthorized" })
	@UseGuards(JwtAuthGuard)
	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() dto: UpdateArticleDto,
		@User() user: IUser,
	) {
		return this.articleService.updateArticle(+id, dto, user.id);
	}

	@ApiBearerAuth()
	@ApiOperation({ summary: "Delete an article by id" })
	@ApiOkResponse({ description: "The article has succesfully deleted" })
	@ApiForbiddenResponse({ description: "User is not an author" })
	@ApiNotFoundResponse({ description: "No such article with this id" })
	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	delete(@Param("id") articleId: number, @User() user: IUser) {
		return this.articleService.deleteArticle(articleId, user.id);
	}
}
