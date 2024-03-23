import { UserEntity } from "../../auth/entity/user.entity";
import { IArticle } from "@libs/interfaces";
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Relation,
} from "typeorm";

@Entity("articles")
export class ArticleEntity implements IArticle {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ unique: true })
	title: string;

	@Column()
	content: string;

	@CreateDateColumn()
	created_at: Date;

	@ManyToOne(
		() => UserEntity,
		(user) => user.created_articles,
	)
	@JoinColumn({ name: "author_id" })
	author: Relation<UserEntity>;
}
