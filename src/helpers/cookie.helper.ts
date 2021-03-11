import { Response, CookieOptions, Request } from 'express';
import { TokenHelper } from '@helpers/token.helper';

const TOKEN_COOKIE_NAME = 'jwt-token';

export class CookieHelper {
  static setToken(res: Response, token: string, options?: CookieOptions): void {
    const bearerSchema = TokenHelper.tokenToBearerSchema(token);
    res.cookie(TOKEN_COOKIE_NAME, bearerSchema, {
      httpOnly: true,
      maxAge: TokenHelper.decode(token).exp,
      ...options,
    });
  }

  static getToken(req: Request): string | undefined {
    return (
      req.cookies &&
      req.cookies[TOKEN_COOKIE_NAME] &&
      TokenHelper.bearerSchemaToToken(req.cookies[TOKEN_COOKIE_NAME])
    );
  }

  static clearToken(res: Response) {
    res.clearCookie(TOKEN_COOKIE_NAME);
  }
}
