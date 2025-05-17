// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import History from "./pages/History";
import About from "./pages/About";
import Admin from "./pages/Admin"; // optional

const theme = createTheme({
  palette: {
    mode: "dark",
  },
  typography: {
    fontFamily: "Raleway, sans-serif",
  },
});

function App() {
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  return (
    <Router>
      <Navbar />

      {/* Delay Warning Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: { backgroundColor: "#000", borderRadius: 5, px: 2, py: 1 },
        }}
      >
        <DialogTitle sx={{ color: "#90caf9", fontWeight: "bold", fontSize:"24px" }}>
          ⏳ Please Note
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: "#ccc" }}>
            Thank you for visiting! Since this app is hosted on a free server,
            the backend might take a few seconds to wake up and process your first query.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: "#90caf9",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <Routes>
        <Route
          path="/"
          element={
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Home />
            </ThemeProvider>
          }
        />
        <Route path="/history" element={<History />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
