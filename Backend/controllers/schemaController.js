const schemaService = require('../services/schemaService');

const getDatabaseSchema = async (req, res, next) => {
  try {
    const schema = await schemaService.getSchemaMetadata();
    res.json(schema);
  } catch (err) {
    next(err);
  }
};

const getSampleData = async (req, res, next) => {
  try {
    const { table } = req.query;
    const sample = await schemaService.getSampleFromTable(table);
    res.json(sample);
  } catch (err) {
    next(err);
  }
};

module.exports = { getDatabaseSchema, getSampleData };
