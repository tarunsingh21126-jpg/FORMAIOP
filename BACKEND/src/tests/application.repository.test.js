const assert = require('node:assert/strict');
const { after, test } = require('node:test');

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Application = require('../models/application.model');
const applicationRepository = require('../repositories/application.repository');

let connected = false;

test('persists and retrieves a vehicle claim application', async () => {
  await connectDB();
  connected = true;

  const userId = new mongoose.Types.ObjectId();
  const form = new mongoose.Types.ObjectId();
  let created;

  try {
    created = await applicationRepository.createApplication({
      userId,
      formId: 'insurance-claim',
      form,
      schemaVersion: 1,
      status: 'draft',
      responses: {
        customerName: 'Jane Doe',
        email: 'jane@example.com',
        vehicleModel: 'Honda Civic 2021',
        damageType: 'collision',
        collisionDescription: 'The vehicle was damaged in a rear-end collision.',
        previousClaims: 'no',
        injuries: false,
      },
      progress: {
        completionPercentage: 70,
        completedSections: ['incident', 'contact'],
        currentSection: 'vehicle',
        totalSections: 3,
      },
      documents: [],
      statusHistory: [
        {
          newStatus: 'draft',
          changedBy: userId.toString(),
          reason: 'Application created',
        },
      ],
    });

    const retrieved = await applicationRepository.findApplicationById(created._id);

    assert.ok(retrieved);
    assert.equal(retrieved.userId.toString(), userId.toString());
    assert.equal(retrieved.form.toString(), form.toString());
    assert.equal(retrieved.formId, 'insurance-claim');
    assert.equal(retrieved.schemaVersion, 1);
    assert.equal(retrieved.status, 'draft');
    assert.equal(retrieved.responses.damageType, 'collision');
    assert.equal(retrieved.progress.completionPercentage, 70);
    assert.deepEqual(retrieved.progress.completedSections, ['incident', 'contact']);
    assert.equal(retrieved.progress.currentSection, 'vehicle');
    assert.equal(retrieved.progress.totalSections, 3);
    assert.deepEqual(retrieved.documents, []);
    assert.equal(retrieved.statusHistory[0].newStatus, 'draft');
    assert.equal(retrieved.statusHistory[0].changedBy, userId.toString());
    assert.ok(retrieved.createdAt instanceof Date);
    assert.ok(retrieved.updatedAt instanceof Date);
    assert.equal(retrieved.submission, undefined);
  } finally {
    if (created?._id) {
      await applicationRepository.deleteApplication(created._id);
    }
  }
});

after(async () => {
  if (connected) {
    await mongoose.disconnect();
  }
});