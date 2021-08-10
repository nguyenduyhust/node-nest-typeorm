import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, IsNotEmpty, IsOptional, MinLength, IsEmail } from 'class-validator';

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
  password: string;

  @ApiProperty({ maxLength: 180 })
  @IsNotEmpty()
  @MaxLength(180)
  fullName: string;

  @ApiProperty({ maxLength: 15 })
  @IsNotEmpty()
  @IsOptional()
  @MaxLength(15)
  phone: string;
}

export class LoginDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(20)
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
  @IsNotEmpty()
  refreshToken: string;
}

export class RefreshAccessTokenResponseDTO {
  @ApiProperty()
  accessToken: string;
}
