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

  const signs = m[1] ?? '';
  const [i = '', _, f = ''] = m.slice(2, 5);
  const int = i.replace(/[^0-9]/g, '');
  const frac = f.replace(/0+$/, '');

  const negative = signs.split('').filter(c => c === '-').length % 2 !== 0;

  return {
    int,
    frac,
    negative
  }
}

const digitlize = (s: string): string[] => sanitize(s).split('');

const convert = (num: string) => digitlize(num)
  .map(Number)
  .reduce((a, digit, index, { length } ) => {
    const place = (length - index - 1 ) % 6;

    const isOnes = place === 0;
    const isTens = place === 1;

    const s = (isTens && digit === 2)
      ? 'ยี่'
      : (isOnes && a.wasTens && digit === 1)
        ? 'เอ็ด'
        : ((isTens && digit === 1) || digit === 0)
          ? ''
          : digitNames[digit]
      ;

    let unit = (!isOnes && digit !== 0) ? unitNames[place] : '';

    a.hasValue ||= digit > 0;

    if (a.hasValue && isOnes && index !== length - 1) {
      unit += unitNames[6];
    }

    if (isTens) {
      a.wasTens = digit !== 0;
    }

    a.text += s + unit;

    return a;
  }, { text: '', wasTens: false, hasValue: false }).text;

const toName = (d: any) => digitNames[+d];

export const text = (n: string | number) => {
  n = n.toString().trim();

  if (!n) {
    return '';
  }

  let { int, frac, negative } = part(n);

  if (!int && !frac) {
    return '';
  }

  let integer = convert(int);
  const fraction = frac ? digitlize(frac).map(toName).join('') : '';

  if (!integer) {
    integer = digitNames[0];
    if (!fraction) {
      negative = false;
    }
  }

  return `${negative ? 'ลบ' : ''}${integer}${(frac ? 'จุด' : '')}${fraction}`;
}

export const baht = (n: string | number, roundStang: boolean = true) => {
  let { int, frac, negative } = part(n);

  let integer = convert(int);

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
