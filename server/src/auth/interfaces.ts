import { Token } from '@prisma/client';

export interface ITokens {
  accessToken: string;
  refreshToken: Token;
}
