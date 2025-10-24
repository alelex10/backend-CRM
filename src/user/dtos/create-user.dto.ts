import { Role } from '../../../generated/prisma';

export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  roles: Role[];
}
