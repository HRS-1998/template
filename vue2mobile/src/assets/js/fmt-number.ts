function thousandSeparator(n: number) {
  return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

function fmtNumber(num: number) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' }, // 千
    { value: 1e6, symbol: 'M' }, // 百万
    { value: 1e9, symbol: 'B' }, // 十亿
    { value: 1e12, symbol: 'T' }, // 万亿
    { value: 1e15, symbol: 'P' }, // 千万亿
    { value: 1e18, symbol: 'E' } // 亿万亿
  ];

  if (num < 10000) {
    return num;
  }

  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }

  const curValue: any = num / si[i].value;
  // const digits = 2;
  // return curValue.toFixed(digits).replace(rx, '$1') + si[i].symbol;
  const result =
    curValue
      .toString()
      .match(/^\d+(?:\.\d{0,2})?/)[0]
      .replace(rx, '$1') + si[i].symbol;
  return result;
}

export { fmtNumber, thousandSeparator };
