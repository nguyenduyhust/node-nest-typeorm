import { HttpException, HttpStatus } from '@nestjs/common';

export const BadRequestException = (msg: string) => {
  return new HttpException(msg, HttpStatus.BAD_REQUEST);
};

export const UnauthorizedException = (msg: string) => {
  return new HttpException(msg, HttpStatus.UNAUTHORIZED);
};

export const NotFoundException = (msg: string) => {
  return new HttpException(msg, HttpStatus.NOT_FOUND);
};

export const ForbiddenException = (msg: string) => {
  return new HttpException(msg, HttpStatus.FORBIDDEN);
};

export const InternalServerErrorException = (msg: string) => {
  return new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
};
