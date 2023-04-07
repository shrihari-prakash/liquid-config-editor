import React, { useCallback, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Highlighter from "react-highlight-words";
import Chip from "@mui/material/Chip";

const debounce = (func) => {
  let timer;
  return function (...args) {
    const context = this;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      func.apply(context, args);
    }, 500);
  };
};

export default function Option({
  option,
  index,
  setOptions,
  search,
  originalOptions,
}) {
  const [mounted, setMounted] = useState(true);

  const onClear = () => {
    setOptions((options) => {
      const newOptions = [...options];
      newOptions[index].default = originalOptions[index].default;
      return newOptions;
    });
    setMounted(false);
    setTimeout(() => setMounted(true), 0);
  };

  const onChange = (e) =>
    setOptions((options) => {
      const newOptions = [...options];
      newOptions[index].default = e.target.value;
      return newOptions;
    });

  const optimizedOnChange = useCallback(debounce(onChange), []);

  const getHighlightned = (key) => (
    <Highlighter
      highlightClassName="YourHighlightClass"
      searchWords={search ? search.split(" ") : []}
      autoEscape={true}
      textToHighlight={option[key]}
    />
  );

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
      <Card variant="outlined">
        <CardContent>
          <Typography
            sx={{
              fontSize: 16,
              height: "24px",
              display: "flex",
              alignItems: "center",
            }}
            color="text.secondary"
            gutterBottom
          >
            {getHighlightned("name")}
            {originalOptions[index].default != option.default && (
              <Chip
                label="Modified"
                size="small"
                color="primary"
                sx={{ ml: "8px" }}
                onDelete={onClear}
              />
            )}
          </Typography>
          <Typography variant="h5" component="div">
            {getHighlightned("displayName")}
          </Typography>
          <Typography sx={{ mb: 1.5, fontSize: 14 }} color="text.secondary">
            {option.type}
          </Typography>
          <Typography sx={{ mb: 1.5 }} variant="body2">
            {getHighlightned("description")}
          </Typography>
          {mounted ? (
            <TextField
              label="Value"
              variant="outlined"
              fullWidth
              defaultValue={option.default}
              size="small"
              onChange={optimizedOnChange}
            />
          ) : (
            <span>
              <TextField
                variant="outlined"
                size="small"
                label="Value"
                fullWidth
              />
            </span>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
