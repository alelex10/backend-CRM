import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from '../../../generated/prisma';

export class UpdateUserDto
  extends PartialType(CreateUserDto)
  implements Omit<Partial<User>, 'password'|'createdAt'|'updatedAt'> {}
