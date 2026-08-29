import { useMemo } from 'react';
import { evaluateCondition } from '../utils/evaluateCondition';

/**
 * Given the full field list and the currently watched form values,
 * returns only the fields that should be visible right now.
 */
export function useConditionalFields(fields, watchedValues) {
  return useMemo(() => {
    return fields.filter((field) => evaluateCondition(field.showIf, watchedValues));
  }, [fields, watchedValues]);
}
