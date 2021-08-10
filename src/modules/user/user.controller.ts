import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { UserPaginationDTO } from './user.dto';
import { UserService } from './user.service';
import { EnvConfiguration } from '~/config/configuration';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private configService: ConfigService<EnvConfiguration>,
    private readonly userService: UserService,
  ) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: UserPaginationDTO,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMany(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.userService.getMany({
      page,
      limit,
      route: `${this.configService.get('apiUrl')}/users`,
    });
  }
}
