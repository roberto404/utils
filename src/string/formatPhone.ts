/**
 * Phone number formatter (Hungarian style)
 *
 * @since 3.x
 * @static
 * @memberof string
 * @param {string|number} phone
 * @param {boolean} [hideCountry=true] strip "+36" / "36" country code
 * @return {string}
 * @example
 *
 * formatPhone('+36203539677')        // => '20 353-9677'
 * formatPhone('36203539677')         // => '20 353-9677'
 * formatPhone('06203539677')         // => '20 353-9677'
 * formatPhone('203539677')           // => '20 353-9677'
 * formatPhone('+36203539677', false) // => '+36 20 353-9677'
 */
const formatPhone = (phone: string | number, hideCountry: boolean = true): string =>
{
  const digits = String(phone ?? '').replace(/\D/g, '');
  if (!digits) return '';

  let local = digits;
  let hasCountry = false;

  if (local.startsWith('36'))
  {
    local = local.slice(2);
    hasCountry = true;
  }
  else if (local.startsWith('06'))
  {
    local = local.slice(2);
  }

  if (local.length < 8) return String(phone);

  const formatted = `${local.slice(0, 2)} ${local.slice(2, 5)}-${local.slice(5)}`;

  return hideCountry || !hasCountry ? formatted : `+36 ${formatted}`;
};


export default formatPhone;
