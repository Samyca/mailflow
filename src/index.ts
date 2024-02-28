import { Account } from './account';
import { AccountParams, FilterParams, ServerParams } from './types';
import { createAccount, createRandomAccount, getDataByMail } from './utils';
import { Mail } from './mail';

/**
 * Re-exporting the imported modules for easier access
 */
export { Account, Mail };
export { AccountParams, FilterParams, ServerParams };
export { createAccount, createRandomAccount, getDataByMail };
