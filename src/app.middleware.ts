import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '@modules/auth/auth.service';
import { ErrorUtils } from '~/common/utils';
import { UserDTO } from './modules/user/user.dto';

export type PassedAuthMiddlewareRequest<R extends Request = Request> = R & {
  user: UserDTO;
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: any, res: any, next: () => void) {
    // validate request
    const user = await this.authService.validateRequest(req);
    if (!user) {
      ErrorUtils.UnauthorizedException('Unauthorized');
    }
    req.user = user;
    next();
  }
}
