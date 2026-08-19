/**
 * Generic condition engine for evaluating a field's `showIf` rule against
 * the current form values. This has no knowledge of any specific field -
 * it only understands the shape of a condition:
 *
 *   { field: "previousClaims", operator: "equals", value: "yes" }
 *
 * New forms, new fields, and new conditions all work automatically as
 * long as they follow this shape. Do not add per-field branches here.
 */

// Operators this engine knows how to evaluate.
export const OPERATORS = {
  equals: (fieldValue, targetValue) => normalize(fieldValue) === normalize(targetValue),
  notEquals: (fieldValue, targetValue) => normalize(fieldValue) !== normalize(targetValue),
};

/**
 * Normalizes a value for comparison so that, for example, the boolean
 * `true` from a checkbox and the string `"true"` from a schema both
 * compare equal, and `undefined`/`null` are treated as an empty answer.
 */
function normalize(value) {
  if (value === undefined || value === null) return '';
  return String(value);
}

/**
 * Evaluates a single showIf condition against the current form values.
 * A missing condition means "always visible".
 *
 * @param {{field: string, operator: string, value: unknown}|undefined} condition
 * @param {Record<string, unknown>} formValues
 * @returns {boolean}
 */
export function evaluateCondition(condition, formValues = {}) {
  if (!condition) return true;

  const { field, operator = 'equals', value } = condition;
  const evaluator = OPERATORS[operator];

  if (!evaluator) {
    // Unknown operator: fail safe by showing the field rather than
    // silently hiding something the schema author intended to show.
    console.warn(`conditionEngine: unsupported operator "${operator}"`);
    return true;
  }

  const currentValue = formValues ? formValues[field] : undefined;
  return evaluator(currentValue, value);
}

/**
 * Convenience wrapper: is this field currently visible given the form's
 * live values?
 *
 * @param {{showIf?: object}} field
 * @param {Record<string, unknown>} formValues
 * @returns {boolean}
 */
export function isFieldVisible(field, formValues = {}) {
  return evaluateCondition(field?.showIf, formValues);
}
