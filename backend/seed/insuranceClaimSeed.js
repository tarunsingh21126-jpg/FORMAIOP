require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const FormSchema = require('../models/FormSchema');

const insuranceClaimForm = {
  formId: 'insurance-claim',
  title: 'Insurance Claim Form',
  description: 'Vehicle accident claim form',
  version: 1,
  fields: [
    {
      id: 'incidentType',
      name: 'incidentType',
      label: 'What type of incident occurred?',
      type: 'select',
      required: true,
      options: ['collision', 'animal_collision', 'theft', 'other'],
      validation: { required: true }
    },
    {
      id: 'incidentDate',
      name: 'incidentDate',
      label: 'When did the incident occur?',
      type: 'date',
      required: true,
      validation: { required: true }
    },
    {
      id: 'location',
      name: 'location',
      label: 'Where did the incident occur?',
      type: 'text',
      required: true,
      placeholder: 'e.g. I-95, Boston MA',
      validation: { required: true, minLength: 3 }
    },
    {
      id: 'vehicleMake',
      name: 'vehicleMake',
      label: 'Vehicle Make',
      type: 'text',
      required: true,
      placeholder: 'e.g. Honda',
      validation: { required: true }
    },
    {
      id: 'vehicleModel',
      name: 'vehicleModel',
      label: 'Vehicle Model',
      type: 'text',
      required: true,
      placeholder: 'e.g. Civic',
      validation: { required: true }
    },
    {
      id: 'wasInjured',
      name: 'wasInjured',
      label: 'Was anyone injured?',
      type: 'checkbox',
      required: false
    },
    {
      id: 'injuryDetails',
      name: 'injuryDetails',
      label: 'Describe the injury',
      type: 'textarea',
      required: false,
      showIf: { field: 'wasInjured', operator: 'equals', value: true },
      validation: { minLength: 5 }
    },
    {
      id: 'otherVehicleInvolved',
      name: 'otherVehicleInvolved',
      label: 'Was another vehicle involved?',
      type: 'checkbox',
      required: false
    },
    {
      id: 'otherVehicleMake',
      name: 'otherVehicleMake',
      label: 'Other Vehicle Make',
      type: 'text',
      required: false,
      showIf: { field: 'otherVehicleInvolved', operator: 'equals', value: true }
    },
    {
      id: 'otherVehicleModel',
      name: 'otherVehicleModel',
      label: 'Other Vehicle Model',
      type: 'text',
      required: false,
      showIf: { field: 'otherVehicleInvolved', operator: 'equals', value: true }
    },
    {
      id: 'otherVehicleDetails',
      name: 'otherVehicleDetails',
      label: 'Describe the other vehicle and driver',
      type: 'textarea',
      required: false,
      showIf: { field: 'otherVehicleInvolved', operator: 'equals', value: true }
    },
    {
      id: 'damageType',
      name: 'damageType',
      label: 'What type of damage occurred?',
      type: 'select',
      required: true,
      options: ['windshield', 'bumper', 'engine', 'tire', 'body_panel', 'other'],
      validation: { required: true }
    },
    {
      id: 'damageSeverity',
      name: 'damageSeverity',
      label: 'How severe is the damage?',
      type: 'radio',
      required: true,
      options: ['minor', 'moderate', 'severe'],
      validation: { required: true }
    },
    {
      id: 'policeReportFiled',
      name: 'policeReportFiled',
      label: 'Was a police report filed?',
      type: 'checkbox',
      required: false
    },
    {
      id: 'policeReportNumber',
      name: 'policeReportNumber',
      label: 'Police Report Number',
      type: 'text',
      required: false,
      showIf: { field: 'policeReportFiled', operator: 'equals', value: true }
    },
    {
      id: 'witnessesPresent',
      name: 'witnessesPresent',
      label: 'Were there any witnesses?',
      type: 'checkbox',
      required: false
    },
    {
      id: 'witnessDetails',
      name: 'witnessDetails',
      label: 'Witness contact details',
      type: 'textarea',
      required: false,
      showIf: { field: 'witnessesPresent', operator: 'equals', value: true }
    },
    {
      id: 'additionalDescription',
      name: 'additionalDescription',
      label: 'Any additional details about the incident?',
      type: 'textarea',
      required: false
    }
  ]
};

const seed = async () => {
  await connectDB();
  await FormSchema.deleteOne({ formId: insuranceClaimForm.formId });
  await FormSchema.create(insuranceClaimForm);
  console.log(`Seeded "${insuranceClaimForm.formId}" with ${insuranceClaimForm.fields.length} fields`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
