import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const SideNav = ({ history }) => {
  const scrollToAnswer = (index) => {
    const element = document.getElementById(`answer-${index}`);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Drawer variant="permanent" anchor="left" sx={{ width: 280, backgroundColor: "#1e1e1e"}}>
      <Box sx={{ width: 280, backgroundColor: "#1e1e1e", height: "100%", color: "#fff", p: 2 }}>
        <Typography variant="h6" gutterBottom>
          History
        </Typography>
        <List>
          {history.map((item, i) => (
            <ListItemButton
              key={i}
              onClick={() => scrollToAnswer(i)}
              sx={{ color: "#90caf9", borderBottom: "1px solid #333" }}
            >
              <ListItemText primary={`Q${i + 1}: ${item.question.slice(0, 30)}...`} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SideNav;
