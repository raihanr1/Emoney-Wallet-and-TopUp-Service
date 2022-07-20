import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UserRegisterDto {
  @IsNotEmpty({
    message: 'username is required',
  })
  @IsString()
  username: string;

  @IsNotEmpty({
    message: 'email_address is required',
  })
  @IsEmail(
    {},
    {
      message: 'Invalid Email Format',
    },
  )
  @IsString()
  email_address: string;

  @IsNotEmpty({
    message: 'password is required',
  })
  @IsString()
  @Length(8, 14, {
    message: 'Minimum password length is 8 and maximum password length is 14',
  })
  password: string;
}
