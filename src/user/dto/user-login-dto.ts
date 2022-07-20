import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty({
    message: 'username_or_email is required',
  })
  @IsString()
  username_or_email: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  password: string;
}
