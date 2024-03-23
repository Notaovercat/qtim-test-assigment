import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
} from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";
import { Repository, TypeORMError } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { SignUpDto } from "../dto/sign_up.dto";

@Injectable()
export class UserRepository {
	private readonly logger: Logger = new Logger(UserRepository.name);

	constructor(
		@InjectRepository(UserEntity)
		private readonly user: Repository<UserEntity>,
	) {}

	async create(data: SignUpDto) {
		try {
			const newUser = this.user.create(data);

			const user = await this.user.save(newUser);

			return user;
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

	findOneByEmail(email: string): Promise<UserEntity | null> {
		return this.user.findOneBy({ email });
	}

	findOneById(id: number): Promise<UserEntity | null> {
		return this.user.findOneBy({ id });
	}
}
