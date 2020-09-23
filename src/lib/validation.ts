import * as _ from 'lodash';

export type Dimensions = {
  [key: string]: any[];
};

function hasDuplicateValues(values1: any[], values2: any[]): boolean {
  return _.intersection(values1, values2).length > 0;
}

export const hasDuplicateDimensions = (
  dimensions1: Dimensions,
  dimensions2: Dimensions,
): boolean => {
  const merge = { ...dimensions1, ...dimensions2 };

  const result = Object.keys(merge)
    .map((key) => {
      return hasDuplicateValues(dimensions1[key], dimensions2[key]);
    })
    .every((val) => val === true);

  return result;
};

export const hasAtLeastOneDimension = (dimensions: Dimensions): boolean => {
  return _.findKey(dimensions, _.isArray) !== undefined;
};

export const validateRules = (dimensions: Dimensions[]): boolean => {
  const isValid = dimensions.every(hasAtLeastOneDimension);
  if (!isValid) {
    return false;
  }

  const uniqueRules = _.uniqWith(dimensions, hasDuplicateDimensions);
  return uniqueRules.length === dimensions.length;
};
