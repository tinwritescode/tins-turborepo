/*
 * Copyright (C) 2016-present cm45t3r.
 * MIT License.
 */

interface BasicCandlestick {
  open: number;
  close: number;
}

interface Candlestick extends BasicCandlestick {
  high: number;
  low: number;
}

interface BodyEnds {
  bottom: number;
  top: number;
}

function bodyLen(candlestick: BasicCandlestick): number {
  return Math.abs(candlestick.open - candlestick.close);
}

function wickLen(candlestick: Candlestick): number {
  return candlestick.high - Math.max(candlestick.open, candlestick.close);
}

function tailLen(candlestick: Candlestick): number {
  return Math.min(candlestick.open, candlestick.close) - candlestick.low;
}

function bodyEnds(candlestick: BasicCandlestick): BodyEnds {
  return candlestick.open <= candlestick.close
    ? { bottom: candlestick.open, top: candlestick.close }
    : { bottom: candlestick.close, top: candlestick.open };
}

function isBullish(candlestick: BasicCandlestick): boolean {
  return candlestick.open < candlestick.close;
}

function isBearish(candlestick: BasicCandlestick): boolean {
  return candlestick.open > candlestick.close;
}

function isEngulfed(
  previous: BasicCandlestick,
  current: BasicCandlestick,
): boolean {
  return (
    bodyEnds(previous).top <= bodyEnds(current).top &&
    bodyEnds(previous).bottom >= bodyEnds(current).bottom
  );
}

function hasGapUp(
  previous: BasicCandlestick,
  current: BasicCandlestick,
): boolean {
  return bodyEnds(previous).top < bodyEnds(current).bottom;
}

function hasGapDown(
  previous: BasicCandlestick,
  current: BasicCandlestick,
): boolean {
  return bodyEnds(previous).bottom > bodyEnds(current).top;
}

function isHammer(candlestick: Candlestick): boolean {
  return (
    tailLen(candlestick) > bodyLen(candlestick) * 2 &&
    wickLen(candlestick) < bodyLen(candlestick)
  );
}

function isInvertedHammer(candlestick: Candlestick): boolean {
  return (
    wickLen(candlestick) > bodyLen(candlestick) * 2 &&
    tailLen(candlestick) < bodyLen(candlestick)
  );
}

function isBullishHammer(candlestick: Candlestick): boolean {
  return isBullish(candlestick) && isHammer(candlestick);
}

function isBearishHammer(candlestick: Candlestick): boolean {
  return isBearish(candlestick) && isHammer(candlestick);
}

function isBullishInvertedHammer(candlestick: Candlestick): boolean {
  return isBullish(candlestick) && isInvertedHammer(candlestick);
}

function isBearishInvertedHammer(candlestick: Candlestick): boolean {
  return isBearish(candlestick) && isInvertedHammer(candlestick);
}

function isHangingMan(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBullish(previous) &&
    isBearishHammer(current) &&
    hasGapUp(previous, current)
  );
}

function isShootingStar(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBullish(previous) &&
    isBearishInvertedHammer(current) &&
    hasGapUp(previous, current)
  );
}

function isBullishEngulfing(
  previous: Candlestick,
  current: Candlestick,
): boolean {
  return (
    isBearish(previous) && isBullish(current) && isEngulfed(previous, current)
  );
}

function isBearishEngulfing(
  previous: Candlestick,
  current: Candlestick,
): boolean {
  return (
    isBullish(previous) && isBearish(current) && isEngulfed(previous, current)
  );
}

function isBullishHarami(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBearish(previous) && isBullish(current) && isEngulfed(current, previous)
  );
}

function isBearishHarami(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBullish(previous) && isBearish(current) && isEngulfed(current, previous)
  );
}

function isBullishKicker(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBearish(previous) &&
    isBullish(current) &&
    hasGapUp(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current))
  );
}

function isBearishKicker(previous: Candlestick, current: Candlestick): boolean {
  return (
    isBullish(previous) &&
    isBearish(current) &&
    hasGapDown(previous, current) &&
    !(isHammer(current) || isInvertedHammer(current))
  );
}

function findPattern(
  dataArray: Candlestick[],
  callback: (...args: Candlestick[]) => boolean,
): number[] {
  const paramCount = callback.length;
  const upperBound = dataArray.length - paramCount;
  const results: number[] = [];

  for (let i = 0; i <= upperBound; i++) {
    const values: Candlestick[] = [];

    for (let j = 0; j < paramCount; j++) {
      values.push(dataArray[i + j]);
    }

    if (callback(...values)) {
      results.push(i);
    }
  }

  return results;
}

function hammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isHammer);
}

function invertedHammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isInvertedHammer);
}

function bullishHammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBullishHammer);
}

function bearishHammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBearishHammer);
}

function bullishInvertedHammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBullishInvertedHammer);
}

function bearishInvertedHammer(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBearishInvertedHammer);
}

function hangingMan(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isHangingMan);
}

function shootingStar(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isShootingStar);
}

function bullishEngulfing(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBullishEngulfing);
}

function bearishEngulfing(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBearishEngulfing);
}

function bullishHarami(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBullishHarami);
}

function bearishHarami(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBearishHarami);
}

function bullishKicker(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBullishKicker);
}

function bearishKicker(dataArray: Candlestick[]): number[] {
  return findPattern(dataArray, isBearishKicker);
}

export {
  bearishEngulfing,
  bearishHammer,
  bearishHarami,
  bearishInvertedHammer,
  bearishKicker,
  bullishEngulfing,
  bullishHammer,
  bullishHarami,
  bullishInvertedHammer,
  bullishKicker,
  hammer,
  hangingMan,
  invertedHammer,
  shootingStar,
};

export {
  isBearishEngulfing,
  isBearishHammer,
  isBearishHarami,
  isBearishInvertedHammer,
  isBearishKicker,
  isBullishEngulfing,
  isBullishHammer,
  isBullishHarami,
  isBullishInvertedHammer,
  isBullishKicker,
  isHammer,
  isHangingMan,
  isInvertedHammer,
  isShootingStar,
};
