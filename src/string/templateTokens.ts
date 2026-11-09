/**
 * options: filter of the variable (ex. feature options), the variable appears only for these values
 * '{features/10:2,3}' -> { id: '{features/10}', options: ['2', '3'] }
 */
export type TemplateVariable = { id: string, title: string, options?: Array<string> };

export type TemplateToken = string | { text: string } | TemplateVariable;

const VARIABLE_REGEX = /(\{[^{}\s]+\})/;

const OPTIONS_SEPARATOR = ':';

/**
 * Split a variable into its id and the options filter
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {string} variable
 * @return {{ id: string, options: Array<string> }}
 * @example
 *
 * parseTemplateVariable('{features/10:2,3}')
 * // => { id: '{features/10}', options: ['2', '3'] }
 */
export const parseTemplateVariable = (variable: string): { id: string, options: Array<string> } =>
{
  const [name, options = ''] = (variable || '').replace(/^\{|\}$/g, '').split(OPTIONS_SEPARATOR);

  return {
    id: `{${name}}`,
    options: options.split(',').filter(option => option !== ''),
  };
};

/**
 * Inverse of parseTemplateVariable
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {string} id
 * @param {Array<string>} [options]
 * @return {string}
 * @example
 *
 * stringifyTemplateVariable('{features/10}', ['2', '3'])
 * // => '{features/10:2,3}'
 */
export const stringifyTemplateVariable = (id: string, options: Array<string | number> = []): string =>
{
  const list = (Array.isArray(options) ? options : []).map(String).filter(option => option !== '');

  return list.length ? id.replace(/\}$/, `${OPTIONS_SEPARATOR}${list.join(',')}}`) : id;
};

/**
 * Split a template string into variables ({ id, title }) and free texts ({ text }).
 * The last free text stays a plain string (ui Autocomplete freeText: input field value).
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {string} template
 * @param {Array<TemplateVariable>} [titles] titles of the variables, default the variable itself
 * @return {Array<TemplateToken>}
 * @example
 *
 * parseTemplate('{features/10}, {features/35} cm', [{ id: '{features/10}', title: 'Szín' }])
 * // => [{ id: '{features/10}', title: 'Szín' }, { text: ', ' }, { id: '{features/35}', title: '{features/35}' }, ' cm']
 *
 * parseTemplate('{features/10:2,3}', [{ id: '{features/10}', title: 'Szín' }])
 * // => [{ id: '{features/10}', title: 'Szín', options: ['2', '3'] }]
 */
export const parseTemplate = (template: string, titles: Array<TemplateVariable> = []): Array<TemplateToken> =>
{
  const tokens: Array<TemplateToken> = (template || '')
    .split(VARIABLE_REGEX)
    .filter(part => part !== '')
    .map((part) =>
    {
      if (!VARIABLE_REGEX.test(part))
      {
        return { text: part };
      }

      const { id, options } = parseTemplateVariable(part);
      const variable: TemplateVariable = { id, title: (titles.find(item => item.id === id) || { title: id }).title };

      if (options.length)
      {
        variable.options = options;
      }

      return variable;
    });

  const last = tokens[tokens.length - 1];

  if (last && typeof last === 'object' && 'text' in last)
  {
    tokens[tokens.length - 1] = last.text;
  }

  return tokens;
};

/**
 * Inverse of parseTemplate
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {Array<TemplateToken>} tokens
 * @return {string}
 * @example
 *
 * stringifyTemplate([{ id: '{features/10}', title: 'Szín' }, { text: ', ' }, ' cm'])
 * // => '{features/10},  cm'
 */
export const stringifyTemplate = (tokens: Array<TemplateToken> = []): string =>
  (Array.isArray(tokens) ? tokens : [])
    .map((token) =>
    {
      if (typeof token === 'string')
      {
        return token;
      }

      return 'text' in token ? token.text : stringifyTemplateVariable(token.id, token.options);
    })
    .join('');

export default parseTemplate;
