
import map from 'lodash/map';


const DELIMITER = ',';
const TERMINATE = '\n';
const ENCLOSER = '';

// automatically tell Excel to use that character as the separator
const EXCEL_META = `sep=${DELIMITER}`;


/**
 * Create CSV format from Object
 * @param  {array} items [{ id: 1, name: 'foo' }, {}, ...]
 * @param  {object} hook  Items meta { name: 'User name' }
 * @return {string}       csv
 */
const toCSV = (items, hook) =>
{
  const columns = hook ||
    Object.keys(items[0]).reduce((results, column) => ({ ...results, [column]: column }), {});

  const header = map(
    columns,
    (column, index) =>
    {
      if (typeof column === 'string')
      {
        return column;
      }
      else if (typeof column === 'object' && typeof column.title === 'string')
      {
        return column.title;
      }
      // react element
      else if (typeof column === 'object' && column.title && typeof column.title.props === 'object')
      {
        return column.title.props.children
          .map(item => (typeof item === 'string' ? item : ''))
          .join(' ')
          .replace(/  +/g, ' '); // eslint-disable-line
      }

      return index;
    },
  ).join(DELIMITER) + TERMINATE;

  return header + items
    .map(item => Object
      .keys(columns)
      .map(column => ENCLOSER + item[column] + ENCLOSER)
      .join(DELIMITER))
    .join(TERMINATE) + TERMINATE + EXCEL_META;
};

export default toCSV;
