/**
 * Split a "Label: value; Label: value;" style text into the requested labels
 * and the remaining (unmatched) text.
 *
 * Label matching is case-insensitive and whitespace-tolerant. Segments without
 * a matching label are kept (in original order) in `rest`.
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {string} text
 * @param {Array<string>} labels wanted labels, e.g. ['Test színe', 'Fogó']
 * @param {object} [options]
 * @param {string} [options.separator=';'] segment separator
 * @param {string} [options.delimiter=':'] label/value delimiter (first occurrence)
 * @return {{ values: Record<string, string>, rest: string }}
 * @example
 *
 * extractLabeledValues('Test színe: fehér ; Fogó: R-19; Egyéb', ['Test színe', 'Fióksín'])
 * // => { values: { 'Test színe': 'fehér', 'Fióksín': '' }, rest: 'Fogó: R-19; Egyéb' }
 */
const extractLabeledValues = (
  text: string,
  labels: Array<string> = [],
  { separator = ';', delimiter = ':' }: { separator?: string, delimiter?: string } = {},
): { values: Record<string, string>, rest: string } =>
{
  const normalize = (label: string): string => String(label ?? '').trim().replace(/\s+/g, ' ').toLowerCase();

  const values: Record<string, string> = {};
  const lookup: Record<string, string> = {};

  (labels || []).forEach((label) =>
  {
    values[label] = '';
    lookup[normalize(label)] = label;
  });

  const rest: Array<string> = [];

  String(text ?? '')
    .split(separator)
    .map(segment => segment.trim())
    .filter(segment => segment !== '')
    .forEach((segment) =>
    {
      const position = segment.indexOf(delimiter);
      const label = position > -1 ? lookup[normalize(segment.substring(0, position))] : undefined;

      if (label !== undefined)
      {
        values[label] = segment.substring(position + delimiter.length).trim();
      }
      else
      {
        rest.push(segment);
      }
    });

  return { values, rest: rest.join(`${separator} `) };
};

export default extractLabeledValues;
