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
  Popover,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Answer from "../components/Answer";
import SideNav from "../components/SideNav";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [questionInputs, setQuestionInputS] = useState("");
  const [loadingInputS, setLoadingInputS] = useState(false);

  const handleSuggestionClick = (suggestion) => {
    setQuestionInputS(suggestion);
    setAnchorEl(null);
  };
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
      const response = await fetch(
        `https://analytics-assistant-app.onrender.com/api/query`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

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
    <Box display="flex" flexDirection="row" height="100vh">
      {/* Side Navigation */}
      <Box width="250px" flexShrink={0}>
        <SideNav history={history} />
      </Box>

      {/* Main Content Area */}
      <Box display="flex" flexDirection="column" flex={1}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          elevation={1}
          sx={{
            width: "calc(100% - 280px)",
            backgroundColor: "#121212",
            color: "#ffffff",
          }}
        >
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
          sx={{
            backgroundColor: "#1e1e1e",
            marginTop: "50px",
            height: "calc(100vh )",
            paddingBottom: "120px",
          }}
        >
          <Container maxWidth="md">
            {error && (
              <Paper sx={{ p: 2, mb: 2, borderLeft: "4px solid red" }}>
                <Typography color="error">Error: {error}</Typography>
              </Paper>
            )}

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
                        borderRadius: "10px",
                        cursor: "pointer",
                      }}
                    >
                      {sample}
                    </Typography>
                  ))}
                </Stack>
              </Paper>
            )}

            {history.map((item, i) => (
              <div
                key={i}
                id={`answer-${i}`}
                style={{ scrollMarginTop: "80px" }}
              >
                <Answer
                  answer={item.answer}
                  sqlQuery={item.sqlQuery}
                  explanation={item.explanation}
                  results={item.results}
                  chartData={item.chartData}
                  question={item.question}
                  index={i + 1}
                />
              </div>
            ))}
          </Container>
        </Box>

        {/* Input and Button */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          sx={{
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "calc(100% - 235px)",
            zIndex: 1300,
            px: 2,
            py: 1.5,
          }}
        >
          <Box
            sx={{
              width: "calc(100% -250px)",
              maxWidth: 800,
              backgroundColor: "#1e1e1e",
              border: "2px solid black",
              borderRadius: 3,
              padding: 2,
              margin: "0 auto",
              position: "relative",
            }}
          >
            {/* Suggestions Button */}
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8, color: "#90caf9" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <TipsAndUpdatesIcon />
            </IconButton>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "bottom", horizontal: "right" }}
              PaperProps={{
                sx: {
                  width: 600,
                  maxWidth: "90vw",
                  backgroundColor: "rgba(30,30,30,0.95)", // semi-transparent dark
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                  backdropFilter: "blur(8px)", // for frosted-glass effect
                },
              }}
            >
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    mb: 2,
                    color: "#90caf9",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                  }}
                >
                  💡 Suggestions
                </Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {sampleQuestions.map((text, idx) => (
                    <Typography
                      key={idx}
                      onClick={() => handleSuggestionClick(text)}
                      sx={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        px: 2,
                        py: 1.2,
                        borderRadius: 2,
                        color: "#e3f2fd", // light bluish text
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        transition: "all 0.2s ease",
                        "&:hover": {
                          cursor: "pointer",
                          color: "#ffffff",
                          textDecoration: "underline"
                        },
                      }}
                    >
                      {text}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Popover>

            {/* Typing Animation Text */}
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#888",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  borderRight: "2px solid #888",
                  width: "fit-content",
                  fontSize: "0.8rem",
                }}
              >
                Analysing database... generating insights
              </Typography>
            </Box>

            {/* Input Area */}
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
                  backgroundColor: "#2a2a2a",
                  "& .MuiInputBase-input": { color: "#fff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#888",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#90caf9",
                  },
                }}
              />
              <IconButton
                type="submit"
                color="primary"
                disabled={!question.trim() || loading}
                sx={{
                  alignSelf: "flex-end",
                  border: "1px solid #90caf9",
                  color: "white",
                  backgroundColor: "#333",
                  "&:hover": { backgroundColor: "#444" },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <SendIcon />
                )}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
