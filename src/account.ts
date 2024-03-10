import nodemailer, { Transporter } from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
import { FetchMessageObject, ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import { Mail } from './mail';
import { AccountParams, FilterParams, ServerParams } from './types';

/**
 * Represents an email account with SMTP and IMAP configurations.
 */
export class Account {
  /**
   * Transporter object for SMTP operations, used to send emails.
   */
  transporter?: Transporter;

  /**
   * IMAP client for receiving emails.
   */
  client?: ImapFlow;

  /**
   * SMTP server host address.
   */
  public smtpHost?: string;

  /**
   * SMTP server port.
   */
  public smtpPort?: number;

  /**
   * Indicates if the SMTP connection should use TLS.
   */
  public smtpSecure: boolean;

  /**
   * IMAP server host address.
   */
  public imapHost?: string;

  /**
   * IMAP server port.
   */
  public imapPort?: number;

  /**
   * Indicates if the IMAP connection should use TLS.
   */
  public imapSecure: boolean;

  /**
   * Username for authentication with both SMTP and IMAP servers.
   */
  public username: string;

  /**
   * Password for authentication with both SMTP and IMAP servers.
   */
  public password: string;

  /**
   * Initializes a new instance of the Account class.
   * @param params Configuration parameters for the account.
   * @param params.smtpHost The SMTP server host address.
   * @param params.smtpPort The port number for the SMTP server.
   * @param params.smtpSecure Specifies if the SMTP connection should use TLS.
   * @param params.imapHost The IMAP server host address.
   * @param params.imapPort The port number for the IMAP server.
   * @param params.imapSecure Specifies if the IMAP connection should use TLS.
   * @param params.username The username for authenticating with both SMTP and IMAP servers.
   * @param params.password The password for authenticating with both SMTP and IMAP servers.
   */
  constructor(params: AccountParams) {
    this.smtpHost = params.smtpHost ?? 'smtp.ethereal.email';
    this.smtpPort = params.smtpPort ?? 587;
    this.smtpSecure = params.smtpSecure ?? true;
    this.imapHost = params.imapHost ?? 'imap.ethereal.email';
    this.imapPort = params.imapPort ?? 993;
    this.imapSecure = params.imapSecure ?? true;
    this.username = params.username;
    this.password = params.password;

    this._createTransport({
      host: this.smtpHost,
      port: this.smtpPort,
      secure: this.smtpSecure,
      username: this.username,
      password: this.password,
    });

    this._createClient({
      host: this.imapHost,
      port: this.imapPort,
      secure: this.imapSecure,
      username: this.username,
      password: this.password,
    });
  }
  /**
   * Creates a nodemailer Transporter for SMTP operations.
   * @param params SMTP server parameters.
   */
  private _createTransport(params: ServerParams) {
    this.transporter = nodemailer.createTransport({
      host: params.host,
      port: params.port,
      secure: params.secure,
      auth: {
        user: params.username,
        pass: params.password,
      },
    });
  }

  /**
   * Initializes the IMAP client for email retrieval.
   * @param params IMAP server parameters.
   */
  private _createClient(params: ServerParams) {
    this.client = new ImapFlow({
      host: params.host,
      port: params.port,
      tls: {
        rejectUnauthorized: params.secure,
      },
      auth: {
        user: params.username,
        pass: params.password,
      },
      logger: false,
    });
  }

  /**
   * Parses the email from a raw source buffer.
   * @param source Raw source of the email.
   * @returns A Mail object parsed from the source.
   */
  private async _parse(source: Buffer): Promise<Mail> {
    const parsedMail = await simpleParser(source);
    return new Mail(parsedMail);
  }

  /**
   * Retrieves all emails from the inbox.
   * @returns An array of FetchMessageObject representing each email.
   */
  private async _getAllMails(): Promise<FetchMessageObject[]> {
    try {
      if (this.client instanceof ImapFlow) {
        const client = this.client;
        await client.connect();
        await client.mailboxOpen('INBOX');

        const messages = await this.client.search({});

        const mails = await Promise.all(
          messages.reverse().map((message) =>
            client.fetchOne(message.toString(), {
              envelope: true,
              bodyStructure: true,
              source: true,
            })
          )
        );

        await client.logout();
        return mails;
      } else {
        throw new Error('Imap client is not configured');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all emails that match the specified filter.
   * @param filter Criteria to filter emails.
   * @returns An array of Mail objects that match the filter criteria.
   */
  public async getAllMails(filter: FilterParams = {}): Promise<Mail[]> {
    try {
      const fetchMessage = await this._getAllMails();

      const mails = await Promise.all(
        fetchMessage.map((message) => {
          const source = Buffer.from(message.source);
          return this._parse(source);
        })
      );

      return this._leaked(filter, mails);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves the most recent email that matches the specified filter.
   * @param filter Criteria to filter emails.
   * @returns The most recent Mail object that matches the filter criteria.
   */
  public async getLastMail(filter: FilterParams): Promise<Mail> {
    try {
      const mails = await this.getAllMails(filter);
      return mails[0];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Filters emails based on the specified criteria.
   * @param filter Criteria to filter emails by.
   * @param mails Array of Mail objects to filter.
   * @returns An array of Mail objects that match the filter criteria.
   */
  private _leaked(filter: FilterParams, mails: Mail[]): Mail[] {
    return mails.filter((mail: Mail) => {
      if (filter.from && mail.from?.text !== filter.from) {
        return false;
      }

      if (filter.subject && mail.subject !== filter.subject) {
        return false;
      }

      if (filter.hasAttachment !== undefined) {
        const hasAttachment = mail.attachments.length > 0;
        if (filter.hasAttachment !== hasAttachment) {
          return false;
        }
      }

      // TODO: add data filters
      /*if (filter.dateFrom && mail.date < filter.dateFrom) {
        return false;
      }

      if (filter.dateUntil && mail.date > filter.dateUntil) {
        return false;
      }*/

      return true;
    });
  }

  /**
   * Sends an email using the configured SMTP transporter.
   * @param mail The mail options object defining the email to be sent.
   * @returns A Promise that resolves when the email is sent.
   */
  public async sendMail(mail: Options): Promise<any> {
    if (this.transporter) {
      return await this.transporter.sendMail(mail);
    } else {
      throw new Error('SMTP server is not configured');
    }
  }
}
