import decimalToRoman from './decimalToRoman';

/**
 * Convert zipcode to Roman number
 * @example
 * decimalToRoman({ city: 'Budapest', zipcode: '1133' })
 * // => 'Budapest XIII.'
 */
const districtParser = ({ city, zipcode }: { city: string, zipcode: string }) =>
  (city === 'Budapest' ? `${city} ${decimalToRoman(parseInt(zipcode.substring(1, 3)))}.` : `${city}`);


export default districtParser;