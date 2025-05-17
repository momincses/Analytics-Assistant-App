const llmService = require("../services/llmService");
const sqlService = require("../services/sqlService");
const { saveQueryToHistory } = require("./historyController");
const { getSchemaDescription } = require("../utils/getSchema"); // You must implement this

const handleUserQuery = async (req, res, next) => {
  try {
    const { question } = req.body;

    // Step 1: Fetch DB schema to inform LLM
    const schemaDescription = await getSchemaDescription();

    // Step 2: LLM generates SQL + explanation (not chart here)
    const { sql, explanation } = await llmService.generateSQL(
      question,
      schemaDescription
    );

    // Step 3: Execute generated SQL
    const tableData = await sqlService.executeQuery(sql);

    // Step 4: Generate natural language answer + chartConfig
    const { answer, chartConfig } = await llmService.generateNaturalLanguageAnswer(
      question,
      sql,
      tableData
    );

    // Step 5: Save to query history
    await saveQueryToHistory({ question, sql, result_summary: explanation });

    res.json({
      answer,
      explanation,
      sql,
      chartConfig,
      table: tableData,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = { handleUserQuery };
