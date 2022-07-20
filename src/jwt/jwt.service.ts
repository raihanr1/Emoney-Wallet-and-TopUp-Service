import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserAuthentication } from '../user/user-authentication.dto';
const jwt = require('jsonwebtoken');
@Injectable()
export class JwtService {
  generateAuthorizationLogin(payload: UserAuthentication) {
    const token = jwt.sign(
      {
        email_address: payload.email_address,
        username: payload.username,
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: '8h',
      },
    );
    return token;
  }

  verifyAuthorization(token: string, cb: any) {
    jwt.verify(token, process.env.JWT_PRIVATE_KEY, function (err, decoded) {
      if (err) {
        if (err.name === 'JsonWebTokenError') {
          throw new UnauthorizedException(
            'User Unauthorized',
            'Authorization Is Incorrect',
          );
        } else {
          throw new UnauthorizedException(
            'User Unauthorized',
            'Authorization Is Expired',
          );
        }
      } else {
        cb(null, decoded);
        return decoded;
      }
    });
  }
}
