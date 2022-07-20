import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from './jwt/jwt.service';

@Injectable()
export class AuthenticationUserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authorization = context.getArgs()[0].headers.authorization;
    console.log(authorization);
    if (!authorization) {
      throw new UnauthorizedException(
        'User Unauthorized',
        'Authorization in headers is required',
      );
    }
    const verifyToken = this.jwtService.verifyAuthorization(
      authorization,
      (err, decoded) => {
        if (!err) {
          const ResponseObj = context.switchToHttp().getResponse();
          console.log(ResponseObj.req.headers);
          ResponseObj.req.headers['payload_token'] = decoded;
        }
      },
    );
    return true;
  }
}
