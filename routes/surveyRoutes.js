const express = require('express');
const router = express.Router();
const { Survey } = require('../models');

function parseHistoryArray(rawHistory) {
  let value = rawHistory;
  for (let i = 0; i < 4; i++) {
    if (Array.isArray(value)) return [...value];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        value = JSON.parse(trimmed);
      } catch {
        return [];
      }
    } else {
      return [];
    }
  }
  return Array.isArray(value) ? [...value] : [];
}

router.get('/', async (req, res) => {
  try {
    const surveys = await Survey.findAll({ order: [['updatedAt', 'DESC']] });
    res.json(surveys);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/check-username/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { excludeId } = req.query;
    const existing = await Survey.findOne({ where: { villagerUsername: username } });
    if (existing && String(existing.id) !== String(excludeId)) {
      return res.json({ available: false, message: 'Username is already taken by another villager.' });
    }
    res.json({ available: true, message: 'Username is available.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const existing = await Survey.findOne({ where: { villagerUsername: req.body.villagerUsername } });
    if (existing) {
      return res.status(400).json({ error: 'Villager username already exists. Please choose a unique username.' });
    }
    const newSurvey = await Survey.create({
      ...req.body,
      requestHistory: []
    });
    res.status(201).json(newSurvey);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/request-edit', async (req, res) => {
  try {
    const { officerName, reason } = req.body;
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    await survey.update({
      editRequested: true,
      editRequestStatus: 'Pending',
      editRequestReason: reason,
      editRequestedBy: officerName || 'Field Officer',
      editRequestedAt: new Date(),
      adminFeedback: null
    });

    res.json({ success: true, survey });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/resolve-request', async (req, res) => {
  try {
    const { status, adminRemarks, updatedFields } = req.body;
    const survey = await Survey.findByPk(req.params.id);
    if (!survey) return res.status(404).json({ error: 'Survey not found' });

    const rawHistory =
      typeof survey.getDataValue === 'function'
        ? survey.getDataValue('requestHistory')
        : survey.requestHistory;
    const baseHistory = parseHistoryArray(rawHistory);

    const historyEntry = {
      id: Date.now(),
      surveyId: survey.id,
      headOfHousehold: updatedFields?.headOfHousehold || survey.headOfHousehold,
      officer: survey.editRequestedBy || 'Field Officer',
      reason: survey.editRequestReason || 'N/A',
      status: status,
      adminRemarks: adminRemarks || (status === 'Accepted' ? 'Approved and updated by Admin.' : 'Rejected by Admin.'),
      requestedAt: survey.editRequestedAt || new Date(),
      resolvedAt: new Date()
    };

    const nextHistory = [historyEntry, ...baseHistory];

    const sanitizedUpdates = { ...(updatedFields || {}) };
    delete sanitizedUpdates.id;
    delete sanitizedUpdates.requestHistory;
    delete sanitizedUpdates._fromInboxAccept;

    await survey.update({
      ...(status === 'Accepted' ? sanitizedUpdates : {}),
      editRequested: false,
      editRequestStatus: 'None',
      adminFeedback: historyEntry.adminRemarks,
      requestHistory: nextHistory
    });

    res.json({ success: true, survey });
  } catch (err) {
    console.error('❌ Resolve Request Error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    if (req.body.villagerUsername) {
      const existing = await Survey.findOne({ where: { villagerUsername: req.body.villagerUsername } });
      if (existing && String(existing.id) !== String(req.params.id)) {
        return res.status(400).json({ error: 'Username is already taken by another villager.' });
      }
    }
    await Survey.update(req.body, { where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;