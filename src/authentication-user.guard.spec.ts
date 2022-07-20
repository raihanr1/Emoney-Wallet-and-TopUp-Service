import { AuthenticationUserGuard } from './authentication-user.guard';

describe('AuthenticationUserGuard', () => {
  it('should be defined', () => {
    expect(new AuthenticationUserGuard()).toBeDefined();
  });
});
