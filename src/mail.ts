import { AddressObject, Attachment, HeaderLines, Headers, ParsedMail } from 'mailparser';
import { load } from 'cheerio';

/**
 * Represents an email message, extending the functionalities provided by ParsedMail.
 */
export class Mail implements ParsedMail {
  /**
   * An array of attachments.
   */
  attachments: Attachment[];

  /**
   * A Map object with lowercase header keys.
   *
   * - All address headers are converted into address objects.
   * - `references` is a string if only a single reference-id exists or an
   *    array if multiple ids exist.
   * - `date` value is a Date object.
   */
  headers: Headers;

  /**
   * An array of raw header lines
   */
  headerLines: HeaderLines;

  /**
   * The HTML body of the message.
   *
   * Sets to `false` when there is no HTML body.
   *
   * If the message included embedded images as cid: urls then these are all
   * replaced with base64 formatted data: URIs.
   */
  html: string | false;

  /**
   * The plaintext body of the message.
   */
  text?: string | undefined;

  /**
   * The plaintext body of the message formatted as HTML.
   */
  textAsHtml?: string | undefined;

  /**
   * The subject line.
   */
  subject?: string | undefined;

  /**
   * Either an array of two or more referenced Message-ID values or a single Message-ID value.
   *
   * Not set if no reference values present.
   */
  references?: string[] | string | undefined;

  /**
   * A Date object for the `Date:` header.
   */
  date?: Date | undefined;

  /**
   * An address object or array of address objects for the `To:` header.
   */
  to?: AddressObject | AddressObject[] | undefined;

  /**
   * An address object for the `From:` header.
   */
  from?: AddressObject | undefined;

  /**
   * An address object or array of address objects for the `Cc:` header.
   */
  cc?: AddressObject | AddressObject[] | undefined;

  /**
   * An address object or array of address objects for the `Bcc:` header.
   * (usually not present)
   */
  bcc?: AddressObject | AddressObject[] | undefined;

  /**
   * An address object for the `Reply-To:` header.
   */
  replyTo?: AddressObject | undefined;

  /**
   * The Message-ID value string.
   */
  messageId?: string | undefined;

  /**
   * The In-Reply-To value string.
   */
  inReplyTo?: string | undefined;

  /**
   * Priority of the e-mail.
   */
  priority?: 'normal' | 'low' | 'high';

  /**
   * Constructs an Email instance from a ParsedMail object.
   * @param parsedMail - The ParsedMail object to construct the Email from.
   */
  constructor(parsedMail: ParsedMail) {
    this.attachments = parsedMail.attachments;
    this.headers = parsedMail.headers;
    this.headerLines = parsedMail.headerLines;
    this.html = parsedMail.html;
    this.text = parsedMail.text;
    this.textAsHtml = parsedMail.textAsHtml;
    this.subject = parsedMail.subject;
    this.references = parsedMail.references;
    this.date = parsedMail.date;
    this.to = parsedMail.to;
    this.from = parsedMail.from;
    this.cc = parsedMail.cc;
    this.bcc = parsedMail.bcc;
    this.replyTo = parsedMail.replyTo;
    this.messageId = parsedMail.messageId;
    this.inReplyTo = parsedMail.inReplyTo;
    this.priority = parsedMail.priority;
  }

  /**
   * Extracts data from the HTML content of the email based on a CSS query.
   * @param cssQuery - The CSS query string to select elements from the email's HTML content.
   * @returns A promise that resolves to an object containing the extracted data and the email's subject.
   */
  public getData(cssQuery: string): string {
    if (typeof this.html === 'string') {
      const $ = load(this.html, { decodeEntities: true });
      return <string>$(cssQuery.trim()).text();
    } else {
      console.error('HTML content is not available.');
      return '';
    }
  }
}
