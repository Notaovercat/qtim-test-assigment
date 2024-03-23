import { Module } from "@nestjs/common";
import { ArticleModule } from "./article/article.module";
import { AuthModule } from "./auth/auth.module";

@Module({
	imports: [AuthModule, ArticleModule],
})
export class CoreModule {}
