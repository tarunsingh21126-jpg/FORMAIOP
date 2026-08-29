/**
 * Evaluates a single "showIf" rule against the current form values.
 * This is the ONLY place branching logic lives on the frontend -
 * components never hard-code a condition themselves.
 */
export function evaluateCondition(showIf, values) {
  if (!showIf) return true; // no condition = always visible

  const currentValue = values[showIf.field];

  switch (showIf.operator) {
    case 'equals':
      return currentValue === showIf.value;
    case 'notEquals':
      return currentValue !== showIf.value;
    case 'contains':
      if (Array.isArray(currentValue)) return currentValue.includes(showIf.value);
      if (typeof currentValue === 'string') return currentValue.includes(showIf.value);
      return false;
    default:
      return true;
  }
}
