import { createAccount, createRandomAccount, lastMailAndData } from '../src';
import { testPass, testUser } from './data';

jest.setTimeout(10000);

describe('Mail', () => {
  it('get error with new account finding a new email', async () => {
    try {
      const account = await createRandomAccount();
      const { mail, data } = await lastMailAndData(account, {}, '.code');
      expect(mail).toBeDefined();
      expect(data).toMatch(/^\d{6}$/);
    } catch (error: any) {
      expect(error.message);
    }
  });

  it('last email and data by css query', async () => {
    const accountParams = {
      username: testUser,
      password: testPass,
    };
    const { mail, data } = await lastMailAndData(accountParams, {}, '.code');
    expect(mail).toBeDefined();
    expect(data).toMatch(/^\d{6}$/);
  });

  it('all emails by user', async () => {
    const account = await createAccount({
      username: testUser,
      password: testPass,
    });
    const emails = await account.getAllMails();

    expect(Array.isArray(emails)).toBe(true);
    expect(emails).toBeDefined();
  });
});
