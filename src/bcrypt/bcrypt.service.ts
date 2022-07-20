import { Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
@Injectable()
export class BcryptService {
  hashingPassword(plaintextPassword: string) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(plaintextPassword, salt);
    return hash;
  }

  isValidPassword(passwordData, passwordInput) {
    return bcrypt.compareSync(passwordInput, passwordData);
  }
}
