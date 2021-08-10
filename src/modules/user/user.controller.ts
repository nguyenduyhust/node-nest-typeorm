import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { GetUsersQueryDTO, GetUsersResponseDTO } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    type: GetUsersResponseDTO,
  })
  getMany(@Query() query: GetUsersQueryDTO) {
    const { page, limit, sortBy, orderBy, ...filtering } = query;
    return this.userService.getMany({ page, limit }, { sortBy, orderBy }, filtering);
  }
}
