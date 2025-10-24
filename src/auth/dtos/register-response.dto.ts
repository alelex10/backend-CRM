import { Role, User } from "../../../generated/prisma";

export class RegisterResponseDto implements Omit<User, 'password' | 'contacts' | 'companies' | 'createdAt' | 'updatedAt'> {
    roles: Role[];
    id: number;
    username: string;
    email: string;
}
