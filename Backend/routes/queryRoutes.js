const express = require('express');
const router = express.Router();

const { handleUserQuery } = require('../controllers/queryController');
const { getQueryHistory, deleteQueryFromHistory } = require('../controllers/historyController');
const { getDatabaseSchema } = require('../controllers/schemaController');

router.post('/query', handleUserQuery);
router.get('/history', getQueryHistory);
router.delete('/history/:id', deleteQueryFromHistory);
router.get('/schema', getDatabaseSchema);

module.exports = router;
