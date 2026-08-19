import test from 'node:test';
import assert from 'node:assert/strict';

import { evaluateCondition, isFieldVisible } from './conditionEngine.js';

test('evaluateCondition - no condition is always visible', () => {
  assert.equal(evaluateCondition(undefined, {}), true);
});

test('evaluateCondition - equals matches a string value', () => {
  const condition = { field: 'damageType', operator: 'equals', value: 'collision' };
  assert.equal(evaluateCondition(condition, { damageType: 'collision' }), true);
  assert.equal(evaluateCondition(condition, { damageType: 'theft' }), false);
  assert.equal(evaluateCondition(condition, {}), false);
});

test('evaluateCondition - equals matches a boolean checkbox value', () => {
  const condition = { field: 'injuries', operator: 'equals', value: true };
  assert.equal(evaluateCondition(condition, { injuries: true }), true);
  assert.equal(evaluateCondition(condition, { injuries: false }), false);
  assert.equal(evaluateCondition(condition, {}), false);
});

test('evaluateCondition - notEquals inverts the comparison', () => {
  const condition = { field: 'previousClaims', operator: 'notEquals', value: 'yes' };
  assert.equal(evaluateCondition(condition, { previousClaims: 'no' }), true);
  assert.equal(evaluateCondition(condition, { previousClaims: 'yes' }), false);
});

test('evaluateCondition - defaults to equals when operator is omitted', () => {
  const condition = { field: 'damageType', value: 'fire' };
  assert.equal(evaluateCondition(condition, { damageType: 'fire' }), true);
});

test('evaluateCondition - unknown operator fails open (shows the field)', () => {
  const condition = { field: 'x', operator: 'greaterThan', value: 5 };
  assert.equal(evaluateCondition(condition, { x: 1 }), true);
});

test('isFieldVisible - reads showIf off the field definition', () => {
  const field = {
    id: 'collisionDescription',
    showIf: { field: 'damageType', operator: 'equals', value: 'collision' },
  };
  assert.equal(isFieldVisible(field, { damageType: 'collision' }), true);
  assert.equal(isFieldVisible(field, { damageType: 'weather' }), false);
});

test('isFieldVisible - field without showIf is always visible', () => {
  assert.equal(isFieldVisible({ id: 'customerName' }, {}), true);
});
