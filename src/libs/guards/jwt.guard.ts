import { ExecutionContext, Injectable, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export default class JwtAuthGuard extends AuthGuard("jwt") {
	private readonly logger: Logger = new Logger(JwtAuthGuard.name);

	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride("isPublic", [
			context.getHandler(),
			context.getClass(),
		]);

		const user = context.switchToHttp().getRequest().user;

		if (isPublic && user) return super.canActivate(context);
		if (isPublic) return true;

		return super.canActivate(context);
	}
}
