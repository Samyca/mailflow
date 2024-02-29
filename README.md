# @samyca/mailflow

A comprehensive tool for handling email flows in Node.js applications, providing functionalities for sending, receiving, and parsing emails with ease.

## Features

- Send emails using SMTP protocol.
- Fetch and parse emails from IMAP servers.
- Extract data from emails using CSS queries.
- Easy integration with Node.js applications.

## Installation

Install using npm:

```bash
npm install @samyca/mailflow
```

Or using yarn:

```bash
yarn add @samyca/mailflow
```

## Usage

### Creating an Account

```js
import { createAccount, createRandomAccount } from '@samyca/mailflow';

async function setupOtherAccount() {
  const account = await createRandomAccount();

  console.log(account);
}

async function setupAccount() {
  const account = await createAccount({
    smtpHost: 'smtp.example.com',
    smtpPort: 587,
    smtpSecure: true,
    imapHost: 'imap.example.com',
    imapPort: 993,
    imapSecure: true,
    username: 'your_username',
    password: 'your_password',
  });

  console.log(account);
}

setupOtherAccount().then();
setupAccount().then();
```

### Fetching and Parsing Emails

```js
import { createAccount } from '@samyca/mailflow';

async function getDataByCssQuery() {
  const account = await createAccount({
    imapHost: 'imap.example.com',
    imapPort: 993,
    imapSecure: true,
    username: 'your_username',
    password: 'your_password',
  });

  const lastEmail = await account.getLastMail({});
  const data = lastEmail.getData('div.code');

  console.log(data);
}
getDataByCssQuery().then();
```
