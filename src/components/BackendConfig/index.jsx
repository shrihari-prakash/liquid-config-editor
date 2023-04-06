import React, { useEffect, useState } from "react";
import Option from "./Option";
import AppBar from "@mui/material/AppBar";
import { Box, Button, TextField, Typography } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";

const matches = (searchString, option) => {
  const fields = [option.name, option.description];
  return !fields.some((field) =>
    field.toLowerCase().includes(searchString.toLowerCase())
  );
};

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

function fileToText(file, callback) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = () => {
    callback(reader.result);
  };
}

export default function BackendConfig() {
  const [loading, setLoading] = useState();
  const [originalOptions, setOriginalOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState();
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(
      "https://raw.githubusercontent.com/shrihari-prakash/liquid/main/src/service/configuration/options.json"
    )
      .then((response) => response.json())
      .then((options) => {
        setOptions(options);
        setOriginalOptions(JSON.parse(JSON.stringify(options)));
        setLoading(false);
      });
  }, []);

  if (!mounted) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ width: "100%", position: "absolute", top: "0", left: "0" }}>
        <LinearProgress />
      </Box>
    );
  }

  const exportOptions = () => {
    const envVariables = {};
    options.forEach((o, i) => {
      if (o.default != originalOptions[i].default) {
        envVariables[o.envName] = o.default;
      }
    });
    let envString = "";
    for (const key in envVariables) {
      envString += `${key}=${envVariables[key]}\n`;
    }
    download("_.env", envString);
  };

  const importOptions = (e) => {
    const file = e.target.files.item(0);
    fileToText(file, (text) => {
      text = text.split("\n");

      setOptions((options) => {
        const newOptions = [...options];
        text.forEach((line) => {
          const [envName, value] = line.split("=");
          const index = options.findIndex((o) => o.envName === envName);
          if (index !== -1) {
            newOptions[index].default = value;
          }
        });
        return newOptions;
      });
      setMounted(false);
      setTimeout(() => setMounted(true), 0);
    });
  };

  return (
    <>
      <Typography variant="h5" component="div" sx={{ pl: "15px" }}>
        Liquid Option Manager
      </Typography>
      <Typography color="text.secondary" sx={{ pl: "15px" }}>
        {options.length} options in loaded.
      </Typography>
      {options.map((option, index) => {
        if (search && search !== "" && matches(search, option)) {
          return null;
        }
        return (
          <Option
            option={option}
            index={index}
            setOptions={setOptions}
            key={option.name}
            search={search}
          />
        );
      })}
      <AppBar
        position="fixed"
        sx={{ top: 0, p: "15px", flexDirection: "row" }}
        color="inherit"
        enableColorOnDark
      >
        <TextField
          hiddenLabel
          id="filled-hidden-label-small"
          variant="outlined"
          placeholder="Search"
          size="small"
          sx={{ flex: 1, mr: "15px" }}
          onChange={(e) => {
            setSearch(
              e.target.value && e.target.value !== "" ? e.target.value : null
            );
          }}
        />
        <Button variant="outlined" component="label" sx={{ mr: "15px" }}>
          Import
          <input
            hidden
            accept="*"
            onChange={importOptions}
            multiple
            type="file"
          />
        </Button>
        <Button variant="contained" onClick={exportOptions}>
          Export
        </Button>
      </AppBar>
    </>
  );
}
