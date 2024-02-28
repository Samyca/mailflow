import nodemailer from 'nodemailer';
import { Account } from './account';
import { Mail } from './mail';
import { AccountParams } from './types';

/**
 * Creates and configures an Account instance with provided SMTP and IMAP settings.
 * @param params Configuration parameters for the account.
 * @param params.smtpHost The SMTP server host address.
 * @param params.smtpPort The port number for the SMTP server.
 * @param params.smtpSecure Specifies if the SMTP connection should use TLS.
 * @param params.imapHost The IMAP server host address.
 * @param params.imapPort The port number for the IMAP server.
 * @param params.imapSecure Specifies if the IMAP connection should use TLS.
 * @param params.username The username for authenticating with both SMTP and IMAP servers.
 * @param params.password The password for authenticating with both SMTP and IMAP servers.
 * @returns A promise that resolves with the configured Account instance.
 */
export async function createAccount(params: AccountParams): Promise<Account> {
  return new Account(params);
}

/**
 * Creates and configures an Account instance with random SMTP and IMAP settings.
 * Useful for testing purposes.
 * @returns A promise that resolves with the configured Account instance with test account settings.
 */
export async function createRandomAccount(): Promise<Account> {
  const nm = await nodemailer.createTestAccount();

  return new Account({
    smtpHost: nm.smtp.host,
    smtpPort: nm.smtp.port,
    smtpSecure: nm.smtp.secure,
    imapHost: nm.imap.host,
    imapPort: nm.imap.port,
    imapSecure: nm.imap.secure,
    username: nm.user,
    password: nm.pass,
  });
}

/**
 * Extracts data from an email using a CSS query.
 * @param mail The Mail object to extract data from.
 * @param cssQuery The CSS query string to use for data extraction.
 * @returns The extracted data based on the provided CSS query.
 */
export function getDataByMail(mail: Mail, cssQuery: string) {
  return mail.getData(cssQuery);
}
