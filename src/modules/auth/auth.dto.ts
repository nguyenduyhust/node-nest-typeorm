import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional, MinLength, IsEmail } from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  @MaxLength(60, { message: '60' })
  @IsNotEmpty({ message: 'required' })
  email: string;

  @ApiProperty()
  @MinLength(6, { message: '6' })
  @MaxLength(60, { message: '60' })
  @IsNotEmpty({ message: 'required' })
  password: string;

  @ApiProperty()
  @MaxLength(180, { message: '180' })
  @IsNotEmpty({ message: 'required' })
  fullName: string;

  @ApiProperty()
  @IsOptional()
  @MaxLength(15, { message: '15' })
  @IsNotEmpty({ message: 'required' })
  phone: string;
}

export class LoginDTO {
  @ApiProperty()
  @IsEmail({}, { message: 'invalid' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  password: string;
}

export class LoginResponseDTO {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class RefreshAccessTokenDTO {
  @ApiProperty()
  @IsNotEmpty({ message: 'required' })
  refreshToken: string;
}

export class RefreshAccessTokenResponseDTO {
  @ApiProperty()
  accessToken: string;
}
