export type DiffWordsToken = { text: string, changed: boolean };

const TOKEN_REGEX = /(\s+|[,.;:()/])/;

const tokenize = (text: string): Array<string> =>
  (text || '').split(TOKEN_REGEX).filter(token => token !== '');

const isSeparator = (token: string): boolean => /^\s+$/.test(token);

/**
 * Word level difference of two texts (LCS).
 * The words (and punctuation marks) only in the old text are `changed` in `removed`,
 * only in the new text are `changed` in `added`. Whitespaces never changed.
 *
 * @since 5.x
 * @static
 * @memberof string
 * @param {string} oldText
 * @param {string} newText
 * @return {{ removed: Array<DiffWordsToken>, added: Array<DiffWordsToken>, isChanged: boolean }}
 * @example
 *
 * diffWords('matrac 80x200 cm, habszivacs', 'matrac 80x200 cm, kókusz')
 * // => {
 * //   removed: [..., { text: 'habszivacs', changed: true }],
 * //   added: [..., { text: 'kókusz', changed: true }],
 * //   isChanged: true,
 * // }
 */
const diffWords = (
  oldText: string,
  newText: string,
): { removed: Array<DiffWordsToken>, added: Array<DiffWordsToken>, isChanged: boolean } =>
{
  const a = tokenize(oldText);
  const b = tokenize(newText);

  // lcs[i][j]: common length of a[i..], b[j..]
  const lcs: Array<Array<number>> = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));

  for (let i = a.length - 1; i >= 0; i--)
  {
    for (let j = b.length - 1; j >= 0; j--)
    {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const removed: Array<DiffWordsToken> = [];
  const added: Array<DiffWordsToken> = [];

  let i = 0;
  let j = 0;

  while (i < a.length || j < b.length)
  {
    if (i < a.length && j < b.length && a[i] === b[j])
    {
      removed.push({ text: a[i], changed: false });
      added.push({ text: b[j], changed: false });
      i++;
      j++;
    }
    else if (j < b.length && (i >= a.length || lcs[i][j + 1] >= lcs[i + 1][j]))
    {
      added.push({ text: b[j], changed: !isSeparator(b[j]) });
      j++;
    }
    else
    {
      removed.push({ text: a[i], changed: !isSeparator(a[i]) });
      i++;
    }
  }

  return {
    removed,
    added,
    isChanged: removed.some(({ changed }) => changed) || added.some(({ changed }) => changed),
  };
};

export default diffWords;
