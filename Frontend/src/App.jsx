// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import History from "./pages/History";
import About from "./pages/About";
import Admin from "./pages/Admin"; // optional
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";


const theme = createTheme({
  palette: {
    mode: 'dark', // or 'light'
  },
  typography: {
    fontFamily: 'Raleway, sans-serif',
  },
});

function App() {
  return (
    <Router>
      <Navbar />
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
