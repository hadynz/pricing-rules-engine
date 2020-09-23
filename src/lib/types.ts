export enum Day {
  Monday = 1,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export type PriceRule = {
  id?: any;
  name?: string;
  eventType?: string[];
  day?: Day[];
  month?: Month[];
  price: number;
};
