// utils/generateAnswer.js

function generateNaturalLanguageAnswer(question, tableData) {
  if (!tableData || !tableData[0] || tableData[0].length === 0) {
    return "No results found.";
  }

  const rows = tableData[0];

  // Example logic for different questions
  if (/top\s+selling\s+product/i.test(question)) {
    const top = rows[0];
    return `The top selling product is ${top.product_name} with total revenue of ₹${top.total_revenue}.`;
  }

  if (/average\s+selling\s+price/i.test(question)) {
    const summary = rows.map(row => `${row.name} sells for ₹${row.average_selling_price} on average.`).join(' ');
    return `The average selling prices are as follows: ${summary}`;
  }

  // Default fallback
  return `Here are the results based on your question: ${rows.length} row(s) found.`;
}

module.exports = { generateNaturalLanguageAnswer };
