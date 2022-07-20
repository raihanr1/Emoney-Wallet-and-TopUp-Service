import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { Balance } from '../entity/Balance';
import { Transaction } from '../entity/Transaction';
import { User } from '../entity/User';
import { HelperService } from '../helper/helper.service';
import { JwtService } from '../jwt/jwt.service';
import { UserLoginDto } from './dto/user-login-dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserAuthentication } from './user-authentication.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Balance)
    private balancesRepository: Repository<Balance>,
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private readonly helperService: HelperService,
    private readonly jwtService: JwtService,
    private readonly bcryptService: BcryptService,
  ) {}

  async getUser(email_address: string, username: string) {
    const getUser = await this.usersRepository.findOne({
      where: [
        {
          email_address,
        },
        {
          username,
        },
      ],
      select: ['email_address', 'password', 'username'],
    });
    return getUser;
  }

  async responseUserRegister(userRegisterDto: UserRegisterDto) {
    const { email_address, username, password } = userRegisterDto;
    const getUser = await this.getUser(email_address, username);

    if (getUser) {
      let errorMessage = '';
      if (getUser.email_address === email_address) {
        errorMessage = 'email_address already registered';
      } else {
        errorMessage = 'username already registered';
      }
      throw new BadRequestException('Validation failed', errorMessage);
    }
    const successHashingPassword = this.bcryptService.hashingPassword(password);
    const createNewUser = await this.usersRepository.insert({
      username,
      password: successHashingPassword,
      email_address,
    });

    const createUserBalance = await this.balancesRepository.insert({
      user: createNewUser.identifiers[0].id,
    });

    const updateUserBalance = await this.usersRepository.update(
      {
        id: createNewUser.identifiers[0].id,
      },
      {
        balance: createUserBalance.identifiers[0].balance_id,
      },
    );
    return {
      statusCode: 201,
      message: 'Success Register New User',
    };
  }

  async responseUserLogin(userLoginDto: UserLoginDto) {
    const { username_or_email, password } = userLoginDto;
    const getUser = await this.getUser(username_or_email, username_or_email);
    const errorNotAuthorized = new UnauthorizedException(
      'User Unauthorized',
      'username_or_email or password is wrong',
    );
    if (!getUser) {
      throw errorNotAuthorized;
    }
    const isValidPassword = this.bcryptService.isValidPassword(
      getUser.password,
      password,
    );

    if (!isValidPassword) {
      throw errorNotAuthorized;
    }
    const userAuthentication = new UserAuthentication();
    userAuthentication.email_address = getUser.email_address;
    userAuthentication.username = getUser.username;
    return {
      statusCode: 200,
      data: {
        jwt: this.jwtService.generateAuthorizationLogin(userAuthentication),
      },
    };
  }
  async responseGettingUserInformation(payload_token: UserAuthentication) {
    const getUserInformation = await this.usersRepository.findOne({
      where: {
        email_address: payload_token.email_address,
        username: payload_token.username,
      },
      select: [
        'id',
        'email_address',
        'username',
        'created_at',
        'created_at',
        'updated_at',
      ],
    });
    return {
      statusCode: 200,
      data: {
        user: getUserInformation,
      },
    };
  }
}
