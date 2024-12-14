import { Injectable } from '@nestjs/common';

import {
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
} from '../../utils/candlestick';

interface OHLC {
  open: number;
  high: number;
  low: number;
  close: number;
}

enum PatternType {
  HAMMER = 'hammer',
  INVERTED_HAMMER = 'inverted_hammer',
  BULLISH_HAMMER = 'bullish_hammer',
  BEARISH_HAMMER = 'bearish_hammer',
  BULLISH_INVERTED_HAMMER = 'bullish_inverted_hammer',
  BEARISH_INVERTED_HAMMER = 'bearish_inverted_hammer',
  HANGING_MAN = 'hanging_man',
  SHOOTING_STAR = 'shooting_star',
  BULLISH_ENGULFING = 'bullish_engulfing',
  BEARISH_ENGULFING = 'bearish_engulfing',
  BULLISH_HARAMI = 'bullish_harami',
  BEARISH_HARAMI = 'bearish_harami',
  BULLISH_KICKER = 'bullish_kicker',
  BEARISH_KICKER = 'bearish_kicker',
}

interface Pattern {
  name: string;
  description: string;
  type: PatternType;
  metadata: any;
}

@Injectable()
export class CryptoAdvisorService {
  constructor() {}

  public getAvailablePatterns(data: OHLC[]): Pattern[] {
    const patterns: Pattern[] = [];

    // We need at least one candle for single-candle patterns
    if (data.length < 1) return patterns;

    // Check each candle for patterns
    for (let i = 0; i < data.length; i++) {
      const current = data[i];
      const previous = i > 0 ? data[i - 1] : null;

      // Single candlestick patterns
      if (isHammer(current)) {
        patterns.push({
          name: 'Hammer',
          description:
            'A single candlestick pattern indicating potential trend reversal',
          type: PatternType.HAMMER,
          metadata: { index: i },
        });
      }

      if (isInvertedHammer(current)) {
        patterns.push({
          name: 'Inverted Hammer',
          description:
            'A single candlestick pattern indicating potential trend reversal',
          type: PatternType.INVERTED_HAMMER,
          metadata: { index: i },
        });
      }

      if (isBullishHammer(current)) {
        patterns.push({
          name: 'Bullish Hammer',
          description:
            'A bullish single candlestick pattern indicating potential upward trend reversal',
          type: PatternType.BULLISH_HAMMER,
          metadata: { index: i },
        });
      }

      if (isBearishHammer(current)) {
        patterns.push({
          name: 'Bearish Hammer',
          description:
            'A bearish single candlestick pattern indicating potential downward trend reversal',
          type: PatternType.BEARISH_HAMMER,
          metadata: { index: i },
        });
      }

      if (isBullishInvertedHammer(current)) {
        patterns.push({
          name: 'Bullish Inverted Hammer',
          description:
            'A bullish single candlestick pattern indicating potential upward trend reversal',
          type: PatternType.BULLISH_INVERTED_HAMMER,
          metadata: { index: i },
        });
      }

      if (isBearishInvertedHammer(current)) {
        patterns.push({
          name: 'Bearish Inverted Hammer',
          description:
            'A bearish single candlestick pattern indicating potential downward trend reversal',
          type: PatternType.BEARISH_INVERTED_HAMMER,
          metadata: { index: i },
        });
      }

      // Two candlestick patterns (need previous candle)
      if (previous) {
        if (isHangingMan(previous, current)) {
          patterns.push({
            name: 'Hanging Man',
            description:
              'A bearish reversal pattern that forms at the end of an uptrend',
            type: PatternType.HANGING_MAN,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isShootingStar(previous, current)) {
          patterns.push({
            name: 'Shooting Star',
            description:
              'A bearish reversal pattern that forms at the end of an uptrend',
            type: PatternType.SHOOTING_STAR,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBullishEngulfing(previous, current)) {
          patterns.push({
            name: 'Bullish Engulfing',
            description:
              'A bullish reversal pattern where current candle completely engulfs previous candle',
            type: PatternType.BULLISH_ENGULFING,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBearishEngulfing(previous, current)) {
          patterns.push({
            name: 'Bearish Engulfing',
            description:
              'A bearish reversal pattern where current candle completely engulfs previous candle',
            type: PatternType.BEARISH_ENGULFING,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBullishHarami(previous, current)) {
          patterns.push({
            name: 'Bullish Harami',
            description:
              'A bullish reversal pattern where current candle is contained within previous candle',
            type: PatternType.BULLISH_HARAMI,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBearishHarami(previous, current)) {
          patterns.push({
            name: 'Bearish Harami',
            description:
              'A bearish reversal pattern where current candle is contained within previous candle',
            type: PatternType.BEARISH_HARAMI,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBullishKicker(previous, current)) {
          patterns.push({
            name: 'Bullish Kicker',
            description:
              'A strong bullish reversal pattern with a gap up opening',
            type: PatternType.BULLISH_KICKER,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }

        if (isBearishKicker(previous, current)) {
          patterns.push({
            name: 'Bearish Kicker',
            description:
              'A strong bearish reversal pattern with a gap down opening',
            type: PatternType.BEARISH_KICKER,
            metadata: { index: i, previousIndex: i - 1 },
          });
        }
      }
    }

    return patterns;
  }
}
