import {
  Dimensions,
  hasDuplicateDimensions,
  hasAtLeastOneDimension,
  validateRules,
} from '../src/validation';

describe('rulesAreOverlapping - overlapping scenarios', () => {
  it('same days only are overlapping', () => {
    const rule1: Dimensions = { day: ['fri'] };
    const rule2: Dimensions = { day: ['thu', 'fri'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('same months only are overlapping', () => {
    const rule1: Dimensions = { month: ['jan'] };
    const rule2: Dimensions = { month: ['dec', 'jan', 'feb'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('days and months are overlapping', () => {
    const rule1: Dimensions = {
      day: ['wed'],
      month: ['dec'],
    };
    const rule2: Dimensions = {
      day: ['wed', 'thu'],
      month: ['dec'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('days and event types are overlapping', () => {
    const rule1: Dimensions = {
      day: ['wed'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = {
      day: ['wed', 'thu'],
      eventType: ['wedding'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('months and event types are overlapping', () => {
    const rule1: Dimensions = {
      month: ['apr'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = {
      month: ['jan', 'feb', 'mar', 'apr'],
      eventType: ['wedding'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('all dimensions are overlapping', () => {
    const rule1: Dimensions = {
      day: ['wed'],
      month: ['dec'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = {
      day: ['wed', 'thu'],
      month: ['dec'],
      eventType: ['wedding'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });

  it('same event types only are overlapping', () => {
    const rule1: Dimensions = { eventType: ['wedding'] };
    const rule2: Dimensions = { eventType: ['wedding'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeTruthy();
  });
});

describe('rulesAreOverlapping - non-overlapping scenarios', () => {
  it('different days that are not overlapping', () => {
    const rule1: Dimensions = { day: ['mon'] };
    const rule2: Dimensions = { day: ['tue'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });
  it('same days, but different months are not overlapping', () => {
    const rule1: Dimensions = { day: ['mon'] };
    const rule2: Dimensions = { day: ['mon'], month: ['dec'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });

  it('same months, but different days are not overlapping', () => {
    const rule1: Dimensions = { month: ['dec', 'jan'] };
    const rule2: Dimensions = { day: ['wed'], month: ['dec'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });

  it('same month and day, but different event types are not overlapping', () => {
    const rule1: Dimensions = {
      day: ['wed'],
      month: ['dec'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = { day: ['wed'], month: ['dec'] };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });

  it('same event type and month, but different days are not overlapping', () => {
    const rule1: Dimensions = {
      month: ['dec', 'jan'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = {
      day: ['thu'],
      month: ['feb', 'jan', 'mar'],
      eventType: ['wedding'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });

  it('same event type and day, but different months are not overlapping', () => {
    const rule1: Dimensions = {
      day: ['thu'],
      month: ['dec', 'jan'],
      eventType: ['wedding'],
    };
    const rule2: Dimensions = {
      day: ['thu'],
      month: ['mar'],
      eventType: ['wedding'],
    };

    const isOverlapping = hasDuplicateDimensions(rule1, rule2);
    expect(isOverlapping).toBeFalsy();
  });
});

describe('ruleHasAtLeastOneDimension - invalid scenarios', () => {
  it('rule with no dimensions is invalid', () => {
    const rule: Dimensions = {};
    const result = hasAtLeastOneDimension(rule);
    expect(result).toBeFalsy();
  });
});

describe('ruleHasAtLeastOneDimension - valid scenarios', () => {
  it('rule with a single dimension only is valid', () => {
    const rule: Dimensions = { day: ['fri'] };
    const result = hasAtLeastOneDimension(rule);
    expect(result).toBeTruthy();
  });

  it('rule with multiple dimensions only is valid', () => {
    const rule: Dimensions = { month: ['jan'], eventType: ['wedding'] };
    const result = hasAtLeastOneDimension(rule);
    expect(result).toBeTruthy();
  });
});

describe('validateRules - invalid scenarios', () => {
  it('two rules with overlapping months', () => {
    const rule1: Dimensions = { month: ['dec', 'jan'] };
    const rule2: Dimensions = { eventType: ['kids-party'] };
    const rule3: Dimensions = { day: ['wed'], month: ['dec'] };
    const rule4: Dimensions = {
      day: ['wed', 'thu'],
      month: ['dec', 'jan'],
    };

    const result = validateRules([rule1, rule2, rule3, rule4]);
    expect(result).toBeFalsy();
  });

  it('two rules with multiple overlapping dimensions', () => {
    const rule1: Dimensions = { month: ['dec'] };
    const rule2: Dimensions = { day: ['wed'], month: ['dec'] };
    const rule3: Dimensions = { day: ['wed'], month: ['nov', 'dec'] };

    const result = validateRules([rule1, rule2, rule3]);
    expect(result).toBeFalsy();
  });

  it('at least one rule with no dimensions defined', () => {
    const rule1: Dimensions = { month: ['dec'] };
    const rule2: Dimensions = {};

    const result = validateRules([rule1, rule2]);
    expect(result).toBeFalsy();
  });
});

describe('validateRules - valid scenarios', () => {
  it('rules are valid', () => {
    const rule1: Dimensions = { month: ['dec', 'jan'] };
    const rule2: Dimensions = { eventType: ['kids-party'] };

    const result = validateRules([rule1, rule2]);
    expect(result).toBeTruthy();
  });
});
