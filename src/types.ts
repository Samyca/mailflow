/**
 * Defines the configuration parameters for setting up SMTP and IMAP connections.
 */
type AccountParams = {
  /** The SMTP server host address. */
  smtpHost?: string;
  /** The port number for the SMTP server. */
  smtpPort?: number;
  /** Specifies if the SMTP connection should use TLS. */
  smtpSecure?: boolean;
  /** The IMAP server host address. */
  imapHost?: string;
  /** The port number for the IMAP server. */
  imapPort?: number;
  /** Specifies if the IMAP connection should use TLS. */
  imapSecure?: boolean;
  /** The username for authenticating with both SMTP and IMAP servers. */
  username: string;
  /** The password for authenticating with both SMTP and IMAP servers. */
  password: string;
};

/**
 * Defines the server configuration for either SMTP or IMAP connections.
 */
type ServerParams = {
  /** The server host address. */
  host: string;
  /** The port number for the server. */
  port: number;
  /** Specifies if the connection should use TLS (true for secure, false otherwise). */
  secure: boolean | undefined;
  /** The username for server authentication. */
  username: string;
  /** The password for server authentication. */
  password: string;
};

/**
 * Defines the criteria for filtering emails.
 */
type FilterParams = {
  /** Optional filter to match emails from a specific sender. */
  from?: string;
  /** Optional filter to match emails with a specific subject. */
  subject?: string;
  /** Optional filter to match emails that either have or don't have attachments. */
  hasAttachment?: boolean;
  /** Optional filter to match emails sent after a specific date. */
  dateFrom?: Date;
  /** Optional filter to match emails sent before a specific date. */
  dateUntil?: Date;
};

export { AccountParams, ServerParams, FilterParams };
