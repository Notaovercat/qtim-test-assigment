import { ArticleEntity } from "../../article/entity/article.entity";
import { IUser } from "@libs/interfaces";
import {
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	Relation,
} from "typeorm";

@Entity("users")
export class UserEntity implements IUser {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	email: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@OneToMany(
		() => ArticleEntity,
		(article) => article.author,
	)
	created_articles: Relation<ArticleEntity[]>;

	@CreateDateColumn()
	created_at: Date;
}
