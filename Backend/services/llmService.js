require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readPrompt = require('../utils/readPrompt');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate SQL + Explanation + Chart
const generateSQL = async (question, schemaDescription) => {
  const basePrompt = readPrompt('queryPrompt.txt');
  const fullPrompt = `${basePrompt}\n\nSchema:\n${schemaDescription}\n\nQuestion: ${question}`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  
  const content = response.text();
  console.log("Raw LLM response:", content ,"Raw LLM response ends here");

  const sql = extractBetween(content, 'SQL:', 'Explanation:');
  const explanation = extractBetween(content, 'Explanation:', '');
  const chartConfig = extractJSON(content, 'Chart:');

  return { sql, explanation, chartConfig };
};

// 🔥 NEW: Generate a plain-language answer from table result
const generateNaturalLanguageAnswer = async (question, sql, tableData) => {
  const prompt = `
You are a helpful AI assistant.

Given:
1. A user's question: "${question}"
2. The SQL used: \`\`\`sql\n${sql}\n\`\`\`
3. The result of the SQL query: ${JSON.stringify(tableData, null, 2)}

Please do the following:
1. Answer the user's question clearly and concisely in plain English.
2. Suggest a chart configuration in this JSON format:
   {
     "type": "bar" | "line" | "pie" | etc.,
     "xKey": "column_name_for_x_axis",
     "yKey": "column_name_for_y_axis",
     "series": ["optional", "series", "column", "names"]
   }

Respond in this exact format:

\`\`\`json
{
  "answer": "Some answer...",
  "chartConfig": {
    "type": "bar",
    "xKey": "something",
    "yKey": "something",
    "series": [...]
  }
}
\`\`\`
`;

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  let rawText = response.text().trim();

  // Remove markdown ```json wrapper
  if (rawText.startsWith("```json")) {
    rawText = rawText.replace(/^```json/, "").replace(/```$/, "").trim();
  }

  // Try parsing the cleaned JSON
  try {
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (err) {
    console.error("Failed to parse chartConfig JSON:", rawText);
    return {
      answer: "Here's the answer, but chartConfig could not be parsed.",
      chartConfig: null,
    };
  }
};

// 🔧 Helper functions
const extractBetween = (text, start, end) => {
  const startIndex = text.indexOf(start);
  if (startIndex === -1) return '';

  const fromStart = text.slice(startIndex + start.length);

  if (!end || text.indexOf(end) === -1) return fromStart.trim(); // if `end` not present, take till end

  const endIndex = fromStart.indexOf(end);
  return fromStart.slice(0, endIndex).trim();
};


const extractJSON = (text, start) => {
  const jsonStart = text.indexOf(start);
  if (jsonStart === -1) return {};
  const jsonPart = text.slice(jsonStart + start.length).trim();
  try {
    return JSON.parse(jsonPart);
  } catch {
    return {};
  }
};

module.exports = {
  generateSQL,
  generateNaturalLanguageAnswer,
};
