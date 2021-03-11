import * as jwt from 'jsonwebtoken';

const BEARER_SCHEMA_PREFIX = 'Bearer ';

interface DecodedToken {
  iat: number;
  exp: number;
}

export class TokenHelper {
  static generate(
    payload: Record<string, any>,
    secret: string,
    expiresIn: number | string,
  ): string {
    return jwt.sign(payload, secret, {
      expiresIn,
    });
  }

  static verify<T>(token: string, secret: string) {
    return jwt.verify(token, secret) as DecodedToken & T;
  }

  static decode<T>(token: string, options?: jwt.DecodeOptions) {
    return jwt.decode(token, options) as DecodedToken & T;
  }

  static tokenToBearerSchema(token: string) {
    return `${BEARER_SCHEMA_PREFIX}${token}`;
  }

  static bearerSchemaToToken(bearerSchema: string) {
    return bearerSchema.replace(BEARER_SCHEMA_PREFIX, '');
  }
}
