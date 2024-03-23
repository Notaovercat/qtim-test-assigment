import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ArticleEntity } from "./entity/article.entity";
import { ArticlesController } from "./controllers/article.controller";
import { ArticleService } from "./services/article.service";
import { ArticleRepository } from "./repositories/article.repository";

@Module({
	imports: [TypeOrmModule.forFeature([ArticleEntity])],
	controllers: [ArticlesController],
	providers: [ArticleRepository, ArticleService],
})
export class ArticleModule {}
