import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationUserGuard } from '../authentication-user.guard';
import { ValidationPipe } from '../validation.pipe';
import { UserLoginDto } from './dto/user-login-dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthentication } from './user-authentication.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(201)
  @Post('')
  async userRegister(
    @Body(new ValidationPipe()) userRegisterDto: UserRegisterDto,
  ) {
    return await this.userService.responseUserRegister(userRegisterDto);
  }

  @HttpCode(200)
  @Post('login')
  async userLogin(@Body(new ValidationPipe()) userLoginDto: UserLoginDto) {
    return await this.userService.responseUserLogin(userLoginDto);
  }

  // only logged in user information
  @UseGuards(AuthenticationUserGuard)
  @HttpCode(200)
  @Get('information')
  async userInformation(
    @Headers('payload_token') payload_token: UserAuthentication,
  ) {
    return await this.userService.responseGettingUserInformation(payload_token);
  }
}
