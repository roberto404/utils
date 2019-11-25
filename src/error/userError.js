// @flow

/**
 * Extend Error class
 *
 * @since 4.5.0
 * @static
 * @memberof error
 * @param  {string} message   degree
 * @param {object} error      radian
 * @class
 * @example
 *
 * throw new UserError(
 *   'Application settings error.',
 *   {
 *     code: 'data.constructor',
 *     level: 'warning',
 *     message: 'Opps! Something went wrong.',
 *     dev: { foo: 'bar' },
 *   },
 * );
 */
class UserError extends Error
{
  code: string;
  level: string;
  userMessage: string;
  dev: {};

  constructor(
    message: string,
    error: { code ?: string, level ?: string, message ?: string, dev ?: {} } = {},
  )
  {
    super(message);

    // this.stack = <call stack>; // non-standard, but most environments support it
    // this.stack = (new Error()).stack;
    this.name = this.constructor.name;

    this.code = error.code || '';
    this.level = error.level || 'error';
    this.userMessage = error.message || '';
    this.dev = error.dev || {};
  }
}

export default UserError;
