import { createAccount, createRandomAccount } from '../src';
import { regexEmail, testPass, testUser } from './data';

describe('Account', () => {
  it('create account with ethereal service', async () => {
    const accountParams = {
      imapHost: 'imap.ethereal.email',
      imapPort: 993,
      imapSecure: true,
      username: testUser,
      password: testPass,
    };
    const { username, password } = await createAccount(accountParams);
    expect(username).toMatch(regexEmail);
    expect(password).toBeDefined();
  });

  it('create random account with ethereal service', async () => {
    const { username, password } = await createRandomAccount();
    expect(username).toMatch(regexEmail);
    expect(password).toBeDefined();
  });
});
