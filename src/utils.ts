import nodemailer from 'nodemailer';
import { Account } from './account';
import { Mail } from './mail';
import { AccountParams, FilterParams } from './types';

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

/**
 * Fetches the last email based on provided filter parameters.
 * @param params Configuration parameters for the account including IMAP settings.
 * @param filters Criteria to filter emails, such as sender, subject, and date range.
 * @returns A Promise that resolves with the last Mail object that matches the filter criteria.
 */
export async function lastMail(params: AccountParams, filters: FilterParams): Promise<Mail> {
  const account = new Account({
    imapHost: params.imapHost,
    imapPort: params.imapPort,
    imapSecure: params.imapSecure,
    username: params.username,
    password: params.password,
    smtpHost: '',
    smtpPort: 0,
    smtpSecure: false,
  });

  return await account.getLastMail(filters);
}

/**
 * Fetches the last email for a given account based on provided filter parameters.
 * @param account An instance of the Account class.
 * @param filters Criteria to filter emails, such as sender, subject, and date range.
 * @returns A Promise that resolves with the last Mail object that matches the filter criteria.
 */
export async function accountLastMail(account: Account, filters: FilterParams): Promise<Mail> {
  return await account.getLastMail(filters);
}

/**
 * Fetches the last email and extracts data from it based on a CSS query.
 * @param params Configuration parameters for the account including IMAP settings.
 * @param filters Criteria to filter emails.
 * @param cssQuery A CSS query to extract data from the email's HTML body.
 * @returns A Promise that resolves with the extracted data as a string.
 */
export async function lastMailData(params: AccountParams, filters: FilterParams, cssQuery: string): Promise<string> {
  const mail = await lastMail(params, filters);
  return mail.getData(cssQuery);
}

/**
 * Fetches the last email for a given account and extracts data from it based on a CSS query.
 * @param account An instance of the Account class.
 * @param filters Criteria to filter emails.
 * @param cssQuery A CSS query to extract data from the email's HTML body.
 * @returns A Promise that resolves with the extracted data as a string.
 */
export async function accountLastMailData(account: Account, filters: FilterParams, cssQuery: string): Promise<string> {
  const mail = await accountLastMail(account, filters);
  return mail.getData(cssQuery);
}

/**
 * Fetches the last email based on provided filter parameters and extracts data from it using a CSS query.
 * @param params Configuration parameters for the account including IMAP settings.
 * @param filters Criteria to filter emails.
 * @param cssQuery A CSS query to extract data from the email's HTML body.
 * @returns A Promise that resolves with an object containing the last Mail and the extracted data.
 */
export async function lastMailAndData(
  params: AccountParams,
  filters: FilterParams,
  cssQuery: string
): Promise<{ mail: Mail; data: string }> {
  try {
    const mail = await lastMail(params, filters);
    if (!mail) throw new Error('No email found');
    const data = mail.getData(cssQuery); // Ensure this is awaited if getData is an async operation
    return { mail, data };
  } catch (error) {
    throw error;
  }
}

/**
 * Fetches the last email for a given account based on provided filter parameters and extracts data from it using a CSS query.
 * @param account An instance of the Account class.
 * @param filters Criteria to filter emails.
 * @param cssQuery A CSS query to extract data from the email's HTML body.
 * @returns A Promise that resolves with an object containing the last Mail and the extracted data.
 */
export async function accountLastMailAndData(
  account: Account,
  filters: FilterParams,
  cssQuery: string
): Promise<{ mail: Mail; data: string }> {
  const mail = await accountLastMail(account, filters);
  const data = mail.getData(cssQuery); // Ensure this is awaited if getData is an async operation
  return { mail, data };
}
