import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function Option({ option }) {
  return (
    <Box
      sx={{
        display: "flex",
        "& > :not(style)": {
          m: 1,
          width: "100%",
          padding: 1,
        },
      }}
    >
      <Card variant="outlined" >
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {option.name}
          </Typography>
          <Typography variant="h5" component="div">
            {option.displayName}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {option.type}
          </Typography>
          <Typography sx={{ mb: 1.5 }} variant="body2">
            {option.description}
          </Typography>
          <TextField
            id="outlined-basic"
            label="Value"
            variant="outlined"
            fullWidth
            defaultValue={option.default}
            size="small"
          />
        </CardContent>
      </Card>
    </Box>
  );
}
