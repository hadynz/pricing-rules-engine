import { PriceRule } from './types';

export enum PriceRuleSpecificity {
  Day = 1,
  Month = 3,
  EventType = 5,
}

type ComparatorResult = -1 | 0 | 1;

export const calculateSpecificity = (rule: PriceRule): number => {
  let specificity = 0;

  if (rule.eventType?.length > 0) {
    specificity += PriceRuleSpecificity.EventType;
  }

  if (rule.month?.length > 0) {
    specificity += PriceRuleSpecificity.Month;
  }

  if (rule.day?.length > 0) {
    specificity += PriceRuleSpecificity.Day;
  }

  return specificity;
};

export const sortBySpecificity = (
  rule1: PriceRule,
  rule2: PriceRule,
): ComparatorResult => {
  const rule1Specificity = calculateSpecificity(rule1);
  const rule2Specificity = calculateSpecificity(rule2);

  if (rule1Specificity > rule2Specificity) {
    return 1;
  }
  if (rule1Specificity < rule2Specificity) {
    return -1;
  }
  return 0;
};
