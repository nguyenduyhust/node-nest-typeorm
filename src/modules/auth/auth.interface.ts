import { UserDTO } from '@modules/user/user.dto';

export interface RegisterUserInput {
  email: string;
  password: string;
  fullName: string;
  phone: string;
}

export interface GenerateTokenReturn {
  token: string;
  refreshToken: string;
  user: UserDTO;
}
