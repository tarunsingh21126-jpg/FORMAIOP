/**
 * Seeds the sample "insurance-claim" form into MongoDB.
 *
 * Usage:
 *   npm run seed
 *
 * Safe to run multiple times - it upserts by formId rather than inserting
 * duplicates.
 */

require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Form = require('../models/Form');

const EMAIL_PATTERN = '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$';

const insuranceClaimForm = {
  formId: 'insurance-claim',
  title: 'Insurance Claim Intake Form',
  description:
    'Tell us what happened and we will route your claim to the right team.',
  fields: [
    {
      id: 'customerName',
      type: 'text',
      label: 'Customer name',
      placeholder: 'Jane Doe',
      validation: {
        required: true,
        minLength: 2,
        maxLength: 100,
      },
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'jane@example.com',
      validation: {
        required: true,
        pattern: EMAIL_PATTERN,
        message: 'Enter a valid email address',
        maxLength: 150,
      },
    },
    {
      id: 'vehicleModel',
      type: 'text',
      label: 'Vehicle model',
      placeholder: 'e.g. Honda Civic 2021',
      validation: {
        required: false,
        maxLength: 100,
      },
    },
    {
      id: 'damageType',
      type: 'select',
      label: 'Damage type',
      validation: {
        required: true,
      },
      options: [
        { label: 'Collision', value: 'collision' },
        { label: 'Theft', value: 'theft' },
        { label: 'Fire', value: 'fire' },
        { label: 'Weather', value: 'weather' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      id: 'collisionDescription',
      type: 'textarea',
      label: 'Tell us what happened in the collision',
      placeholder: 'Describe how the collision occurred...',
      validation: {
        required: true,
        minLength: 10,
        maxLength: 1000,
      },
      showIf: {
        field: 'damageType',
        operator: 'equals',
        value: 'collision',
      },
    },
    {
      id: 'previousClaims',
      type: 'select',
      label: 'Have you filed a previous claim with us?',
      validation: {
        required: true,
      },
      options: [
        { label: 'Yes', value: 'yes' },
        { label: 'No', value: 'no' },
      ],
    },
    {
      id: 'previousClaimDetails',
      type: 'textarea',
      label: 'Tell us about your previous claim',
      placeholder: 'When was it, and what was it for?',
      validation: {
        required: true,
        minLength: 10,
        maxLength: 1000,
      },
      showIf: {
        field: 'previousClaims',
        operator: 'equals',
        value: 'yes',
      },
    },
    {
      id: 'injuries',
      type: 'checkbox',
      label: 'Were there any injuries?',
      validation: {
        required: false,
      },
    },
    {
      id: 'injuryDetails',
      type: 'textarea',
      label: 'Please describe the injuries',
      placeholder: 'Who was injured, and how severely?',
      validation: {
        required: true,
        minLength: 10,
        maxLength: 1000,
      },
      showIf: {
        field: 'injuries',
        operator: 'equals',
        value: true,
      },
    },
  ],
};

async function seed() {
  await connectDB();

  const result = await Form.findOneAndUpdate(
    { formId: insuranceClaimForm.formId },
    insuranceClaimForm,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Seeded form "${result.formId}" (${result.fields.length} fields).`);

  await mongoose.connection.close();
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  });
