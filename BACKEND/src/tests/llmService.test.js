const test = require('node:test');
const assert = require('node:assert/strict');
const { validateExtraction } = require('../services/llmService');

test('validateExtraction removes unknown and invalid fields', () => {
  const form = {
    fields: [
      { id: 'vehicleModel', type: 'text', validation: {} },
      { id: 'damageType', type: 'select', options: [{ value: 'collision' }, { value: 'fire' }], validation: {} },
      { id: 'injuries', type: 'checkbox', validation: {} },
    ],
  };

  const result = validateExtraction({
    vehicleModel: 'Honda',
    damageType: 'collision',
    injuries: false,
    madeUpField: 'ignore me',
    badBoolean: 'yes',
  }, form);

  assert.deepEqual(result, {
    vehicleModel: 'Honda',
    damageType: 'collision',
    injuries: false,
  });
});

test('validateExtraction rejects invalid select options', () => {
  const form = { fields: [{ id: 'damageType', type: 'select', options: [{ value: 'collision' }], validation: {} }] };
  assert.deepEqual(validateExtraction({ damageType: 'theft' }, form), {});
});
