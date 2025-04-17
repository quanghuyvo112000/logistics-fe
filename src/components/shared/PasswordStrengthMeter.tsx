import React from "react";
import { LinearProgress, Typography, Box, List, ListItem, ListItemText } from "@mui/material";
import zxcvbn from "zxcvbn";

interface Props {
  password: string;
}

const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const result = zxcvbn(password);
  const score = result.score;

  const getColor = (score: number) => {
    switch (score) {
      case 0: return "error";
      case 1: return "error";
      case 2: return "warning";
      case 3: return "info";
      case 4: return "success";
      default: return "error";
    }
  };

  const getLabel = (score: number) => {
    switch (score) {
      case 0: return "Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "Weak";
    }
  };

  const suggestions = [
    "At least one lowercase",
    "At least one uppercase",
    "At least one numeric",
    "Minimum 8 characters",
  ];

  return (
    <Box mt={1}>
      <Typography fontWeight="bold">Pick a password</Typography>
      <LinearProgress
        variant="determinate"
        value={(score + 1) * 20}
        color={getColor(score)}
        sx={{ height: 8, borderRadius: 5, my: 1 }}
      />
      <Typography variant="body2" color="textSecondary">{getLabel(score)}</Typography>

      <Box mt={1}>
        <Typography variant="body2" fontWeight="bold">Suggestions</Typography>
        <List dense>
          {suggestions.map((item, idx) => (
            <ListItem key={idx} sx={{ py: 0 }}>
              <ListItemText primary={`• ${item}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default PasswordStrengthMeter;
