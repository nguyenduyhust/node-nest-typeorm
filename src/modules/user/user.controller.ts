import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PassedAuthMiddlewareRequest } from '~/app.middleware';

import { GetUsersQueryDTO, GetUsersResponseDTO, UserDTO } from './user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get profile' })
  @ApiResponse({
    status: 200,
    type: UserDTO,
  })
  @HttpCode(200)
  getProfile(@Req() req: PassedAuthMiddlewareRequest): Promise<UserDTO> {
    return this.userService.getMe(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of users' })
  @ApiResponse({
    status: 200,
    type: GetUsersResponseDTO,
  })
  getMany(@Query() query: GetUsersQueryDTO) {
    const { page, limit, sortBy, orderBy, ...filtering } = query;
    return this.userService.getMany({ page, limit }, { sortBy, orderBy }, filtering);
  }
}
