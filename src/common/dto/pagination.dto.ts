import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MetaPaginationDTO {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class LinksPaginationDTO {
  @ApiPropertyOptional()
  first?: string;

  @ApiPropertyOptional()
  previous?: string;

  @ApiPropertyOptional()
  next?: string;

  @ApiPropertyOptional()
  last?: string;
}

export class PaginationDTO {
  @ApiProperty()
  meta: MetaPaginationDTO;

  @ApiProperty()
  links: LinksPaginationDTO;
}
