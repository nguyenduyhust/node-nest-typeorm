import { Controller, Post, Body, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { CreateUserDTO, UserPaginationDTO } from './user.dto';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  // @Post()
  // async create(@Body() payload: CreateUserDTO) {
  //   return this.userService.create(payload);
  // }

  @Get()
  @ApiResponse({
    status: 200,
    type: UserPaginationDTO,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getEvents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getUsers({
      page,
      limit,
      route: `${this.configService.get('app.apiUrl')}/users`,
    });
  }
}
