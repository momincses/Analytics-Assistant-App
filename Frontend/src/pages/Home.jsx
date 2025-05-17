import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Answer from "../components/Answer";

const sampleQuestions = [
  "Find products that are sold despite having missing price information how much is revenue due to those products",
  "Which products contribute the most to revenue but are rarely sold (i.e., low quantity but high total sales value)?",
  "display each categories revenue percetage",
  "Which customers have made purchases where the total price does not match the unit price times quantity , how much difference is there?",
  "Are cheaper items selling better than expensive ones?",
];

const Home = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [explanation, setExplanation] = useState("");
  const [sqlQuery, setSqlQuery] = useState("");
  const [results, setResults] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const contentRef = useRef(null);

  // Load chat history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qa_history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Scroll to bottom on new data
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [history]);

  // Store chat history in localStorage
  const updateHistory = (entry) => {
    const newHistory = [...history, entry];
    setHistory(newHistory);
    localStorage.setItem("qa_history", JSON.stringify(newHistory));
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError("");
    setAnswer("");
    setExplanation("");
    setSqlQuery("");
    setResults([]);
    setChartData(null);

    try {
      const response = await fetch(`http://localhost:5000/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);

      const data = await response.json();

      const entry = {
        question,
        answer: data.answer || "No answer returned.",
        explanation: data.explanation || "No explanation.",
        sqlQuery: data.sql || "",
        results: data.table?.[0]?.result || [],
        chartData: data.chartConfig || null,
      };

      updateHistory(entry);
      setQuestion("");
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sample) => {
    setQuestion(sample);
  };

  const clearHistory = () => {
    localStorage.removeItem("qa_history");
    setHistory([]);
  };

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      {/* AppBar */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Analytics Assistant
          </Typography>
          {history.length > 0 && (
            <Button color="error" variant="outlined" onClick={clearHistory}>
              Clear History
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Scrollable Content */}
      <Box
        ref={contentRef}
        flex={1}
        overflow="auto"
        px={2}
        py={3}
        sx={{ backgroundColor: "#1e1e1e" }}
      >
        <Container maxWidth="md">
          {error && (
            <Paper sx={{ p: 2, mb: 2, borderLeft: "4px solid red" }}>
              <Typography color="error">Error: {error}</Typography>
            </Paper>
          )}

          {/* Show welcome + sample questions if no history */}
          {history.length === 0 && (
            <Paper
              elevation={3}
              sx={{ p: 3, mb: 3, backgroundColor: "#222", color: "#fff" }}
            >
              <Typography variant="h6" gutterBottom>
                👋 Welcome to Analytics Assistant
              </Typography>
              <Typography variant="body1" gutterBottom>
                Ask questions about your data. Here are some examples:
              </Typography>
              <Stack direction="column" spacing={1} mt={2}>
                {sampleQuestions.map((sample, i) => (
                  <Typography
                    key={i}
                    variant="outlined"
                    onClick={() => handleSampleClick(sample)}
                    sx={{
                      textAlign: "left",
                      color: "#90caf9",
                      borderColor: "#90caf9",
                      padding: "10px 20px",
                      border: "0.5px solid #90caf9",
                      borderRadius: "10px"
                    }}
                  >
                    {sample}
                  </Typography>
                ))}
              </Stack>
            </Paper>
          )}

          {/* Q&A History */}
          {history.map((item, i) => (
            <Answer
              key={i}
              answer={item.answer}
              sqlQuery={item.sqlQuery}
              explanation={item.explanation}
              results={item.results}
              chartData={item.chartData}
              question={item.question}
              index={i + 1}
            />
          ))}
        </Container>
      </Box>

      {/* Bottom Chat Input */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        sx={{
          borderTop: "1px solid #333",
          backgroundColor: "#121212",
          px: 2,
          py: 1.5,
        }}
      >
        <Container maxWidth="md">
          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              multiline
              maxRows={3}
              variant="outlined"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{
                flexGrow: 1,
                backgroundColor: "#1e1e1e",
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={!question.trim() || loading}
              sx={{ alignSelf: "flex-end" }}
            >
              {loading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
