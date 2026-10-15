export type TemplateVariable = { id: string, title: string };

export type TemplateToken = string | { text: string } | TemplateVariable;

const VARIABLE_REGEX = /(\{[^{}\s]+\})/;

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
 */
export const parseTemplate = (template: string, titles: Array<TemplateVariable> = []): Array<TemplateToken> =>
{
  const tokens: Array<TemplateToken> = (template || '')
    .split(VARIABLE_REGEX)
    .filter(part => part !== '')
    .map(part => (
      VARIABLE_REGEX.test(part) ?
        { id: part, title: (titles.find(({ id }) => id === part) || { title: part }).title }
        : { text: part }
    ));

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

      return 'text' in token ? token.text : token.id;
    })
    .join('');

export default parseTemplate;
