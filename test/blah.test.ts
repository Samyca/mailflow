import { createAccount, createRandomAccount, lastMailAndData } from '../src';

jest.setTimeout(120000);

describe('create account', () => {
  it('create account with ethereal service', async () => {
    const accountParams = {
      imapHost: 'imap.ethereal.email',
      imapPort: 993,
      imapSecure: true,
      username: 'pasquale.corkery@ethereal.email',
      password: 'ew7YV7AGDmvD9T3yBs',
    };
    const { username, password } = await createAccount(accountParams);
    expect(username).toBeDefined();
    expect(password).toBeDefined();
  });
});

describe('create random account', () => {
  it('create random account with ethereal service', async () => {
    const { username, password } = await createRandomAccount();
    expect(username).toBeDefined();
    expect(password).toBeDefined();
  });
});

describe('get error with new account finding a new email', () => {
  it('last email new account', async () => {
    try {
      const account = await createRandomAccount();
      const { mail, data } = await lastMailAndData(account, {}, '.code');
      expect(mail).toBeDefined();
      expect(data).toBeDefined();
    } catch (error: any) {
      expect(error.message).toBe('No email found');
    }
  });
});

describe('getMailAndFilterData', () => {
  it('last email', async () => {
    const accountParams = {
      imapHost: 'imap.ethereal.email',
      imapPort: 993,
      imapSecure: true,
      username: 'pasquale.corkery@ethereal.email',
      password: 'ew7YV7AGDmvD9T3yBs',
    };
    const { mail, data } = await lastMailAndData(accountParams, {}, '.code');
    expect(mail).toBeDefined();
    expect(data).toBeDefined();
  });
});

describe('all emails by user', () => {
  it('all emails by user', async () => {
    const account = await createAccount({
      imapHost: 'imap.ethereal.email',
      imapPort: 993,
      imapSecure: true,
      username: 'pasquale.corkery@ethereal.email',
      password: 'ew7YV7AGDmvD9T3yBs',
    });
    const accountClass = await account.getAllMails();

    expect(Array.isArray(accountClass)).toBe(true);
    expect(accountClass).toBeDefined();
  });
});
