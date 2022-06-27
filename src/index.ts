export const digitNames = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
export const unitNames = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

export const thaiDigits = '๐๑๒๓๔๕๖๗๘๙'.split('');
export const thaiDigitsToArabic = new Map(thaiDigits.map((t, i) => [t, `${i}`]));

const sanitize = (s: string) => s.trim()
  .replace(/([๐๑๒๓๔๕๖๗๘๙])/g, (_, c) => thaiDigitsToArabic.get(c))
  .replace(/[^\d.+-]/g, '');

const partRegex = /^([+-]*)*([\d+-]*)(\.([\d+-]+)*)*$/;

const part = (n: string | number) => {
  const m = sanitize(n.toString()).match(partRegex);
  if (!m) {
    return {};
  }

  const [signs = '', i = '', _, f = ''] = m.slice(1, 5);
  const int = i.replace(/[^0-9]/g, '');
  const frac = f.replace(/0+$/, '');

  const negative = signs.split('').filter(c => c === '-').length % 2 !== 0;

  return {
    int,
    frac,
    negative
  }
}

const digitize = (s: string): string[] => sanitize(s).split('');

const readNumber = (digit: number, prev: number, place: number, formal: boolean) => {
  const isOnes = place === 0;
  const isTens = place === 1;

  // Special for digit 2 on the tens place
  if (isTens && digit === 2) {
    return 'ยี่';
  }

  // Special case for digit 1 on the ones place and when the previous digit is known
  if (isOnes && digit === 1 && prev !== undefined) {
    // Formal reading should always use 'เอ็ด'
    // while the informal/military/popular reading
    // should only use this form when the previous digit is not 0
    if (formal || (!formal && prev !== 0)) {
      return 'เอ็ด';
    }
  }

  // Skip digit 0, it should be read only when the whole number is completely zero
  // Also skip digit 1 when on the tens place, as the tens unit should be read instead
  if (digit === 0 || (isTens && digit === 1)) {
    return '';
  }

  return digitNames[digit];
}

type ConversionState = {
  text: string;
  prev?: number;
  hasValue: boolean;
}

const convert = (num: string, formal: boolean = false) => digitize(num)
  .map(Number)
  .reduce<ConversionState>((state, digit, index, { length } ) => {
    const place = (length - index - 1) % 6;
    const isOnes = place === 0;

    let reading = readNumber(digit, state.prev, place, formal);
    let unit = (!isOnes && digit !== 0) ? unitNames[place] : '';

    state.hasValue ||= digit > 0;

    if (state.hasValue && isOnes && index !== length - 1) {
      unit += unitNames[6];
    }

    state.prev = digit;
    state.text += reading + unit;

    return state;
  }, { text: '', prev: undefined, hasValue: false }).text;

const toName = (d: any) => digitNames[+d];

export type ReadingOption = {
  formalReading?: boolean;
}

export const text = (n: string | number, options?: ReadingOption) => {
  n = n.toString().trim();

  if (!n) {
    return '';
  }

  let { int, frac, negative } = part(n);

  if (!int && !frac) {
    return '';
  }

  let integer = convert(int, options?.formalReading);
  const fraction = frac ? digitize(frac).map(toName).join('') : '';

  if (!integer) {
    integer = digitNames[0];
    if (!fraction) {
      negative = false;
    }
  }

  return `${negative ? 'ลบ' : ''}${integer}${(frac ? 'จุด' : '')}${fraction}`;
}

export type BahtReadingOption = ReadingOption & {
  roundStang?: boolean;
}

/** @deprecated Use BahtReadingOption instead */
export function baht(n: string | number, roundStang: boolean): string;
export function baht(n: string | number, options?: BahtReadingOption): string;

export function baht(n: string | number, options?: BahtReadingOption | boolean): string {
  let roundStang = true;
  let formalReading = false;

  if (typeof options === 'boolean') {
    roundStang = options;
  } else if (typeof options !== 'undefined') {
    roundStang = options.roundStang;
    formalReading = options.formalReading;
  }

  let { int, frac, negative } = part(n);

  let integer = convert(int, formalReading);

  frac = frac.padEnd(2, '0');

  const subStang = roundStang ? Math.round(+('0.'+frac.substring(2))) : 0;
  const stang = Math.min(99, +frac.substring(0, 2) + subStang);

  if (!integer) {
    if (!stang) {
      integer = digitNames[0];
      negative = false;
    }
  }

  const bathText = integer ? `${integer}บาท` : '';
  const stangText = stang > 0 ? convert(stang.toString()) + 'สตางค์' : 'ถ้วน';

  return `${negative ? 'ลบ' : ''}${bathText}${stangText}`;
}
