import {
  calculateSpecificity,
  PriceRuleSpecificity,
  sortBySpecificity,
} from './specificity';
import { PriceRule } from './types';

export type PriceStrategyProps = {
  defaultPrice: number;
  rules: PriceRule[];
};

type UserInput = {
  eventType?: string;
  day?: Date;
};

type NormalisedUserInput = {
  eventType?: string;
  day?: number;
  month?: number;
};

type Calculation = {
  price: number;
  matchingRule?: PriceRule;
};

const parseUserInput = (input: UserInput): NormalisedUserInput => {
  return {
    eventType: input.eventType,
    day: input.day?.getDay(),
    month: input.day?.getMonth() + 1,
  };
};

export class PriceStrategy {
  private defaultPrice: number;
  private rules: PriceRule[];

  constructor({ defaultPrice, rules }: PriceStrategyProps) {
    this.defaultPrice = defaultPrice;
    this.rules = [...rules];
  }

  calculate(userInput: UserInput): Calculation {
    const fact = parseUserInput(userInput);

    let result: Calculation = {
      price: this.defaultPrice,
    };

    this.rules.sort(sortBySpecificity).reverse();

    for (let i = 0; i < this.rules.length; i++) {
      const rule = this.rules[i];

      const ruleSpecificity = calculateSpecificity(rule);
      let specificityMatch = 0;

      if (rule.eventType?.includes(fact.eventType)) {
        specificityMatch += PriceRuleSpecificity.EventType;
      }

      if (rule.month?.includes(fact.month)) {
        specificityMatch += PriceRuleSpecificity.Month;
      }

      if (rule.day?.includes(fact.day)) {
        specificityMatch += PriceRuleSpecificity.Day;
      }

      if (specificityMatch === ruleSpecificity) {
        result = {
          price: rule.price,
          matchingRule: rule,
        };
        break;
      }
    }

    return result;
  }
}
