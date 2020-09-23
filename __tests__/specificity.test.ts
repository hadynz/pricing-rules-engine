import { calculateSpecificity, sortBySpecificity } from '../src/lib/specificity';
import { PriceRule } from '../src/lib/types';

const createPriceRule = (
  includeEventType: boolean,
  includeMonth: boolean,
  includeDay: boolean,
): PriceRule => {
  return {
    name: 'Rule under test',
    eventType: includeEventType ? ['Wedding'] : undefined,
    month: includeMonth ? [11] : undefined,
    day: includeDay ? [1] : undefined,
    price: 10,
  };
};

describe('Order Price rules by specificity', () => {
  it('Price rules are sorted by specificity as expected', () => {
    const rule1 = createPriceRule(true, true, true);
    const rule2 = createPriceRule(true, false, true);
    const rule3 = createPriceRule(false, false, true);

    const rules = [rule2, rule3, rule1];
    const sortedRules = [...rules].sort(sortBySpecificity).reverse();

    expect(sortedRules[0]).toEqual(rule1);
    expect(sortedRules[1]).toEqual(rule2);
    expect(sortedRules[2]).toEqual(rule3);
  });
});

describe('Price rule comparison based on specificity', () => {
  it('Same specificity', () => {
    expect(
      sortBySpecificity(
        createPriceRule(true, true, true),
        createPriceRule(true, true, true),
      ),
    ).toEqual(0);

    expect(
      sortBySpecificity(
        createPriceRule(false, true, true),
        createPriceRule(false, true, true),
      ),
    ).toEqual(0);

    expect(
      sortBySpecificity(
        createPriceRule(true, true, false),
        createPriceRule(true, true, false),
      ),
    ).toEqual(0);
  });

  it('Larger than specificity', () => {
    expect(
      sortBySpecificity(
        createPriceRule(true, true, true),
        createPriceRule(true, true, false),
      ),
    ).toEqual(1);

    expect(
      sortBySpecificity(
        createPriceRule(true, true, false),
        createPriceRule(true, false, true),
      ),
    ).toEqual(1);

    expect(
      sortBySpecificity(
        createPriceRule(true, false, false),
        createPriceRule(false, true, true),
      ),
    ).toEqual(1);

    expect(
      sortBySpecificity(
        createPriceRule(false, true, false),
        createPriceRule(false, false, true),
      ),
    ).toEqual(1);
  });
});

describe('Calculate Price Rule specificity', () => {
  it('Event Type, Month and Day', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      eventType: ['Wedding'],
      month: [11],
      day: [1],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(9);
  });

  it('Event Type and Month', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      eventType: ['Wedding'],
      month: [11],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(8);
  });

  it('Event Type and Day', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      eventType: ['Wedding'],
      day: [2],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(6);
  });

  it('Event Type', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      eventType: ['Wedding'],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(5);
  });

  it('Month and Day', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      month: [4],
      day: [4],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(4);
  });

  it('Month', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      month: [4],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(3);
  });

  it('Day', () => {
    const priceRule: PriceRule = {
      name: 'Rule under test',
      day: [4],
      price: 10,
    };

    expect(calculateSpecificity(priceRule)).toEqual(1);
  });
});
