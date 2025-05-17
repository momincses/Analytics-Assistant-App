// src/components/Answer.jsx
import React from "react";
import { Box, Divider, Paper, Typography } from "@mui/material";
import TableRenderer from "./TableRenderer";
import ChartRenderer from "./ChartRenderer";

const Answer = ({ question, answer, sqlQuery, explanation, results, chartData, index }) => {
  if (!answer) return null;

  return (
    <Paper
      elevation={3}
      sx={{ p: 3, mb: 3, backgroundColor: "#222", color: "#fff" }}
    >
      {question && (
        <Typography variant="h6" sx={{ color: "#81c784", mb: 2 }}>
          Q{index ? `#${index}` : ""}: {question}
        </Typography>
      )}

      <Typography variant="h6" gutterBottom sx={{ color: "#90caf9" }}>
        Answer
      </Typography>
      <Typography sx={{ whiteSpace: "pre-line", mb: 2 }}>
        {answer}
      </Typography>

      {sqlQuery && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: "#90caf9" }}>
            SQL Query
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              backgroundColor: "#0f0f0f",
              color: "#90caf9",
              p: 2,
              fontFamily: "monospace",
              mb: 2,
              overflowX: "auto",
            }}
          >
            <pre style={{ margin: 0 }}>
              {sqlQuery.replace(/```sql|```/g, "")}
            </pre>
          </Paper>
        </>
      )}

      {explanation && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: "#90caf9" }}>
            Explanation
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            {explanation
              .split("\n")
              .filter((line) => line.trim().startsWith("*"))
              .map((point, i) => (
                <li key={i}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {point.replace(/^\*\s*/, "")}
                  </Typography>
                </li>
              ))}
          </Box>
        </>
      )}

      {results?.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: "#90caf9" }}>
            Table
          </Typography>
          <TableRenderer data={results} />
        </>
      )}

      {chartData && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ color: "#90caf9" }}>
            Chart
          </Typography>
          <ChartRenderer config={chartData} data={results} />
        </>
      )}
    </Paper>
  );
};

export default Answer;
