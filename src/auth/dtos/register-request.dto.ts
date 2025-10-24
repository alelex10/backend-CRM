import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterRequestDto {
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;
  @IsNotEmpty({ message: 'Username is required' })
  username: string;
}
