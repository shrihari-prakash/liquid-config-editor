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

export default function FrontendOption({
  option,
  value,
  index,
  setOptions,
  search,
  originalOptions,
}) {
  const [mounted, setMounted] = useState(true);

  const onClear = () => {
    setOptions((options) => {
      const newOptions = { ...options };
      newOptions[option] = originalOptions[index];
      return newOptions;
    });
    setMounted(false);
    setTimeout(() => setMounted(true), 0);
  };

  const onChange = (e) =>
    setOptions((options) => {
      const newOptions = { ...options };
      let value = e.target.value;
      if (!isNaN(value)) {
        value = parseInt(value);
      }
      if (value === "true" || value === "false") {
        value = value === "true" ? true : false;
      }
      newOptions[option] = value;
      return newOptions;
    });

  const optimizedOnChange = useCallback(debounce(onChange), []);

  const getHighlightned = (text) => (
    <Highlighter
      searchWords={search ? search.split(" ") : []}
      autoEscape={true}
      textToHighlight={text}
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
              height: "24px",
              display: "flex",
              alignItems: "center",
              mb: "16px",
            }}
            variant="h6"
            component="div"
          >
            {getHighlightned(option)}
            {originalOptions[option] != value && (
              <Chip
                label="Modified"
                size="small"
                color="primary"
                sx={{ ml: "8px" }}
                onDelete={onClear}
              />
            )}
          </Typography>
          {mounted ? (
            <TextField
              label="Value"
              variant="outlined"
              fullWidth
              defaultValue={value}
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
