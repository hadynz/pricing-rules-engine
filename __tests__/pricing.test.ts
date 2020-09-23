import { PriceStrategy, PriceStrategyProps } from '../src/lib/pricing';
import { Day, Month } from '../src/lib/types';

describe('Scenario 1', () => {
  let strategy: PriceStrategy;

  const input: PriceStrategyProps = {
    defaultPrice: 300,
    rules: [
      {
        name: 'Wedding only',
        price: 1200,
        eventType: ['Wedding'],
      },
      {
        name: 'Wedding, Fri/Sat',
        price: 1500,
        eventType: ['Wedding'],
        day: [Day.Friday, Day.Saturday],
      },
      {
        name: 'Wedding, June, Fri/Sat',
        price: 1000,
        eventType: ['Wedding'],
        day: [Day.Friday, Day.Saturday],
        month: [Month.June],
      },
    ],
  };

  beforeEach(() => {
    strategy = new PriceStrategy(input);
  });

  it('Booking a kids party costs $300', async () => {
    const price = await strategy.calculate({
      day: new Date(),
    });
    expect(price).toEqual(300);
  });

  it('Booking a wedding on Friday costs $1500', async () => {
    const price = await strategy.calculate({
      eventType: 'Wedding',
      day: new Date('December 25, 2020'), // Friday
    });
    expect(price).toEqual(1500);
  });

  it('Booking a wedding on any other day (than Fri/Sat) costs $1200', async () => {
    const price = await strategy.calculate({
      eventType: 'Wedding',
      day: new Date('December 24, 2020'), // Thursday
    });
    expect(price).toEqual(1200);
  });
});

describe('Scenario 2', () => {
  let strategy: PriceStrategy;

  const input: PriceStrategyProps = {
    defaultPrice: 3000,
    rules: [
      {
        name: 'Nov to Apr, Fri/Sat',
        price: 6950,
        month: [
          Month.November,
          Month.December,
          Month.January,
          Month.February,
          Month.March,
          Month.April,
        ],
        day: [Day.Friday, Day.Saturday],
      },
      {
        name: 'Nov to Apr',
        price: 4950,
        month: [
          Month.November,
          Month.December,
          Month.January,
          Month.February,
          Month.March,
          Month.April,
        ],
      },
      {
        name: 'May to Oct, Fri/Sat',
        price: 5950,
        month: [
          Month.May,
          Month.June,
          Month.July,
          Month.August,
          Month.September,
          Month.October,
        ],
        day: [Day.Friday, Day.Saturday],
      },
      {
        name: 'May to Oct',
        price: 3950,
        month: [
          Month.May,
          Month.June,
          Month.July,
          Month.August,
          Month.September,
          Month.October,
        ],
      },
      {
        name: 'Jun to Sept',
        price: 3950,
        month: [Month.June, Month.July, Month.August, Month.September],
      },
    ],
  };

  beforeEach(() => {
    strategy = new PriceStrategy(input);
  });

  it('Booking on a Saturday in November for $6950', async () => {
    const price = await strategy.calculate({
      day: new Date('November 21, 2020'),
    });
    expect(price).toEqual(6950);
  });

  it('Booking on a non-Fri/Sat in November for $4950', async () => {
    const price = await strategy.calculate({
      day: new Date('November 18, 2020'),
    });
    expect(price).toEqual(4950);
  });

  it('Booking in June for $3950', async () => {
    const price = await strategy.calculate({
      day: new Date('June 1, 2020'),
    });
    expect(price).toEqual(3950);
  });
});