import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
